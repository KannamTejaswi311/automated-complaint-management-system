from flask import Blueprint, request, jsonify
from model_inference import predict_category_and_urgency

nlp_routes = Blueprint("nlp_routes", __name__)

@nlp_routes.route("/predict", methods=["POST"])
def predict():
    data = request.get_json()
    complaint_text = data.get("complaint", "")

    if not complaint_text:
        return jsonify({"error": "No complaint text provided"}), 400

    category, urgency, assigned_department = predict_category_and_urgency(complaint_text)

    return jsonify({
        "category": category,
        "urgency": urgency,
        "assigned_department": assigned_department
    })
