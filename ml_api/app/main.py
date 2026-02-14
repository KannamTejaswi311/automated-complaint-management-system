from flask import Flask, request, jsonify
import joblib
import os
import sys
import pandas as pd
from duplicate_check import check_duplicate

app = Flask(__name__)

# === Load trained NLP models ===
try:
    print("📂 Current working directory:", os.getcwd())
    base_dir = os.path.dirname(os.path.abspath(__file__))

    category_model_path = os.path.join(base_dir, "..", "models", "category_model.pkl")
    urgency_model_path = os.path.join(base_dir, "..", "models", "urgency_model.pkl")
    vectorizer_path = os.path.join(base_dir, "..", "models", "tfidf_vectorizer.pkl")

    print("📄 Loading models from:")
    print(" -", category_model_path)
    print(" -", urgency_model_path)
    print(" -", vectorizer_path)

    category_model = joblib.load(category_model_path)
    urgency_model = joblib.load(urgency_model_path)
    vectorizer = joblib.load(vectorizer_path)

    print("✅ Models loaded successfully!")
except Exception as e:
    print("❌ Error loading models:", e)
    sys.exit(1)

# === Load existing complaints ===
DATA_PATH = os.path.join(base_dir, "..", "data", "sample_complaints.csv")
try:
    df = pd.read_csv(DATA_PATH)
except Exception:
    df = pd.DataFrame(columns=["complaint_text", "category", "urgency"])


# === Helper: urgency -> priority score ===
def get_priority_score(urgency):
    mapping = {
        "Low": 1,
        "Normal": 2,
        "Medium": 2,
        "High": 3,
        "Urgent": 3,
        "Critical": 4
    }
    return mapping.get(urgency, 2)


# =========================
# PREDICT CATEGORY & URGENCY
# =========================
@app.route("/predict", methods=["POST"])
def predict():
    data = request.get_json()
    text = data.get("text", "").strip()

    if not text:
        return jsonify({"error": "No complaint text provided"}), 400

    X = vectorizer.transform([text])

    category = category_model.predict(X)[0]
    urgency = urgency_model.predict(X)[0]

    urgent_keywords = [
        "urgent", "immediate", "asap", "no water", "leak",
        "electric", "fire", "broken", "accident", "emergency", "blocked"
    ]

    if any(word in text.lower() for word in urgent_keywords):
        urgency = "High"

    # Save complaint text for analytics (optional)
    global df
    new_row = {
        "complaint_text": text,
        "category": category,
        "urgency": urgency
    }
    df.loc[len(df)] = new_row
    df.to_csv(DATA_PATH, index=False)

    assigned_department = {
        "Hostel": "Hostel Maintenance",
        "Mess": "Mess Committee",
        "Transport": "Transport Dept",
        "IT": "IT Support",
        "Library": "Library Admin",
        "Academics": "Academic Affairs",
        "General": "General Office",
    }.get(category, "General Office")

    return jsonify({
        "category": category,
        "urgency": urgency,
        "assigned_department": assigned_department
    })


# =========================
# DUPLICATE CHECK API (FIXED)
# =========================
@app.route("/check-duplicate", methods=["POST"])
def check_duplicate_api():
    data = request.get_json()

    new_complaint = data.get("newComplaint", "")
    existing_complaints = data.get("existingComplaints", [])

    similarity = check_duplicate(
        new_complaint,
        existing_complaints,
        vectorizer
    )

    return jsonify({
        "similarity": float(similarity)
    })


# =========================
# GET COMPLAINTS SORTED BY URGENCY
# =========================
@app.route("/get_complaints", methods=["GET"])
def get_complaints():
    df_copy = df.copy()
    df_copy["priority_score"] = df_copy["urgency"].apply(get_priority_score)

    df_sorted = df_copy.sort_values(
        by="priority_score",
        ascending=False
    )

    complaints_list = df_sorted.drop(
        columns=["priority_score"]
    ).to_dict(orient="records")

    return jsonify({"complaints": complaints_list})


if __name__ == "__main__":
    app.run(port=8000, debug=True)
