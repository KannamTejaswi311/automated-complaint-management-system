from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from datetime import datetime
from app import mongo

chat_queries_bp = Blueprint("chat_queries", __name__)

# ---------------- STUDENT: SUBMIT QUERY ----------------
@chat_queries_bp.route("/api/chat_queries", methods=["POST"])
@jwt_required()
def submit_query():
    student_id = get_jwt_identity()
    data = request.get_json()

    query = {
        "student_id": student_id,
        "message": data.get("message"),
        "reply": None,
        "created_at": datetime.utcnow()
    }

    mongo.db.chat_queries.insert_one(query)
    query["_id"] = str(query["_id"])
    return jsonify(query), 201


# ---------------- STUDENT: VIEW OWN QUERIES ----------------
@chat_queries_bp.route("/api/chat_queries/my", methods=["GET"])
@jwt_required()
def get_my_queries():
    student_id = get_jwt_identity()

    queries = list(
        mongo.db.chat_queries.find(
            {"student_id": student_id},
            {"student_id": 0}
        ).sort("created_at", -1)
    )

    for q in queries:
        q["_id"] = str(q["_id"])

    return jsonify(queries), 200


# ---------------- ADMIN: VIEW ALL QUERIES ----------------
@chat_queries_bp.route("/api/chat_queries", methods=["GET"])
@jwt_required()
def get_all_queries():
    queries = list(mongo.db.chat_queries.find().sort("created_at", -1))

    for q in queries:
        q["_id"] = str(q["_id"])

    return jsonify(queries), 200


# ---------------- ADMIN: REPLY TO QUERY ----------------
@chat_queries_bp.route("/api/chat_queries/<query_id>/reply", methods=["POST"])
@jwt_required()
def reply_query(query_id):
    data = request.get_json()

    mongo.db.chat_queries.update_one(
        {"_id": mongo.db.ObjectId(query_id)},
        {"$set": {"reply": data.get("reply")}}
    )

    return jsonify({"message": "Reply sent successfully"}), 200
