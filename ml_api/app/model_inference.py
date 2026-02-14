import pickle
from npl_processing import preprocess_text

# Load models and vectorizer
vectorizer = pickle.load(open("./models/tfidf_vectorizer.pkl", "rb"))
category_model = pickle.load(open("./models/category_model.pkl", "rb"))
urgency_model = pickle.load(open("./models/urgency_model.pkl", "rb"))

def predict_category_and_urgency(complaint_text):
    cleaned = preprocess_text(complaint_text)
    X = vectorizer.transform([cleaned])

    category = category_model.predict(X)[0]
    urgency = urgency_model.predict(X)[0]

    # Example routing logic
    dept_map = {
        "Hostel": "Hostel Maintenance",
        "Transport": "Transport Dept",
        "Library": "Library Dept",
        "Academics": "Academic Affairs",
    }
    assigned_department = dept_map.get(category, "General Office")

    return category, urgency, assigned_department
