
import pypdf
import json
import re

pdf_path = '/Users/seanli/Downloads/202601智管家產品目錄 V1.1.pdf'

def extract_text_from_pdf(pdf_path):
    try:
        reader = pypdf.PdfReader(pdf_path)
        text_content = ""
        for page in reader.pages:
            text_content += page.extract_text() + "\n---PAGE BREAK---\n"
        return text_content
    except Exception as e:
        return str(e)

text = extract_text_from_pdf(pdf_path)
print(text)
