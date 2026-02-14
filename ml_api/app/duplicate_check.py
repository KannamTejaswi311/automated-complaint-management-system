from sklearn.metrics.pairwise import cosine_similarity

def check_duplicate(new_text, existing_texts, vectorizer):
    if not existing_texts:
        return 0.0

    existing_vectors = vectorizer.transform(existing_texts)
    new_vector = vectorizer.transform([new_text])

    similarities = cosine_similarity(new_vector, existing_vectors)[0]
    return float(max(similarities))
