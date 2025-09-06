from flask import Flask, request, jsonify
import faiss
import pickle
from sentence_transformers import SentenceTransformer
import numpy as np

app = Flask(__name__)

# Load saved FAISS index and product data on startup
index = faiss.read_index("/Users/apple/Practice/BuyWise/buy-wise-data/product_embeddings.index")
with open("/Users/apple/Practice/BuyWise/buy-wise-data/product_data.pkl", "rb") as f:
    product_df = pickle.load(f)

embedding_model = SentenceTransformer('all-MiniLM-L6-v2')

@app.route('/search', methods=['POST'])
def search():
    data = request.json
    query_text = data.get('query', '')
    if not query_text:
        return jsonify({"error": "Query text missing"}), 400

    query_embedding = embedding_model.encode([query_text])
    distances, indices = index.search(np.array(query_embedding).astype('float32'), 5)
    results = []

    for idx in indices[0]:
        product = product_df.iloc[idx]
        results.append({
            "title": product['title'],
            "description": product['description'],
            "image": product['image_url'],
            "url": product['url'],
        })

    return jsonify({"results": results})


if __name__ == '__main__':
    app.run(port=5001, debug=True)
