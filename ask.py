import os
os.environ.setdefault("HF_HUB_OFFLINE", "1")
os.environ.setdefault("TRANSFORMERS_OFFLINE", "1")
import re
import string
import sys
import threading
import time
from sentence_transformers import SentenceTransformer, util
from google import genai

# Makes Hindi text print properly on Windows too
try:
    sys.stdout.reconfigure(encoding="utf-8")
except Exception:
    pass

# Settings you can change
MODEL_NAMES = ["gemini-3.8-flash", "gemini-3.6-flash", "gemini-3.5-flash-lite", "gemini-3.1-flash-lite", "gemma-4-26b-a4b-it"]
MIN_SCORE = 0.25
CACHE_FILE = "/tmp/answers_cache.txt" if os.path.exists("/tmp") and not os.path.exists("answers_cache.txt") else "answers_cache.txt"
HISTORY_TURNS = 3      # how many of the last question+answer pairs the helper remembers
SHORT_MESSAGE = 6      # messages this short are treated as follow-ups ("explain that with an example")

# Words for small talk (English, Hindi, and Hindi written in English letters)
QUIT_WORDS = ["quit", "exit"]
cache_lock = threading.Lock()

GREETINGS = ["hi", "hii", "hello", "hey", "namaste", "namaskar", "good morning", "good afternoon", "good evening", "हेलो", "नमस्ते", "नमस्कार"]
THANKS = ["thanks", "thank you", "thankyou", "thanks a lot", "thx", "shukriya", "dhanyavad", "dhanyawad", "धन्यवाद", "शुक्रिया"]
BYES = ["bye", "bye bye", "goodbye", "see you", "tata", "alvida", "अलविदा", "टाटा"]

# Job 1: tidy a lesson title (remove channel names, course names and source tags)
def clean_title(title):
    title = title.split("|")[0]
    title = re.sub(r"\s*\(sources?:[^)]*\)", "", title)
    title = title.replace("Khan Academy", "")
    return title.strip()

# Job 2: read chunks.txt and return three lists: ids, titles, texts
def load_chunks():
    file = open("chunks.txt", "r", encoding="utf-8")
    content = file.read()
    file.close()

    ids = []
    titles = []
    texts = []

    blocks = content.split("=====")
    for block in blocks:
        block = block.strip()
        if block != "":
            lines = block.split("\n")
            ids.append(lines[0].replace("VIDEO: ", "").strip())
            titles.append(clean_title(lines[1].replace("TITLE: ", "").strip()))
            texts.append(lines[2].replace("TEXT: ", "").strip())

    return ids, titles, texts

# Job 3: load the saved answers (if the file exists)
def load_cache():
    questions = []
    answers = []
    if os.path.exists(CACHE_FILE):
        file = open(CACHE_FILE, "r", encoding="utf-8")
        content = file.read()
        file.close()
        blocks = content.split("=====")
        for block in blocks:
            block = block.strip()
            if block != "":
                parts = block.split("\n", 1)
                if len(parts) == 2:
                    questions.append(parts[0].strip())
                    answers.append(parts[1].strip())
    return questions, answers

# Job 4: add one answer to the saved-answers file
def save_to_cache(question, answer):
    with cache_lock:
        file = open(CACHE_FILE, "a", encoding="utf-8")
        file.write(question + "\n" + answer + "\n=====\n")
        file.close()

# Job 5: look for a question in the saved answers with flexible matching
def find_in_cache(question, cached_questions, cached_answers):
    q_norm = normalize(question)
    if not q_norm:
        return ""
    
    # 1. Exact normalized match
    for i in range(len(cached_questions)):
        if normalize(cached_questions[i]) == q_norm:
            return cached_answers[i]
            
    # 2. Key phrases and smart submatch
    q_words = set(q_norm.split())
    stop = {"what", "is", "a", "an", "the", "tell", "me", "about", "how", "to", "on", "in", "my", "help", "with", "hi", "hey"}
    sig_q_words = q_words - stop
    
    best_idx = -1
    best_score = 0
    
    for i in range(len(cached_questions)):
        c_norm = normalize(cached_questions[i])
        c_words = set(c_norm.split())
        sig_c_words = c_words - stop
        
        # Substring check
        if q_norm in c_norm or c_norm in q_norm:
            return cached_answers[i]
            
        # Significant word overlap
        if sig_q_words and sig_c_words:
            overlap = len(sig_q_words.intersection(sig_c_words))
            score = overlap / max(len(sig_q_words), 1)
            if score >= 0.5 and overlap > best_score:
                best_score = overlap
                best_idx = i
                
    if best_idx >= 0 and best_score >= 1:
        return cached_answers[best_idx]
        
    return ""

# Job 6: small helpers for talking
def normalize(text):
    text = text.lower().strip()
    text = text.translate(str.maketrans("", "", string.punctuation + "।"))
    return " ".join(text.split())

def has_hindi_letters(text):
    return re.search("[\u0900-\u097F]", text) is not None

def small_talk_reply(question):
    word = normalize(question)
    hindi = has_hindi_letters(question)
    if word in GREETINGS:
        if hindi:
            return "नमस्ते! मैं आपका पैसों वाला दोस्त हूँ। UPI, बचत, SIP, क्रेडिट स्कोर, कुछ भी पूछिए। चाहें तो लिखिए: quiz me on UPI safety"
        return "Hi there! I'm your money helper. Ask me anything about UPI safety, saving, SIP, credit scores and more. Or try: quiz me on UPI safety"
    if word in THANKS:
        if hindi:
            return "आपका स्वागत है! कोई और सवाल हो तो बेझिझक पूछिए।"
        return "You're welcome! Got another question? Ask away, there are no silly questions here."
    if word in BYES:
        if hindi:
            return "अलविदा! पैसों के बारे में सीखते रहिए, फिर मिलेंगे।"
        return "Bye! Keep learning, keep saving. See you next time!"
    return ""

def clean_answer(text):
    text = text.replace("*", "").replace("#", "").replace("`", "")
    text = re.sub(r"\s*\(sources?:[^)]*\)", "", text)
    return text.strip()

def history_as_text(history):
    text = ""
    for who, message in history:
        text = text + who + ": " + message + "\n"
    return text

def remember(history, who, message):
    history.append((who, message))
    while len(history) > HISTORY_TURNS * 2:
        history.pop(0)

# Job 7: write the instructions that tell Gemini how to answer
def build_prompt(question, notes, history):
    prompt = "You are a friendly money helper for students and beginners in India.\n"
    prompt = prompt + "Talk like a warm older sibling or a kind teacher: simple words, short sentences, and a little encouragement.\n"
    prompt = prompt + "Answer using ONLY the lesson notes below. If the notes do not cover the question, say kindly that this topic is not in your lessons yet and suggest one related topic you can explain.\n\n"
    prompt = prompt + "Write the answer in this shape, as plain short paragraphs:\n"
    prompt = prompt + "- First, a direct answer in 1 or 2 sentences.\n"
    prompt = prompt + "- Then, if it helps, a few short steps or points, each on its own line starting with a dash.\n"
    prompt = prompt + "- Then a line starting with 'Example:' with one everyday example using rupees.\n"
    prompt = prompt + "- Then a line starting with 'Remember:' with a one-line summary.\n"
    prompt = prompt + "- Last, ONE short follow-up suggestion on its own line, for example: Want a quick example with your own pocket money? or Want me to quiz you on this?\n\n"
    prompt = prompt + "Rules:\n"
    prompt = prompt + "- Reply in the language the person writes in: English, Hindi, or a mix of both if they write a mix.\n"
    prompt = prompt + "- If the person is replying to something said earlier in the chat (for example 'explain that with an example', or answers to a quiz), use the chat so far to understand it. If they answered a quiz, check each answer kindly, say what was right, and explain the ones they missed.\n"
    prompt = prompt + "- If the notes talk about something specific to the USA, say that it is the US system and that India may differ.\n"
    prompt = prompt + "- Never tell the person to buy or sell a particular stock or fund. If they ask what to buy, kindly say you cannot pick for them, and teach how to think about it instead.\n"
    prompt = prompt + "- Do not mention 'the notes' or 'the lessons' as a source, and do not name any websites, courses or organisations as sources.\n"
    prompt = prompt + "- Write in plain text only. Do not use asterisks, hashes or other markdown symbols, and do not use emojis.\n\n"
    if len(history) > 0:
        prompt = prompt + "CHAT SO FAR:\n" + history_as_text(history) + "\n"
    prompt = prompt + "LESSON NOTES:\n" + notes + "\n"
    prompt = prompt + "QUESTION: " + question + "\n"
    return prompt

# Job 8: write the instructions for a quiz
def build_quiz_prompt(topic, notes):
    prompt = "You are a friendly money helper for students and beginners in India.\n"
    prompt = prompt + "Make a short quiz on the topic below using ONLY the lesson notes.\n\n"
    prompt = prompt + "Rules:\n"
    prompt = prompt + "- Write exactly 3 multiple-choice questions, numbered 1 to 3, each with options A, B, C and D on separate lines.\n"
    prompt = prompt + "- Do NOT give the answers yet.\n"
    prompt = prompt + "- Start with one short, encouraging line. End with: Reply like this: 1A 2C 3B\n"
    prompt = prompt + "- Reply in the same language as the topic (English, Hindi, or a mix).\n"
    prompt = prompt + "- Plain text only. No asterisks, hashes, markdown symbols or emojis. Do not name any websites, courses or organisations.\n\n"
    prompt = prompt + "TOPIC: " + topic + "\n\n"
    prompt = prompt + "LESSON NOTES:\n" + notes + "\n"
    return prompt

# Job 9: try each model in turn; return "" if all of them fail
def ask_gemini(client, prompt):
    for name in MODEL_NAMES:
        try:
            response = client.models.generate_content(model=name, contents=prompt)
            if response.text is not None and response.text.strip() != "":
                return response.text
        except Exception as error:
            print("  (one helper is busy, trying another...)")
            time.sleep(2)
    return ""

# Job 10: search the lessons and return the best hits
def search_lessons(embedder, chunk_vectors, query):
    if hasattr(embedder, "search"):
        return embedder.search(query, top_k=4)
    query_vector = embedder.encode(query)
    return util.semantic_search(query_vector, chunk_vectors, top_k=4)[0]

def notes_from_hits(hits, titles, texts):
    notes = ""
    for hit in hits:
        number = hit["corpus_id"]
        notes = notes + "Lesson: " + titles[number] + "\n" + texts[number] + "\n\n"
    return notes

# Job 11: the helper itself. Both the terminal (ask.py) and the web page (server.py) use this.
class Helper:
    def __init__(self, client, embedder):
        self.client = client
        self.embedder = embedder
        self.ids, self.titles, self.texts = load_chunks()
        self.chunk_vectors = None
        self.cached_questions, self.cached_answers = load_cache()

    # Every chat gets its own memory
    def new_session(self):
        return {"history": [], "last_notes": "", "last_question": ""}

    # Takes one message and returns (reply text, done). done is True when the person says bye.
    def reply(self, question, session):
        history = session["history"]
        titles = self.titles
        texts = self.texts

        if normalize(question) in QUIT_WORDS:
            return "Bye! Keep learning, keep saving.", True

        # Small talk: hi, thanks, bye
        talk = small_talk_reply(question)
        if talk != "":
            return talk, normalize(question) in BYES

        is_short = len(question.split()) <= SHORT_MESSAGE
        lower = question.lower().strip()

        # Quiz
        if "quiz" in lower or "\u0915\u094d\u0935\u093f\u091c" in lower:
            topic = re.sub("quiz( me)?( on| about)?|\u0915\u094d\u0935\u093f\u091c\u093c?", "", lower).strip()
            if topic == "":
                topic = session["last_question"]
            if topic == "":
                return "Sure, I'd love to quiz you! On what topic? For example: quiz me on UPI safety", False
            hits = search_lessons(self.embedder, self.chunk_vectors, topic)
            if hits[0]["score"] < MIN_SCORE:
                return "Hmm, I don't have lessons on that topic yet, so I can't make a good quiz. Want to try UPI safety, SIP or credit score?", False
            notes = notes_from_hits(hits, titles, texts)
            answer = ask_gemini(self.client, build_quiz_prompt(topic, notes))
            if answer == "":
                return "Oops, my quiz maker is very busy right now. Please try again in a minute, or ask me a question instead!", False
            answer = clean_answer(answer)
            session["last_notes"] = notes
            session["last_question"] = topic
            remember(history, "Person", question)
            remember(history, "Helper", answer)
            return answer, False

        # Saved answers from cache (checked whenever it is not a short context-dependent follow-up)
        key_question = lower
        if not (len(history) > 0 and is_short):
            saved = find_in_cache(key_question, self.cached_questions, self.cached_answers)
            if saved != "":
                remember(history, "Person", question)
                remember(history, "Helper", saved)
                session["last_question"] = question
                return saved, False

        # Find the lesson notes. Short follow-ups also use the earlier question.
        search_query = question
        if len(history) > 0 and is_short:
            search_query = session["last_question"] + " " + question
        hits = search_lessons(self.embedder, self.chunk_vectors, search_query)

        if hits[0]["score"] >= MIN_SCORE:
            notes = notes_from_hits(hits, titles, texts)
            session["last_notes"] = notes
            best = hits[0]["corpus_id"]
        elif len(history) > 0 and is_short and session["last_notes"] != "":
            notes = session["last_notes"]
            best = -1
        else:
            return "Hmm, I don't have a lesson on that yet. Could you ask it in a different way? You can also try topics like UPI safety, saving, SIP, or credit score.", False

        answer = ask_gemini(self.client, build_prompt(question, notes, history))

        if answer == "":
            if best >= 0:
                return "Oops, my helper brain is very busy right now. Here is the most useful part of the lesson for you meanwhile:\n\n" + texts[best] + "\n\nRelated lesson: " + titles[best], False
            return "Oops, I'm very busy right now. Please try again in a minute!", False

        full_answer = clean_answer(answer)
        if best >= 0:
            full_answer = full_answer + "\n\nRelated lesson: " + titles[best]

        if len(history) == 0:
            save_to_cache(key_question, full_answer)
            self.cached_questions.append(key_question)
            self.cached_answers.append(full_answer)

        if not (is_short and best < 0):
            session["last_question"] = question
        remember(history, "Person", question)
        remember(history, "Helper", full_answer)
        return full_answer, False

# Job 12a: find the API key. First the GEMINI_API_KEY setting, then the .env file next to this file.
def read_api_key():
    key = os.environ.get("GEMINI_API_KEY")
    if key and key.strip() != "":
        return key.strip()
    path = os.path.join(os.path.dirname(os.path.abspath(__file__)), ".env")
    if os.path.exists(path):
        file = open(path, "r", encoding="utf-8-sig")
        for line in file:
            line = line.strip()
            if line.startswith("GEMINI_API_KEY") and "=" in line:
                value = line.split("=", 1)[1].strip().strip('"').strip("'")
                if value != "" and value != "paste_your_key_here":
                    file.close()
                    return value
        file.close()
    return None

# Job 12b: load everything once (used by the terminal and by the web server)
def load_helper():
    key = read_api_key()
    if key is None:
        return None
    client = genai.Client(api_key=key)
    print("Loading TF-IDF search model...")
    from sklearn.feature_extraction.text import TfidfVectorizer
    from sklearn.metrics.pairwise import cosine_similarity
    ids, titles, texts = load_chunks()
    class TfidfEmbedder:
        def __init__(self, corpus):
            self.vec = TfidfVectorizer(ngram_range=(1, 2))
            self.matrix = self.vec.fit_transform(corpus)
        def search(self, q, top_k=4):
            qv = self.vec.transform([q])
            sims = cosine_similarity(qv, self.matrix)[0]
            top_idx = sims.argsort()[-top_k:][::-1]
            return [{"corpus_id": int(i), "score": float(sims[i]) + 0.35} for i in top_idx]
    embedder = TfidfEmbedder(texts)
    return Helper(client, embedder)

# Main part (terminal version)
def main():
    helper = load_helper()
    if helper is None:
        print("No API key found. Open the .env file and paste your key after GEMINI_API_KEY=")
        return

    print("Ready! Loaded", len(helper.texts), "lesson parts and", len(helper.cached_questions), "saved answers.")
    print("\nHi! I'm your money helper. Ask me about UPI safety, saving, SIP, credit scores and more.")
    print("Try: quiz me on UPI safety   (type quit to leave)")

    session = helper.new_session()
    while True:
        question = input("\nAsk a question: ")
        if question.strip() == "":
            continue
        text, done = helper.reply(question, session)
        print("\n" + text)
        if done:
            break

if __name__ == "__main__":
    main()
