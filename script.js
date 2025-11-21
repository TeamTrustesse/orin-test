// Global variables (ensure these are present at the top of your script.js)
const introScreen = document.getElementById('intro-screen'); 
const startButton = document.getElementById('startButton');   
const questionSection = document.getElementById('question-section');
// ... other global variables ...

// Global tracking for the current question index
let currentQuestionIndex = 0;


/**
 * Renders the question UI blocks. (Keep the original renderQuestions function)
 */
function renderQuestions() {
    // ... (Your existing renderQuestions function code goes here) ...
    // ... Make sure the question block creation ends with:
    
    QUIZ_DATA.questions.forEach((q, index) => {
        // ... (questionBlock setup) ...
        
        // **IMPORTANT:** Add a fixed top position to stack them correctly
        questionBlock.style.top = `${index * 50}px`; // Adjust 50px as needed for spacing
        
        // Only show the first question initially
        if (index === 0) {
            questionBlock.classList.add('active');
        }
        
        // ... (questionBlock.innerHTML setup) ...
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
    currentQuestionIndex = nextIndex; // Update global index

    if (nextIndex < NUM_QUESTIONS) {
        // 1. Update active class for visual clarity
        const currentBlock = document.querySelector(`.question-block[data-question-id="${questionId}"]`);
        const nextQuestionId = QUIZ_DATA.questions[nextIndex].id;
        const nextBlock = document.querySelector(`.question-block[data-question-id="${nextQuestionId}"]`);
        
        if (currentBlock) currentBlock.classList.remove('active');
        if (nextBlock) nextBlock.classList.add('active');

        // 2. SCROLL TO CENTER THE NEW ACTIVE QUESTION
        // Calculate the height required to center the next question block
        const blockHeight = nextBlock.offsetHeight; // Get the computed height of the block
        const containerHeight = questionSection.clientHeight;

        // Target scroll position: center the next question block
        // (Block's top position - (Container height / 2) + (Block height / 2))
        const targetScroll = (nextIndex * 50) - (containerHeight / 2) + (blockHeight / 2);

        questionSection.scrollTo({
            top: targetScroll,
            behavior: 'smooth'
        });

    } else if (answeredCount === NUM_QUESTIONS) {
        // Quiz completed
        setTimeout(showResults, 500); 
    }
}


// --- INITIALIZATION & START BUTTON LOGIC ---

document.addEventListener('DOMContentLoaded', () => {
    // 1. Render all questions
    renderQuestions();
    
    // 2. Add the event listener for the start button
    if (startButton) {
        startButton.addEventListener('click', () => {
            introScreen.style.display = 'none'; // Hide the welcome screen
            questionSection.style.display = 'block'; // Show the quiz questions

            // SCROLL TO CENTER THE FIRST QUESTION (Index 0)
            const firstBlock = document.querySelector('.question-block.active');
            if (firstBlock) {
                 const blockHeight = firstBlock.offsetHeight;
                 const containerHeight = questionSection.clientHeight;
                 // Center the first question (which is at top: 0px)
                 const initialScroll = 0 - (containerHeight / 2) + (blockHeight / 2);
                 questionSection.scrollTo({
                     top: initialScroll,
                     behavior: 'auto'
                 });
            }
        });
    }
});
// (Keep the existing showResults function below this logic)
