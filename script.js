let questionsData = {};
let categories = [];
let currentCategoryIndex = 0;
let userAnswers = [];

const quizForm = document.getElementById("quiz-form");
const questionsContainer = document.getElementById("quiz-form");
const startButton = document.getElementById("start-test");
const resultSection = document.getElementById("result-section");
const resultsList = document.getElementById("results");
const progressBar = document.getElementById("progress-bar");
const progressBarContainer = document.getElementById("progress-bar-container");

fetch('questions.json')
  .then(res => res.json())
  .then(data => {
    questionsData = data;
    categories = Object.keys(data);
  });

startButton.addEventListener("click", () => {
  document.getElementById("email-section").style.display = "none";
  quizForm.style.display = "block";
  progressBarContainer.style.display = "block";
  renderCategory();
});

function renderCategory() {
  questionsContainer.innerHTML = '';
  const category = categories[currentCategoryIndex];
  const questions = questionsData[category];

  questions.forEach((q, index) => {
    const div = document.createElement("div");
    div.className = 'radio-group';
    div.innerHTML = `
      <p>${q.q}</p>
      <label><input type="radio" name="q${index}" value="1"> 1</label>
      <label><input type="radio" name="q${index}" value="2"> 2</label>
      <label><input type="radio" name="q${index}" value="3"> 3</label>
      <label><input type="radio" name="q${index}" value="4"> 4</label>
      <label><input type="radio" name="q${index}" value="5"> 5</label>
    `;
    questionsContainer.appendChild(div);
  });

  const nextBtn = document.createElement("button");
  nextBtn.textContent = currentCategoryIndex === categories.length - 1 ? 'Submit Test' : 'Next';
  nextBtn.type = 'button';
  nextBtn.addEventListener('click', nextCategory);
  questionsContainer.appendChild(nextBtn);

  updateProgress();
}

function nextCategory() {
  const radios = [...quizForm.querySelectorAll('input[type=radio]:checked')];
  if(radios.length === 0){
    alert('Please answer at least one question in this category.');
    return;
  }
  userAnswers.push(...radios.map(r => parseInt(r.value)));

  if(currentCategoryIndex < categories.length - 1){
    currentCategoryIndex++;
    renderCategory();
  } else {
    showResults();
  }
}

function updateProgress(){
  progressBar.style.width = `${((currentCategoryIndex)/categories.length)*100}%`;
}

function showResults(){
  quizForm.style.display = 'none';
  progressBarContainer.style.display = 'none';
  resultSection.style.display = 'block';

  resultsList.innerHTML = categories.map((c,i) => `<li>${c} - Score: ${userAnswers[i] || 0}</li>`).join('');
}
