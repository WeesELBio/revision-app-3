let questions = [];
let current = 0;
let correctAnswer = "";

fetch("/get_questions", {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({
        subjects: ["Biology", "Chemistry"],
        topics: ["Biological molecules", "Atomic structure"],
        subtopics: [
            "Carbohydrates - monosaccharides",
            "Isotopes"
        ]
    })
})
.then(res => res.json())
.then(data => {
    questions = data;
    loadQuestion();
});

function loadQuestion() {
    let q = questions[current];
    document.getElementById("question-box").innerText = q.question;
    document.getElementById("feedback").innerText = "";

    correctAnswer = q.answer;

    let mode = document.getElementById("mode").value;
    let answersDiv = document.getElementById("answers");
    let hardInput = document.getElementById("hard-answer");

    answersDiv.innerHTML = "";
    hardInput.style.display = "none";

    if (mode === "normal") {
        let options = [...q.options].sort(() => Math.random() - 0.5);
        options.forEach(opt => {
            let btn = document.createElement("button");
            btn.innerText = opt;
            btn.onclick = () => selectAnswer(opt);
            answersDiv.appendChild(btn);
        });
    } else {
        hardInput.style.display = "block";
    }
}

let selected = "";

function selectAnswer(ans) {
    selected = ans;
}

function checkAnswer() {
    let mode = document.getElementById("mode").value;
    let feedback = document.getElementById("feedback");

    let userAnswer = "";

    if (mode === "normal") {
        userAnswer = selected;
    } else {
        userAnswer = document.getElementById("hard-answer").value.trim();
    }

    if (userAnswer === correctAnswer) {
        feedback.innerText = "Correct";
    } else {
        feedback.innerText = "Wrong. Correct answer: " + correctAnswer;
    }
}

function nextQuestion() {
    current++;
    if (current >= questions.length) {
        alert("Finished all questions.");
        return;
    }
    loadQuestion();
}
