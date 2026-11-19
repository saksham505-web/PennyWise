import sys
import time
import threading
from flask import Flask, request, jsonify, send_from_directory
from ask import load_helper

app = Flask(__name__, static_folder="static", static_url_path="/static")

helper = load_helper()
if helper is None:
    print("No API key found. Open the .env file, paste your key after GEMINI_API_KEY=, save, then run this again.")
    sys.exit(1)

MAX_SESSIONS = 200
sessions = {}          # chat id -> {"session": ..., "last_used": ...}
sessions_lock = threading.Lock()

def get_session(chat_id):
    with sessions_lock:
        if chat_id not in sessions:
            if len(sessions) >= MAX_SESSIONS:
                oldest = min(sessions, key=lambda k: sessions[k]["last_used"])
                del sessions[oldest]
            sessions[chat_id] = {"session": helper.new_session(), "last_used": time.time()}
        sessions[chat_id]["last_used"] = time.time()
        return sessions[chat_id]["session"]

@app.route("/")
def home():
    return send_from_directory("static", "index.html")

@app.route("/assets/<path:path>")
def assets(path):
    return send_from_directory("static/assets", path)

@app.after_request
def add_cors_headers(response):
    response.headers["Access-Control-Allow-Origin"] = "*"
    response.headers["Access-Control-Allow-Headers"] = "Content-Type,Authorization"
    response.headers["Access-Control-Allow-Methods"] = "GET,POST,OPTIONS"
    return response

@app.route("/api/quick-answers", methods=["GET"])
def quick_answers():
    try:
        from ask import load_cache
        questions, answers = load_cache()
        items = []
        for q, a in zip(questions, answers):
            lines = [line.strip() for line in a.split("\n") if line.strip() and not line.startswith("-") and not line.startswith("Remember") and not line.startswith("Example")]
            preview = lines[0] if lines else a[:100]
            items.append({
                "question": q,
                "preview": preview,
                "answer": a
            })
        return jsonify({"items": items})
    except Exception as e:
        print("Error reading cache:", e)
        return jsonify({"items": []})

@app.route("/api/chat", methods=["POST", "OPTIONS"])
def chat():
    if request.method == "OPTIONS":
        return jsonify({"status": "ok"})
    data = request.get_json(silent=True) or {}
    message = str(data.get("message", "")).strip()[:500]
    chat_id = str(data.get("session_id", "default"))[:64]
    if message == "":
        return jsonify({"reply": "I didn't catch that. Could you type your question again?", "done": False})
    try:
        text, done = helper.reply(message, get_session(chat_id))
        return jsonify({"reply": text, "done": done})
    except Exception as error:
        print("Error:", error)
        return jsonify({"reply": "Oops, something went wrong on my side. Please try again in a moment!", "done": False}), 500

if __name__ == "__main__":
    print("\nMoney Llama is ready! Open http://127.0.0.1:5000 in your browser.")
    app.run(host="127.0.0.1", port=5000, debug=False, threaded=True)
