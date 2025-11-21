let questions = [];

fetch('questions.json')
  .then(response => response.json())
  .then(data => {
    questions = data;
  });

const quizForm = document.getElementById("quiz-form");
const questionsContainer = document.getElementById("questions-container");
const startButton = document.getElementById("start-test");
const emailInput = document.getElementById("email");
const resultSection = document.getElementById("result-section");
const resultsList = document.getElementById("results");

startButton.addEventListener("click", () => {
  if (questions.length === 0) return alert("Questions not loaded yet. Please wait.");
  document.getElementById("email-section").style.display = "none";
  quizForm.style.display = "block";
  renderQuestions();
});

function renderQuestions() {
  questionsContainer.innerHTML = "";
  questions.forEach((q,index)=>{
    const div = document.createElement("div");
    div.classList.add("question");
    div.innerHTML = `
      <p>${index+1}. ${q.q}</p>
      <select data-index="${index}">
        <option value="">Select</option>
        <option value="1">Strongly Disagree</option>
        <option value="2">Disagree</option>
        <option value="3">Neutral</option>
        <option value="4">Agree</option>
        <option value="5">Strongly Agree</option>
      </select>
    `;
    questionsContainer.appendChild(div);
  });
}

// Role mapping remains the same
const roleMap = {
  SE: [0,8,14,16,17,20,21],
  PM: [2,7,11,13,15,16,19,22,23],
  QA: [3,6,8,12,18,23,24],
  DA: [1,6,12,14,17,20,24],
  BA: [4,5,9,13,15,21,22],
  "UI/UX": [4,7,10,18],
  Cyber: [0,1,8,14,17,20]
};

quizForm.addEventListener("submit", (e)=>{
  e.preventDefault();
  const answers = [...quizForm.querySelectorAll("select")].map(s=>parseInt(s.value)||0);
  const scores = {};
  for(const role in roleMap){
    const indexes = roleMap[role];
    const total = indexes.reduce((sum,i)=>sum+(answers[i]||0),0);
    scores[role] = (total/indexes.length).toFixed(2);
  }

  quizForm.style.display = "none";
  resultSection.style.display = "block";

  const sortedRoles = Object.entries(scores).sort((a,b)=>b[1]-a[1]);
  resultsList.innerHTML = "";
  sortedRoles.slice(0,3).forEach(([role,score])=>{
    const li = document.createElement("li");
    li.textContent = `${role} - ${score}`;
    resultsList.appendChild(li);
  });
});
