let questions = [];
let current = 0;
let correctAnswer = "";
let selected = "";

/* ---------------- DROPDOWN TOGGLE ---------------- */

document.getElementById("topicButton").onclick = () => {
    document.getElementById("topics").classList.toggle("show");
};

/* ---------------- LOAD STRUCTURE ---------------- */

fetch("/get_structure")
.then(res => res.json())
.then(structure => {
    const container = document.getElementById("topics");

    for (const subject in structure) {
        const s = document.createElement("strong");
        s.innerText = subject;
        container.appendChild(s);

        for (const topic in structure[subject]) {
            const t = document.createElement("div");
            t.style.marginLeft = "10px";
            t.innerText = topic;
            container.appendChild(t);

            structure[subject][topic].forEach(sub => {
                const label = document.createElement("label");
                label.style.marginLeft = "25px";

                const cb = document.createElement("input");
                cb.type = "checkbox";
                cb.value = sub;
                cb.checked = true;

                label.appendChild(cb);
                label.append(" " + sub);
                container.appendChild(label);
            });
        }

        container.appendChild(document.createElement("hr"));
    }

    loadQuestions();
});

/* ---------------- QUESTION LOADING ---------------- */

function getSelectedSubtopics() {
    return Array.from(
        document.querySelectorAll("#topics input:checked")
    ).map(cb => cb.value);
}

function loadQuestions() {
    fetch("/get_questions", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({
            subtopics: getSelectedSubtopics()
        })
    })
    .then(res => res.json())
    .then(data => {
        questions = data;
        current = 0;
        loadQuestion();
    });
}

/* ---------------- QUIZ LOGIC ---------------- */

function loadQuestion() {
    if (questions.length === 0) {
        document.getElementById("question-box").innerText =
            "No questions selected.";
        document.getElementById("answers").innerHTML = "";
        return;
    }

    let q = questions[current];
    document.getElementById("question-box").innerText = q.question;
    document.getElementById("feedback").innerText = "";

    correctAnswer = q.answer;
    selected = "";

    let mode = document.getElementById("mode").value;
    let answersDiv = document.getElementById("answers");
    let hardInput = document.getElementById("hard-answer");

    answersDiv.innerHTML = "";
    hardInput.value = "";
    hardInput.style.display = "none";

    if (mode === "normal") {
        let options = [...q.options].sort(() => Math.random() - 0.5);
        options.forEach(opt => {
            let btn = document.createElement("button");
            btn.innerText = opt;
            btn.onclick = () => selected = opt;
            answersDiv.appendChild(btn);
        });
    } else {
        hardInput.style.display = "block";
    }
}

function checkAnswer() {
    let mode = document.getElementById("mode").value;
    let userAnswer =
        mode === "normal"
            ? selected
            : document.getElementById("hard-answer").value.trim();

    let feedback = document.getElementById("feedback");

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
