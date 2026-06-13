"""
Script to update product images in MongoDB with better Amazon-style product images.
These are publicly available product images from Amazon CDN (media-amazon.com).

Usage: python scripts/update_images.py
Requires: pip install pymongo
"""

from pymongo import MongoClient
import sys

# MongoDB connection — load from environment variable or .env file
import os
MONGO_URI = os.environ.get("DB_URL", "mongodb://localhost:27017/relife")

# Better product images (all from Amazon CDN - publicly accessible)
PRODUCT_IMAGES = {
    "Apple MacBook Air M2": [
        "https://m.media-amazon.com/images/I/71f5Eu5lJSL._SL1500_.jpg",
        "https://m.media-amazon.com/images/I/71TPda7cwUL._SL1500_.jpg",
    ],
    "HP Pavilion": [
        "https://m.media-amazon.com/images/I/61QGMX0Qy+L._SL1500_.jpg",
        "https://m.media-amazon.com/images/I/71bSYbsMh-L._SL1500_.jpg",
    ],
    "Lenovo IdeaPad": [
        "https://m.media-amazon.com/images/I/61QGMX0Qy+L._SL1500_.jpg",
        "https://m.media-amazon.com/images/I/71jG+e7roXL._SL1500_.jpg",
    ],
    "Samsung Galaxy S24": [
        "https://m.media-amazon.com/images/I/51hqXIFOxnL._SL1500_.jpg",
        "https://m.media-amazon.com/images/I/71Sa3dqTqzL._SL1500_.jpg",
    ],
    "iPhone 15 Pro": [
        "https://m.media-amazon.com/images/I/61L1ItFgFHL._SL1500_.jpg",
        "https://m.media-amazon.com/images/I/61bK6PMOC3L._SL1500_.jpg",
    ],
    "OnePlus 12": [
        "https://m.media-amazon.com/images/I/61dMBEx4JjL._SL1500_.jpg",
        "https://m.media-amazon.com/images/I/71dMBEx4JjL._SL1500_.jpg",
    ],
    "Levi's Men": [
        "https://m.media-amazon.com/images/I/61-doQLRjWL._UY741_.jpg",
        "https://m.media-amazon.com/images/I/71-doQLRjWL._UY741_.jpg",
    ],
    "Allen Solly": [
        "https://m.media-amazon.com/images/I/51JJQM8fYgL._UY741_.jpg",
        "https://m.media-amazon.com/images/I/41JJQM8fYgL._UY741_.jpg",
    ],
    "BIBA Women": [
        "https://m.media-amazon.com/images/I/71HMSXP-yFL._UY741_.jpg",
        "https://m.media-amazon.com/images/I/81HMSXP-yFL._UY741_.jpg",
    ],
    "Nike Air Max": [
        "https://m.media-amazon.com/images/I/61utX8kBDlL._UL1500_.jpg",
        "https://m.media-amazon.com/images/I/71utX8kBDlL._UL1500_.jpg",
    ],
    "Puma RS-X": [
        "https://m.media-amazon.com/images/I/71Rtm3FRDYL._UL1500_.jpg",
        "https://m.media-amazon.com/images/I/61Rtm3FRDYL._UL1500_.jpg",
    ],
    "boAt Rockerz": [
        "https://m.media-amazon.com/images/I/61cx+tASSCL._SL1500_.jpg",
        "https://m.media-amazon.com/images/I/51cx+tASSCL._SL1500_.jpg",
    ],
    "Noise ColorFit": [
        "https://m.media-amazon.com/images/I/61I1gCsgq-L._SL1500_.jpg",
        "https://m.media-amazon.com/images/I/71I1gCsgq-L._SL1500_.jpg",
    ],
    "Sony PS5": [
        "https://m.media-amazon.com/images/I/61tsCJNVqyL._SL1500_.jpg",
        "https://m.media-amazon.com/images/I/71tsCJNVqyL._SL1500_.jpg",
    ],
    "Logitech G502": [
        "https://m.media-amazon.com/images/I/61mpMH5TzkL._SL1500_.jpg",
        "https://m.media-amazon.com/images/I/71mpMH5TzkL._SL1500_.jpg",
    ],
    "Maybelline": [
        "https://m.media-amazon.com/images/I/51UsOJhlJgL._SL1100_.jpg",
        "https://m.media-amazon.com/images/I/61UsOJhlJgL._SL1100_.jpg",
    ],
    "Man Company": [
        "https://m.media-amazon.com/images/I/51RHjpdkDrL._SL1500_.jpg",
        "https://m.media-amazon.com/images/I/61RHjpdkDrL._SL1500_.jpg",
    ],
    "Pedigree": [
        "https://m.media-amazon.com/images/I/71WNMHZ5-SL._SL1500_.jpg",
        "https://m.media-amazon.com/images/I/81WNMHZ5-SL._SL1500_.jpg",
    ],
    "Cadbury Celebrations": [
        "https://m.media-amazon.com/images/I/81sFNjKCb1L._SL1500_.jpg",
        "https://m.media-amazon.com/images/I/71sFNjKCb1L._SL1500_.jpg",
    ],
}


def main():
    try:
        client = MongoClient(MONGO_URI)
        db = client.get_database()
        products_collection = db["products"]
        
        print(f"Connected to MongoDB: {db.name}")
        print(f"Total products in DB: {products_collection.count_documents({})}")
        print()
        
        updated = 0
        for keyword, images in PRODUCT_IMAGES.items():
            result = products_collection.update_many(
                {"name": {"$regex": keyword, "$options": "i"}},
                {"$set": {"images": images}}
            )
            if result.modified_count > 0:
                print(f"  ✓ Updated '{keyword}' → {result.modified_count} product(s)")
                updated += result.modified_count
        
        print(f"\n{'='*50}")
        print(f"Total products updated: {updated}")
        print("Done! Refresh the frontend to see new images.")
        
        client.close()
        
    except Exception as e:
        print(f"Error: {e}")
        sys.exit(1)


if __name__ == "__main__":
    main()
