// Global variables
const questionSection = document.getElementById('question-section');
const resultsSection = document.getElementById('results-section');
const resultsList = document.getElementById('results-list');
const progressBar = document.querySelector('.progress-bar');

const NUM_QUESTIONS = QUIZ_DATA.questions.length;
const userAnswers = {}; // { questionId: score }

// --- CORE FUNCTIONS ---

/**
 * Renders the question UI blocks.
 */
function renderQuestions() {
    questionSection.innerHTML = ''; // Clear loading message

    QUIZ_DATA.questions.forEach((q, index) => {
        const questionBlock = document.createElement('div');
        questionBlock.className = 'question-block';
        questionBlock.dataset.questionId = q.id;
        
        // Only show the first question initially
        if (index === 0) {
            questionBlock.classList.add('active');
        }

        questionBlock.innerHTML = `
            <p class="question-text">
                <span class="question-number">Question ${index + 1} of ${NUM_QUESTIONS}:</span> ${q.text}
            </p>
            <div class="options-container">
                <span class="options-label">Disagree</span>
                <div class="options-wrapper">
                    ${[1, 2, 3, 4, 5].map(score => `
                        <label>
                            <input 
                                type="radio" 
                                class="option-input" 
                                name="q${q.id}" 
                                value="${score}"
                                onclick="handleAnswer(${q.id}, ${score}, ${index})"
                            >
                            <div class="option-circle"></div>
                        </label>
                    `).join('')}
                </div>
                <span class="options-label">Agree</span>
            </div>
        `;
        questionSection.appendChild(questionBlock);
    });
}

/**
 * Handles an answer selection, records the score, and advances the quiz.
 * @param {number} questionId - The ID of the question.
 * @param {number} score - The selected score (1-5).
 * @param {number} currentIndex - The index of the current question.
 */
function handleAnswer(questionId, score, currentIndex) {
    userAnswers[questionId] = score;

    // Update progress bar
    const answeredCount = Object.keys(userAnswers).length;
    const progressPercentage = (answeredCount / NUM_QUESTIONS) * 100;
    progressBar.style.width = `${progressPercentage}%`;

    // Move to the next question
    const nextIndex = currentIndex + 1;
    if (nextIndex < NUM_QUESTIONS) {
        // Hide current, show next
        const currentBlock = document.querySelector(`.question-block[data-question-id="${questionId}"]`);
        const nextQuestionId = QUIZ_DATA.questions[nextIndex].id;
        const nextBlock = document.querySelector(`.question-block[data-question-id="${nextQuestionId}"]`);
        
        if (currentBlock) currentBlock.classList.remove('active');
        if (nextBlock) nextBlock.classList.add('active');

    } else if (answeredCount === NUM_QUESTIONS) {
        // Quiz completed
        setTimeout(showResults, 500); // Small delay for visual transition
    }
}


/**
 * Calculates scores and displays the results.
 */
function showResults() {
    questionSection.style.display = 'none';
    
    // 1. Calculate Scores for Each Role
    const roleScores = QUIZ_DATA.roles.map(role => {
        let totalScore = 0;
        let answeredQuestionsCount = 0;

        role.questions.forEach(qId => {
            const score = userAnswers[qId];
            if (score !== undefined) {
                totalScore += score;
                answeredQuestionsCount++;
            }
        });

        // 2. Calculate Average Score (1-5)
        const averageScore = answeredQuestionsCount > 0 ? (totalScore / answeredQuestionsCount) : 0;
        
        return {
            name: role.name,
            average: averageScore,
            total: totalScore,
            count: answeredQuestionsCount
        };
    });

    // 3. Sort by Average Score (Highest first)
    roleScores.sort((a, b) => b.average - a.average);

    // 4. Determine Top 2 Recommended Paths
    const topRoles = roleScores.slice(0, 2);

    // 5. Render Results
    resultsList.innerHTML = '';
    topRoles.forEach((role, index) => {
        const card = document.createElement('div');
        card.className = `result-card ${index === 0 ? 'first-place' : ''}`;
        
        // Format the score to two decimal places
        const formattedScore = role.average.toFixed(2);
        
        card.innerHTML = `
            <h3>${index === 0 ? '🥇' : '🥈'} ${role.name}</h3>
            <p>Score: ${formattedScore} / 5.00</p>
            <p style="font-size:0.9em; color:#666;">
                (Based on ${role.count} relevant questions)
            </p>
        `;
        resultsList.appendChild(card);
    });

    resultsSection.style.display = 'block';
}

// --- INITIALIZATION ---
document.addEventListener('DOMContentLoaded', () => {
    renderQuestions();
});
