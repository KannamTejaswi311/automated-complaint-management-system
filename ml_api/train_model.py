# ml_api/train_model.py

import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
import joblib
import os

# Paths
DATA_PATH = "data/sample_complaints.csv"
MODEL_DIR = "models"
os.makedirs(MODEL_DIR, exist_ok=True)

# Load dataset
df = pd.read_csv(DATA_PATH)
print(f"✅ Loaded {len(df)} complaints from {DATA_PATH}")

# Features and labels
X = df["complaint_text"]
y_category = df["category"]
y_urgency = df["urgency"]

# Convert text into numerical features
vectorizer = TfidfVectorizer(stop_words="english", max_features=1000)
X_vec = vectorizer.fit_transform(X)

# Train Category Model
category_model = LogisticRegression(max_iter=1000)
category_model.fit(X_vec, y_category)
print("✅ Trained category model")

# Train Urgency Model
urgency_model = LogisticRegression(max_iter=1000)
urgency_model.fit(X_vec, y_urgency)
print("✅ Trained urgency model")

# Save all models
joblib.dump(vectorizer, os.path.join(MODEL_DIR, "tfidf_vectorizer.pkl"))
joblib.dump(category_model, os.path.join(MODEL_DIR, "category_model.pkl"))
joblib.dump(urgency_model, os.path.join(MODEL_DIR, "urgency_model.pkl"))

print(f"✅ Models saved in '{MODEL_DIR}'")
