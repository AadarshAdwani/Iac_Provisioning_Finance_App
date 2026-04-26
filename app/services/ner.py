import spacy
import re

# Load spaCy model
try:
    nlp = spacy.load("en_core_web_sm")
except:
    # Fallback if model isn't downloaded
    import os
    os.system("python -m spacy download en_core_web_sm")
    nlp = spacy.load("en_core_web_sm")

def extract_entities(text: str):
    doc = nlp(text)
    
    data = {
        "amount": None,
        "date": None,
        "transaction_id": None
    }

    # 1. Improved Amount Extraction
    # Matches: 5000, $5000, Rs. 5000, 5,000
    amount_match = re.search(r"(?:₹|\$|rs\.?|Rs\.?)?\s?(\d+(?:,\d+)*)", text, re.IGNORECASE)
    if amount_match:
        data["amount"] = amount_match.group(1).replace(",", "")

    # 2. Improved Date Extraction
    # We use spaCy's "DATE" entity first, fallback to regex
    for ent in doc.ents:
        if ent.label_ == "DATE":
            data["date"] = ent.text
            break
    
    if not data["date"]:
        # Fallback Regex: Matches "5 April", "April 5", "05-04", etc.
        date_pattern = r"(\d{1,2}(?:st|nd|rd|th)?\s+(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*|(?:\d{1,2}[/-]\d{1,2}[/-]\d{2,4}))"
        date_match = re.search(date_pattern, text, re.IGNORECASE)
        if date_match:
            data["date"] = date_match.group()

    # 3. Transaction ID Extraction
    # Matches "TXN" followed by any alphanumeric characters
    txn_match = re.search(r"(TXN[A-Z0-9]+)", text, re.IGNORECASE)
    if txn_match:
        data["transaction_id"] = txn_match.group(1)

    return data