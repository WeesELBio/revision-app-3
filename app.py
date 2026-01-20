from flask import Flask, render_template, jsonify, request
import json
import random

app = Flask(__name__)

with open("questions.json", "r") as f:
    QUESTIONS = json.load(f)


@app.route("/")
def index():
    return render_template("index.html")


@app.route("/get_structure")
def get_structure():
    structure = {}

    for q in QUESTIONS:
        s = q["subject"]
        t = q["topic"]
        st = q["subtopic"]

        structure.setdefault(s, {})
        structure[s].setdefault(t, set())
        structure[s][t].add(st)

    for s in structure:
        for t in structure[s]:
            structure[s][t] = list(structure[s][t])

    return jsonify(structure)


@app.route("/get_questions", methods=["POST"])
def get_questions():
    data = request.json
    selected = []

    for q in QUESTIONS:
        if q["subtopic"] in data["subtopics"]:
            selected.append(q)

    random.shuffle(selected)
    return jsonify(selected)


if __name__ == "__main__":
    app.run(debug=True)
