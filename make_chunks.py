import os
import re

# Job 0: tidy a title (remove channel names, course names and source tags)
def clean_title(title):
    title = title.split("|")[0]
    title = re.sub(r"\s*\(sources?:[^)]*\)", "", title)
    title = title.replace("Khan Academy", "")
    return title.strip()

# Job 1: read a file; the first line is the title, the rest is the text
def read_file(path):
    file = open(path, "r", encoding="utf-8")
    text = file.read()
    file.close()
    lines = text.split("\n", 1)
    title = clean_title(lines[0].replace("TITLE: ", "").strip())
    body = ""
    if len(lines) > 1:
        body = " ".join(lines[1].split())
    return title, body

# Job 2: cut a long text into chunks of words
def split_into_chunks(text, size, overlap):
    words = text.split()
    chunks = []
    start = 0
    while start < len(words):
        piece = words[start:start + size]
        chunks.append(" ".join(piece))
        if start + size >= len(words):
            break
        start = start + size - overlap
    return chunks

# Job 3: chunk every .txt file in a folder and write the chunks out
def process_folder(folder, output):
    count = 0
    if os.path.exists(folder):
        for filename in os.listdir(folder):
            if filename.endswith(".txt"):
                title, body = read_file(folder + "/" + filename)
                chunks = split_into_chunks(body, 150, 30)
                for chunk in chunks:
                    output.write("VIDEO: " + filename + "\n")
                    output.write("TITLE: " + title + "\n")
                    output.write("TEXT: " + chunk + "\n")
                    output.write("=====\n")
                    count = count + 1
                print(title, "->", len(chunks), "chunks")
    else:
        print("Folder not found:", folder)
    return count

# Main part
output = open("chunks.txt", "w", encoding="utf-8")
total = 0
total = total + process_folder("transcripts", output)
total = total + process_folder("knowledge", output)
output.close()
print("Total chunks:", total)