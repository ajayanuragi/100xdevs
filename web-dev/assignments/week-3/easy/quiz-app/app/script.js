import { quizData } from "../app/data.js";

const quizContainer = document.getElementById('quiz-container');
const submit = document.getElementById("submit");

let currentQuestionIndex = 0;
let score = 0;

function loadQuestion() {
    quizContainer.innerHTML = '';

    const quiz = quizData[currentQuestionIndex];
    const questionBlock = document.createElement('fieldset');
    questionBlock.className = 'question';
    questionBlock.innerHTML = `
        <legend>${quiz.question}</legend>
        <div>
            <label>
                <input type="radio" name="question${currentQuestionIndex}" value="a">${quiz.a}
            </label>
        </div>
        <div>
            <label>
                <input type="radio" name="question${currentQuestionIndex}" value="b">${quiz.b}
            </label>
        </div>
        <div>
            <label>
                <input type="radio" name="question${currentQuestionIndex}" value="c">${quiz.c}
            </label>
        </div>
        <div>
            <label>
                <input type="radio" name="question${currentQuestionIndex}" value="d">${quiz.d}
            </label>
        </div>
    `;
    quizContainer.appendChild(questionBlock);
}

submit.addEventListener("click", () => {
    const selected = document.querySelector(`input[name="question${currentQuestionIndex}"]:checked`);
    if (selected && selected.value === quizData[currentQuestionIndex].correct) {
        score++;
    }

    currentQuestionIndex++;

    if (currentQuestionIndex < quizData.length) {
        loadQuestion();
    } else {
        alert(`You scored ${score} out of ${quizData.length}`);
        currentQuestionIndex = 0;
        score = 0;
        loadQuestion();
    }
});

loadQuestion();