import pandas as pd
from sentence_transformers import SentenceTransformer
import faiss
import numpy as np
import pickle

# Step 1: Load your Amazon product CSV
df = pd.read_csv("/Users/apple/Practice/BuyWise/buy-wise-data/amazon-products.csv")

# Inspect your dataframe
print(df.head())

# Step 2: Combine product title and description to form the text to embed
df['text'] = df['title'] + ". " + df['description'].fillna('')

# Step 3: Load a free sentence-transformer model for embeddings
model = SentenceTransformer('all-MiniLM-L6-v2')

# Step 4: Generate embeddings for all product texts
embeddings = model.encode(df['text'].tolist(), show_progress_bar=True)

# Step 5: Create FAISS index for similarity search
dimension = embeddings.shape[1]
index = faiss.IndexFlatL2(dimension)
index.add(embeddings)

# Step 6: Save FAISS index and dataframe for later use
faiss.write_index(index, "product_embeddings.index")
with open("product_data.pkl", "wb") as f:
    pickle.dump(df, f)

print("Embeddings created and saved successfully!")
