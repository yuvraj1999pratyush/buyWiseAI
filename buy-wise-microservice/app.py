from flask import Flask, request, jsonify
import faiss
import pickle
from sentence_transformers import SentenceTransformer
import numpy as np
import os
import gc

app = Flask(__name__)

# Enable CORS for all origins
@app.after_request
def after_request(response):
    response.headers.add('Access-Control-Allow-Origin', '*')
    response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization')
    response.headers.add('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS')
    return response

# Global variables for lazy loading
index = None
product_df = None
embedding_model = None

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

def load_resources():
    """Load resources only when needed"""
    global index, product_df, embedding_model
    
    if index is None:
        print("Loading vector files...")
        try:
            index = faiss.read_index(os.path.join(BASE_DIR, "product_embeddings.index"))
            with open(os.path.join(BASE_DIR, "product_data.pkl"), "rb") as f:
                product_df = pickle.load(f)
            print("✅ Vector files loaded successfully")
        except Exception as e:
            print(f"❌ Error loading files: {e}")
            raise e
    
    if embedding_model is None:
        print("Loading embedding model...")
        embedding_model = SentenceTransformer('all-MiniLM-L6-v2')
        print("✅ Embedding model loaded")
    
    return index, product_df, embedding_model

@app.route('/', methods=['GET'])
def health():
    # Don't load resources for health check
    return jsonify({
        "status": "healthy", 
        "service": "BuyWise Microservice",
        "memory_optimized": True
    })

@app.route('/search', methods=['POST', 'OPTIONS'])
def search():
    if request.method == 'OPTIONS':
        return '', 200
        
    try:
        # Load resources only when search is called
        idx, df, model = load_resources()
        
        data = request.json
        query_text = data.get('query', '')
        
        if not query_text:
            return jsonify({"error": "Query text missing"}), 400

        print(f"Searching for: {query_text}")
        
        # Generate embeddings and search
        query_embedding = model.encode([query_text])
        distances, indices = idx.search(np.array(query_embedding).astype('float32'), 5)
        
        results = []
        for idx_val in indices[0]:
            if idx_val < len(df):
                product = df.iloc[idx_val]
                results.append({
                    "title": str(product.get('title', 'N/A')),
                    "description": str(product.get('description', 'N/A')),
                    "image": str(product.get('image_url', '')),
                    "url": str(product.get('url', '')),
                })

        print(f"Found {len(results)} results")
        
        # Force garbage collection to free memory
        gc.collect()
        
        return jsonify({"results": results})
    
    except Exception as e:
        print(f"Error in search: {e}")
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 10000))
    app.run(host='0.0.0.0', port=port, debug=False)