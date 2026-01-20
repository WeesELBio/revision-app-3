from flask import Flask, render_template, jsonify, request
import json
import random

app = Flask(__name__)

with open("questions.json", "r") as f:
    QUESTIONS = json.load(f)


@app.route("/")
def index():
    return render_template("index.html")


@app.route("/get_questions", methods=["POST"])
def get_questions():
    data = request.json
    selected = []

    for q in QUESTIONS:
        if (
            q["subject"] in data["subjects"] and
            q["topic"] in data["topics"] and
            q["subtopic"] in data["subtopics"]
        ):
            selected.append(q)

    random.shuffle(selected)
    return jsonify(selected)


if __name__ == "__main__":
    app.run(debug=True)
