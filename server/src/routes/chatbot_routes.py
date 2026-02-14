from flask import Blueprint, request, jsonify
from datetime import datetime
import random

chatbot_bp = Blueprint("chatbot", __name__)

# Simple predefined FAQ dataset
FAQS = {
    "how to track my complaint": "You can view the status in your dashboard under 'My Complaints Status'.",
    "average resolution time": "Usually within 3–5 working days depending on urgency.",
    "how to contact admin": "You can send a message here — the admin will get notified."
}

@chatbot_bp.route("/api/chatbot", methods=["POST"])
def chatbot_reply():
    data = request.get_json()
    message = data.get("message", "").lower()

    # Basic FAQ matching
    for q, a in FAQS.items():
        if q in message:
            return jsonify({"reply": a})

    # If not found → forward to admin inbox (store in DB)
    from app import mongo  # adjust import as per your setup
    mongo.db.chat_queries.insert_one({
        "message": message,
        "sender": "student",
        "reply": None,
        "timestamp": datetime.now()
    })

    return jsonify({"reply": "I’ve forwarded your query to the admin. You’ll get a reply soon."})
