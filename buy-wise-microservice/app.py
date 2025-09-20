from flask import Flask, request, jsonify
import faiss
import pickle
from sentence_transformers import SentenceTransformer
import numpy as np
import os

app = Flask(__name__)

# Enable CORS for all origins
@app.after_request
def after_request(response):
    response.headers.add('Access-Control-Allow-Origin', '*')
    response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization')
    response.headers.add('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS')
    return response

# Load files from current directory
BASE_DIR = os.path.dirname(os.path.abspath(__file__))

print("Loading vector files...")
try:
    index = faiss.read_index(os.path.join(BASE_DIR, "product_embeddings.index"))
    with open(os.path.join(BASE_DIR, "product_data.pkl"), "rb") as f:
        product_df = pickle.load(f)
    print("✅ Vector files loaded successfully")
except Exception as e:
    print(f"❌ Error loading files: {e}")
    raise e

print("Loading embedding model...")
embedding_model = SentenceTransformer('all-MiniLM-L6-v2')
print("✅ Embedding model loaded")

@app.route('/', methods=['GET'])
def health():
    return jsonify({
        "status": "healthy", 
        "service": "BuyWise Microservice",
        "products_loaded": len(product_df)
    })

@app.route('/search', methods=['POST', 'OPTIONS'])
def search():
    if request.method == 'OPTIONS':
        return '', 200
        
    try:
        data = request.json
        query_text = data.get('query', '')
        
        if not query_text:
            return jsonify({"error": "Query text missing"}), 400

        print(f"Searching for: {query_text}")
        
        # Generate embeddings and search
        query_embedding = embedding_model.encode([query_text])
        distances, indices = index.search(np.array(query_embedding).astype('float32'), 5)
        
        results = []
        for idx in indices[0]:
            if idx < len(product_df):
                product = product_df.iloc[idx]
                results.append({
                    "title": str(product.get('title', 'N/A')),
                    "description": str(product.get('description', 'N/A')),
                    "image": str(product.get('image_url', '')),
                    "url": str(product.get('url', '')),
                })

        print(f"Found {len(results)} results")
        return jsonify({"results": results})
    
    except Exception as e:
        print(f"Error in search: {e}")
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 10000))
    app.run(host='0.0.0.0', port=port, debug=False)