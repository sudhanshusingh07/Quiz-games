let Questions = [];
const quesTag = document.getElementById("ques");

async function fetchQuestion() {
    try {
        const resp = await fetch("https://opentdb.com/api.php?amount=10");
        if (!resp.ok) {
            throw new Error("Could not fetch questions!");
        }
        const data = await resp.json();
        Questions = data.results;
    } catch (err) {
        console.error(err);
        quesTag.innerHTML = `<h5 style="color:red">${err}</h5>`;
    }
}

let currentQuestion = 0;
let score = 0;

if (Questions.length === 0) {
    quesTag.innerHTML = `<h5>Please Wait! <br> Loading Questions...</h5>`;
}

function loadQues() {
    const opt = document.getElementById('opt');

    let currQuesText = Questions[currentQuestion].question;
    quesTag.innerHTML = currQuesText;

    opt.innerHTML = "";
    const correctAnswer = Questions[currentQuestion].correct_answer;
    const incorrectAnswers = Questions[currentQuestion].incorrect_answers;

    const options = [correctAnswer, ...incorrectAnswers];
    options.sort(() => Math.random() - 0.5);

    options.forEach((option, idx) => {
        const optDiv = document.createElement('div');
        const optionTag = document.createElement('input');
        const labelTag = document.createElement('label');

        optionTag.type = "radio";
        optionTag.name = 'answer';
        optionTag.value = option;
        optionTag.id = `option${idx}`;

        labelTag.textContent = option;
        labelTag.htmlFor = `option${idx}`;

        optDiv.appendChild(optionTag);
        optDiv.appendChild(labelTag);

        opt.appendChild(optDiv);
    });
}

setTimeout(() => {
    loadQues();
    if (Questions.length === 0) {
        quesTag.innerHTML = `<h5 style="color:red">Unable to fetch data, Please try again!</h5>`;
    }
}, 2000);

function checkAnswer() {
    const selectedAnswer = document.querySelector(
        'input[name="answer"]:checked'
    );

    if (selectedAnswer && selectedAnswer.value === Questions[currentQuestion].correct_answer) {
        score++;
    }
    nextQuestion();
}

function nextQuestion() {
    if (currentQuestion < Questions.length - 1) {
        currentQuestion++;
        loadQues();
    } else {
        document.getElementById("opt").remove();
        document.getElementById("ques").remove();
        document.getElementById("btn").remove();
        showTotal();
    }
}

function showTotal() {
    const totalScore = document.getElementById('score');
    totalScore.innerHTML = `Your Score: ${score}/10`;
    Questions.forEach((ques, idx) => {
        totalScore.innerHTML += `<p>Question ${idx + 1}: ${ques.correct_answer}</p>`;
    });
}

fetchQuestion();
