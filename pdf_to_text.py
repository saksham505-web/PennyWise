import os
from pypdf import PdfReader

# Job 1: read a PDF and return all its text as one string
def pdf_to_text(path):
    reader = PdfReader(path)
    text = ""
    for page in reader.pages:
        page_text = page.extract_text()
        if page_text is not None:
            text = text + page_text + " "
    text = " ".join(text.split())
    return text

# Main part
if not os.path.exists("knowledge"):
    os.mkdir("knowledge")

for filename in os.listdir("official_pdfs"):
    if filename.lower().endswith(".pdf"):
        print("Reading", filename)
        text = pdf_to_text("official_pdfs/" + filename)
        name = filename[:-4]
        out = open("knowledge/" + name + ".txt", "w", encoding="utf-8")
        out.write("TITLE: " + name + "\n")
        out.write(text)
        out.close()
        print("  characters:", len(text))