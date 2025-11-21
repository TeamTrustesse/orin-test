const startButton = document.getElementById("startButton");
const introScreen = document.getElementById("intro-screen");
const questionSection = document.getElementById("question-section");
const resultsSection = document.getElementById("results-section");
const resultsList = document.getElementById("results-list");
const restartButton = document.getElementById("restart-button");
const beginButton = document.getElementById("begin-button");
const nextStepContainer = document.getElementById("next-step-container");

let answers = {};

startButton.addEventListener("click", () => {
    introScreen.style.display = "none";
    questionSection.style.display = "block";
    loadQuestions();
});

// Button after results
beginButton.addEventListener("click", function () {
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
    QUIZ_DATA.questions.forEach((q, index) => {
        const block = document.createElement("div");
        block.className = "question-block";
        if (index === 0) block.classList.add("active");
        block.id = `question-${q.id}`;

        block.innerHTML = `
            <div class="question-text">${q.text}</div>

            <div class="options-container">
                <div class="option-label-left">Disagree</div>

                <div class="options-wrapper">
                    ${[1,2,3,4,5].map(n => `
                        <label>
                            <input type="radio" name="q${q.id}" class="option-input" value="${n}" />
                            <div class="option-circle" data-size="${n}"></div>
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
    if (nextBlock) {
        currentBlock.classList.remove("active");
        nextBlock.classList.add("active");
        nextBlock.scrollIntoView({ behavior: "smooth", block: "center" });
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

    const winner = scores[0];
    const second = scores[1];
    const third = scores[2];

    // Winner card
    const topCard = document.createElement("div");
    topCard.className = "result-card winner";
    topCard.innerHTML = `<h3>${winner.name}</h3><p>${winner.score}</p>`;
    resultsList.appendChild(topCard);

    // Create bottom row wrapper
    const bottomRow = document.createElement("div");
    bottomRow.className = "result-bottom-row";

    [second, third].forEach(r => {
        const card = document.createElement("div");
        card.className = "small-card";
        card.innerHTML = `<h3>${r.name}</h3><p>${r.score}</p>`;
        bottomRow.appendChild(card);
    });

    resultsList.appendChild(bottomRow);

    document.getElementById("next-step-container").style.display = "block";
}

