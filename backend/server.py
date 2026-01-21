from fastapi import FastAPI, HTTPException, Depends, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import datetime, timedelta, timezone
from jose import JWTError, jwt
from passlib.context import CryptContext
from pymongo import MongoClient
from bson import ObjectId
import os
from dotenv import load_dotenv

load_dotenv()

app = FastAPI(title="PatangeNotes API", version="1.0.0")

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# MongoDB
MONGO_URL = os.environ.get("MONGO_URL")
DB_NAME = os.environ.get("DB_NAME")
client = MongoClient(MONGO_URL)
db = client[DB_NAME]

# Security
JWT_SECRET = os.environ.get("JWT_SECRET")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24  # 24 hours

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
security = HTTPBearer()

# Pydantic Models
class AdminLogin(BaseModel):
    email: str
    password: str

class TokenResponse(BaseModel):
    access_token: str
    token_type: str

class BlogPostCreate(BaseModel):
    title: str
    excerpt: str
    content: str
    category: str
    tags: List[str]
    featured_image: Optional[str] = ""
    sources: Optional[List[str]] = []
    is_featured: Optional[bool] = False

class BlogPostUpdate(BaseModel):
    title: Optional[str] = None
    excerpt: Optional[str] = None
    content: Optional[str] = None
    category: Optional[str] = None
    tags: Optional[List[str]] = None
    featured_image: Optional[str] = None
    sources: Optional[List[str]] = None
    is_featured: Optional[bool] = None

class NewsletterSubscribe(BaseModel):
    email: EmailStr

# Helper functions
def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password):
    return pwd_context.hash(password)

def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.now(timezone.utc) + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, JWT_SECRET, algorithm=ALGORITHM)

def verify_token(credentials: HTTPAuthorizationCredentials = Depends(security)):
    try:
        payload = jwt.decode(credentials.credentials, JWT_SECRET, algorithms=[ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            raise HTTPException(status_code=401, detail="Invalid token")
        return email
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")

def serialize_doc(doc):
    if doc:
        doc["id"] = str(doc.pop("_id"))
    return doc

def serialize_docs(docs):
    return [serialize_doc(doc) for doc in docs]

# Initialize admin user
def init_admin():
    admin_email = os.environ.get("ADMIN_EMAIL")
    admin_password = os.environ.get("ADMIN_PASSWORD")
    existing = db.admins.find_one({"email": admin_email})
    if not existing:
        db.admins.insert_one({
            "email": admin_email,
            "password": get_password_hash(admin_password),
            "created_at": datetime.now(timezone.utc).isoformat()
        })

@app.on_event("startup")
def startup():
    init_admin()
    # Create indexes
    db.posts.create_index([("title", "text"), ("content", "text"), ("excerpt", "text")])
    db.posts.create_index("category")
    db.posts.create_index("tags")
    db.posts.create_index("is_featured")
    db.posts.create_index("created_at")

# Routes
@app.get("/api/health")
def health_check():
    return {"status": "healthy", "service": "PatangeNotes API"}

# Auth Routes
@app.post("/api/auth/login", response_model=TokenResponse)
def admin_login(data: AdminLogin):
    admin = db.admins.find_one({"email": data.email})
    if not admin or not verify_password(data.password, admin["password"]):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    token = create_access_token({"sub": admin["email"]})
    return {"access_token": token, "token_type": "bearer"}

@app.get("/api/auth/verify")
def verify_auth(email: str = Depends(verify_token)):
    return {"authenticated": True, "email": email}

# Blog Posts - Public
@app.get("/api/posts")
def get_posts(
    category: Optional[str] = None,
    tag: Optional[str] = None,
    search: Optional[str] = None,
    featured: Optional[bool] = None,
    limit: int = 20,
    skip: int = 0
):
    query = {}
    if category:
        query["category"] = category
    if tag:
        query["tags"] = tag
    if featured is not None:
        query["is_featured"] = featured
    if search:
        query["$text"] = {"$search": search}
    
    posts = list(db.posts.find(query, {"_id": 1, "title": 1, "excerpt": 1, "category": 1, "tags": 1, "featured_image": 1, "is_featured": 1, "created_at": 1, "reading_time": 1}).sort("created_at", -1).skip(skip).limit(limit))
    total = db.posts.count_documents(query)
    return {"posts": serialize_docs(posts), "total": total}

@app.get("/api/posts/{post_id}")
def get_post(post_id: str):
    try:
        post = db.posts.find_one({"_id": ObjectId(post_id)})
        if not post:
            raise HTTPException(status_code=404, detail="Post not found")
        return serialize_doc(post)
    except Exception:
        raise HTTPException(status_code=404, detail="Post not found")

@app.get("/api/categories")
def get_categories():
    categories = db.posts.distinct("category")
    return {"categories": categories}

@app.get("/api/tags")
def get_tags():
    tags = db.posts.distinct("tags")
    return {"tags": tags}

# Blog Posts - Admin Protected
@app.post("/api/admin/posts")
def create_post(post: BlogPostCreate, email: str = Depends(verify_token)):
    word_count = len(post.content.split())
    reading_time = max(1, word_count // 200)  # ~200 words per minute
    
    post_data = {
        **post.model_dump(),
        "author": "Aditya Patange",
        "reading_time": reading_time,
        "created_at": datetime.now(timezone.utc).isoformat(),
        "updated_at": datetime.now(timezone.utc).isoformat()
    }
    result = db.posts.insert_one(post_data)
    post_data["id"] = str(result.inserted_id)
    if "_id" in post_data:
        del post_data["_id"]
    return post_data

@app.put("/api/admin/posts/{post_id}")
def update_post(post_id: str, post: BlogPostUpdate, email: str = Depends(verify_token)):
    try:
        update_data = {k: v for k, v in post.model_dump().items() if v is not None}
        if "content" in update_data:
            word_count = len(update_data["content"].split())
            update_data["reading_time"] = max(1, word_count // 200)
        update_data["updated_at"] = datetime.now(timezone.utc).isoformat()
        
        result = db.posts.update_one({"_id": ObjectId(post_id)}, {"$set": update_data})
        if result.matched_count == 0:
            raise HTTPException(status_code=404, detail="Post not found")
        
        updated = db.posts.find_one({"_id": ObjectId(post_id)})
        return serialize_doc(updated)
    except Exception as e:
        raise HTTPException(status_code=404, detail="Post not found")

@app.delete("/api/admin/posts/{post_id}")
def delete_post(post_id: str, email: str = Depends(verify_token)):
    try:
        result = db.posts.delete_one({"_id": ObjectId(post_id)})
        if result.deleted_count == 0:
            raise HTTPException(status_code=404, detail="Post not found")
        return {"message": "Post deleted successfully"}
    except Exception:
        raise HTTPException(status_code=404, detail="Post not found")

@app.get("/api/admin/posts")
def get_admin_posts(email: str = Depends(verify_token), limit: int = 100, skip: int = 0):
    posts = list(db.posts.find().sort("created_at", -1).skip(skip).limit(limit))
    total = db.posts.count_documents({})
    return {"posts": serialize_docs(posts), "total": total}

# Newsletter
@app.post("/api/newsletter/subscribe")
def subscribe_newsletter(data: NewsletterSubscribe):
    existing = db.newsletter.find_one({"email": data.email})
    if existing:
        return {"message": "Already subscribed", "subscribed": True}
    
    db.newsletter.insert_one({
        "email": data.email,
        "subscribed_at": datetime.now(timezone.utc).isoformat()
    })
    return {"message": "Successfully subscribed", "subscribed": True}

@app.get("/api/admin/newsletter/subscribers")
def get_subscribers(email: str = Depends(verify_token)):
    subscribers = list(db.newsletter.find({}, {"_id": 0}))
    return {"subscribers": subscribers, "total": len(subscribers)}

# Stats for Admin
@app.get("/api/admin/stats")
def get_stats(email: str = Depends(verify_token)):
    total_posts = db.posts.count_documents({})
    total_subscribers = db.newsletter.count_documents({})
    categories = db.posts.distinct("category")
    return {
        "total_posts": total_posts,
        "total_subscribers": total_subscribers,
        "total_categories": len(categories)
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)
