const startButton = document.getElementById("startButton");
const introScreen = document.getElementById("intro-screen");
const questionSection = document.getElementById("question-section");
const resultsSection = document.getElementById("results-section");
const resultsList = document.getElementById("results-list");
const restartButton = document.getElementById("restart-button");

let answers = {};

startButton.addEventListener("click", () => {
    introScreen.style.display = "none";
    questionSection.style.display = "block";
    loadQuestions();
});

document.getElementById('begin-button').addEventListener('click', function () {
    // Change to your next step page
    alert("Awesome! Let's get started.");
    // window.location.href = "next-step.html";
});


restartButton.addEventListener("click", () => {
    resultsSection.style.display = "none";
    introScreen.style.display = "block";
    answers = {};
    questionSection.innerHTML = "";
});

function loadQuestions() {
    questionSection.innerHTML = "";
    QUIZ_DATA.questions.forEach((q,index) => {
        const block = document.createElement("div");
        block.className = "question-block";
        if(index===0) block.classList.add("active");
        block.id = `question-${q.id}`;
        block.innerHTML = `
            <div class="question-text">${q.text}</div>
            <div class="options-container">
                <div class="option-label-left">Disagree</div>
                <div class="options-wrapper">
                    ${[1,2,3,4,5].map(n => `
                        <label>
                            <input type="radio" name="q${q.id}" class="option-input" value="${n}" />
                            <div class="option-circle"></div>
                        </label>`).join('')}
                </div>
                <div class="option-label-right">Agree</div>
            </div>
        `;
        questionSection.appendChild(block);

        const inputs = block.querySelectorAll("input");
        inputs.forEach(input => {
            input.addEventListener("change", () => {
                answers[q.id] = parseInt(input.value);
                goToNextQuestion(block);
            });
        });
    });
}

function goToNextQuestion(currentBlock) {
    const nextBlock = currentBlock.nextElementSibling;
    if(nextBlock) {
        currentBlock.classList.remove("active");
        nextBlock.classList.add("active");
        nextBlock.scrollIntoView({behavior:"smooth", block:"center"});
    } else {
        showResults();
    }
}

function showResults() {
    questionSection.style.display = "none";
    resultsSection.style.display = "block";
    resultsList.innerHTML = "";

    const scores = QUIZ_DATA.roles.map(role => {
        const total = role.questions.reduce((sum,qid) => sum + (answers[qid] || 0),0);
        return { name: role.name, score: total };
    });
    scores.sort((a,b) => b.score - a.score);

    scores.forEach((r,i) => {
        const card = document.createElement("div");
        card.className = "result-card";
        if(i===0) card.classList.add("winner");
        card.innerHTML = `<h3>${r.name}</h3><p>${r.score}</p>`;
        resultsList.appendChild(card);
    });
}
