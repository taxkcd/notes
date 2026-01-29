---
title: FastAPI Cheatsheet
date: 2025-01-27
---

---

[FastAPI Documentation](https://fastapi.tiangolo.com/)

[FastAPI Course Playlist](https://www.youtube.com/playlist?list=PLe-jr3hh4N_nHa7ftA_Bq9518k3cz9BXw)

## 1. Getting Started

### i. Installation

```bash
# Using pip
pip install fastapi uvicorn

# Using uv (recommended)
uv add fastapi uvicorn
```

### ii. Basic App Creation

```python
from fastapi import FastAPI

app = FastAPI()

@app.get("/")
def root():
    return {"message": "Hello World"}
```

### iii. Running the Application

```bash
# Using uvicorn directly
uvicorn main:app --reload

# Using uv
uv run uvicorn main:app --reload
```

- `--reload` enables auto-reload on code changes
- App will be available at `http://127.0.0.1:8000`
- API documentation at `http://127.0.0.1:8000/docs` (Swagger UI)
- Alternative docs at `http://127.0.0.1:8000/redoc`

### iv. App Configuration

```python
app = FastAPI(
    title="My API",
    description="API description",
    version="1.0.0"
)
```

## 2. Routing and Endpoints

### i. Basic Route Definition

```python
@app.get("/")
def root():
    return {"message": "Hello World"}

@app.get("/about")
def about():
    return "About page"
```

### ii. HTTP Methods

```python
# GET - Retrieve data
@app.get("/items")
def get_items():
    return items

# POST - Create new resource
@app.post("/items")
def create_item():
    return {"message": "Item created"}

# PUT - Update resource (full update)
@app.put("/items/{id}")
def update_item(id: int):
    return {"message": f"Item {id} updated"}

# DELETE - Delete resource
@app.delete("/items/{id}")
def delete_item(id: int):
    return {"message": f"Item {id} deleted"}
```

### iii. APIRouter for Modular Routing

```python
from fastapi import APIRouter

router = APIRouter(tags=["Product"])

@router.get("/products")
def get_products():
    return products

# In main.py
from routes.product import router as product_route
app.include_router(product_route)
```

- Use `APIRouter` to organize routes into separate files
- `tags` parameter groups routes in Swagger UI
- `prefix` parameter adds common path prefix to all routes

```python
router = APIRouter(prefix="/posts", tags=["Posts"])
```

### iv. Route Tags and Organization

```python
@app.get("/", tags=["/"])
def root():
    return {"message": "API is running"}

@app.get("/students", tags=["Students"])
def get_students():
    return students
```

## 3. Request Parameters

### i. Path Parameters

```python
@app.get("/students/{id}")
def get_student(id: int):
    return students[id]
```

- Path parameters are defined in the route path with `{variable_name}`
- Type hints provide automatic validation

### ii. Path Parameter Validation

```python
from fastapi import Path

@app.get("/students/{id}")
def get_student(id: int = Path(ge=0, lt=len(students))):
    return students[id]
```

- `ge` - greater than or equal
- `gt` - greater than
- `le` - less than or equal
- `lt` - less than
- `min_length`, `max_length` for strings

### iii. Query Parameters

```python
from fastapi import Query
from typing import Optional

@app.get("/students")
def get_students(limit: Optional[int] = Query(None)):
    if limit:
        return students[:limit]
    return students
```

- Query parameters are function parameters not in the path
- `Query()` provides validation and documentation
- Optional parameters use `Optional[type] = Query(None)`

### iv. Multiple Query Parameters

```python
@app.get("/products/filter")
def filter_products(
    limit: int = Query(None),
    order: str = Query("asc"),
    min_price: float = Query(0),
    max_price: float = Query(None)
):
    # Filtering logic
    return filtered_products
```

### v. Request Body (JSON)

```python
from pydantic import BaseModel

class UserCreate(BaseModel):
    name: str
    age: int

@app.post("/user")
def add_user(user: UserCreate):
    return {"message": "User created", "user": user}
```

- Use Pydantic models for request body validation
- FastAPI automatically validates JSON against the model

### vi. Form Data

```python
from fastapi import Form

@app.post("/student")
def new_student(
    id: int = Form(),
    name: str = Form(...),
    math: int = Form(...),
    physics: int = Form(...)
):
    payload = {"id": id, "name": name, "math": math, "physics": physics}
    return {"message": "Student added", "student": payload}
```

- Use `Form()` for form data (application/x-www-form-urlencoded)
- `Form(...)` makes field required
- `Form(None)` makes field optional

### vii. Combining Parameters

```python
@app.put("/students/{id}")
def update_student(
    id: int = Path(),
    name: Optional[str] = Form(None),
    math: Optional[int] = Form(None)
):
    # Update logic
    return {"message": "Student updated"}
```

- Can combine path, query, body, and form parameters
- Path parameters must be in the route path
- Query parameters are optional by default

## 4. Pydantic Models

### i. Basic Model

```python
from pydantic import BaseModel

class User(BaseModel):
    name: str
    age: int
```

### ii. Type Validation

```python
class User(BaseModel):
    name: str
    age: int

user = User(name="Ali", age=25)  # Valid
user = User(name="Ali", age="25")  # Auto-converts to int
user = User(name="Ali", age="abc")  # Validation error
```

- Pydantic automatically validates and converts types
- Raises validation errors for invalid data

### iii. Field Validation

```python
from pydantic import BaseModel, Field

class BlogPostBase(BaseModel):
    title: str = Field(max_length=200)
    content: str
    author: str = Field(max_length=100)
```

- `Field()` provides validation constraints
- `min_length`, `max_length` for strings
- `ge`, `gt`, `le`, `lt` for numbers
- `description` for API documentation

### iv. Default Values

```python
class User(BaseModel):
    name: str
    age: int = 25  # Default value
    email: Optional[str] = None  # Optional with default
```

### v. Optional Fields

```python
from typing import Optional

class UserUpdate(BaseModel):
    name: Optional[str] = None
    age: Optional[int] = None
```

### vi. Nested Models

```python
class Address(BaseModel):
    city: str
    country: str

class User(BaseModel):
    name: str
    age: int
    address: Address

user = User(
    name="Ali",
    age=25,
    address={"city": "Lahore", "country": "Pakistan"}
)
```

### vii. Model Inheritance

```python
class BlogPostBase(BaseModel):
    title: str = Field(max_length=200)
    content: str

class BlogPostCreate(BlogPostBase):
    pass

class BlogPost(BlogPostBase):
    id: str
    created_at: datetime
```

- Base models define common fields
- Inherited models add or override fields
- Useful for Create/Read/Update patterns

### viii. Aliases

```python
class User(BaseModel):
    name: str = Field(alias="user_name")
    age: int

user = User(user_name="Ali", age=25)  # Uses alias
print(user.name)  # "Ali"
```

### ix. Validators

```python
from pydantic import BaseModel, field_validator

class User(BaseModel):
    email: str
    
    @field_validator('email')
    @classmethod
    def validate_email(cls, v):
        if '@' not in v:
            raise ValueError('Invalid email')
        return v
```

### x. Request and Response Models

```python
@app.post("/user", response_model=User)
def create_user(user: UserCreate):
    new_user = User(id="1", **user.model_dump())
    return new_user
```

- `response_model` defines the response schema
- FastAPI validates and serializes response
- Excludes fields not in response model

### xi. Model Methods

```python
user = User(name="Ali", age=25)

# Convert to dict
user_dict = user.model_dump()

# Convert to JSON
user_json = user.model_dump_json()

# Create from dict
user = User.model_validate({"name": "Ali", "age": 25})
```

## 5. Responses

### i. JSON Response

```python
@app.get("/users")
def get_users():
    return users  # Automatically converted to JSON
```

- FastAPI automatically converts Python dicts/lists to JSON
- Sets `Content-Type: application/json`

### ii. Custom JSON Response

```python
from fastapi.responses import JSONResponse
from fastapi import status

@app.post("/user")
def add_user(user: UserCreate):
    new_user = User(id="1", **user.model_dump())
    return JSONResponse(
        content=new_user.model_dump(),
        status_code=status.HTTP_201_CREATED
    )
```

### iii. HTML Response

```python
from fastapi.responses import HTMLResponse

@app.get("/", response_class=HTMLResponse)
def root():
    return "<h1>Hello World</h1>"
```

### iv. Response Models

```python
@app.get("/posts", response_model=list[BlogPostRead])
def get_posts(db: Session = Depends(get_db)):
    posts = db.query(Post).all()
    return posts
```

- `response_model` validates and serializes response
- Works with lists, single models, and nested structures

### v. Status Codes

```python
from fastapi import status

# Common status codes
status.HTTP_200_OK  # 200
status.HTTP_201_CREATED  # 201
status.HTTP_404_NOT_FOUND  # 404
status.HTTP_401_UNAUTHORIZED  # 401
status.HTTP_500_INTERNAL_SERVER_ERROR  # 500
```

### vi. Redirect Response

```python
from fastapi.responses import RedirectResponse

@app.post("/create")
def create_post(title: str = Form(...)):
    # Create post logic
    return RedirectResponse(url=f"/posts/{post.id}", status_code=303)
```

## 6. Dependencies and Dependency Injection

### i. Basic Dependency

```python
from fastapi import Depends

def get_common_parameters(q: str = None, skip: int = 0):
    return {"q": q, "skip": skip}

@app.get("/items")
def read_items(commons: dict = Depends(get_common_parameters)):
    return commons
```

### ii. Database Session Dependency

```python
from sqlalchemy.orm import Session

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.get("/posts")
def get_posts(db: Session = Depends(get_db)):
    posts = db.query(Post).all()
    return posts
```

- Use `yield` for dependencies that need cleanup
- Database session is automatically closed after request

### iii. Authentication Dependency

```python
from fastapi import Depends, HTTPException
from fastapi.security import OAuth2PasswordBearer

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="users/login")

def get_current_user(
    token: str = Depends(oauth2_scheme),
    db: Session = Depends(get_db)
):
    # Validate token and get user
    return user

@app.post("/posts")
def create_post(
    post: BlogPostCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # Only authenticated users can create posts
    return post
```

### iv. Dependency Chains

```python
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def get_current_user(db: Session = Depends(get_db)):
    # Uses get_db dependency
    return user

@app.get("/me")
def get_me(current_user: User = Depends(get_current_user)):
    # Uses get_current_user which uses get_db
    return current_user
```

## 7. Database Integration

### i. SQLAlchemy Setup

```python
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

DATABASE_URL = "postgresql://user:password@localhost/dbname"

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autoflush=False, autocommit=False, bind=engine)

Base = declarative_base()
```

### ii. Database Models

```python
from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, func
from sqlalchemy.orm import relationship
from database import Base

class Post(Base):
    __tablename__ = "posts"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String)
    content = Column(String)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    author_id = Column(Integer, ForeignKey("users.id"))
    author = relationship("User", back_populates="posts")

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    email = Column(String, unique=True, index=True)
    password = Column(String)
    posts = relationship("Post", back_populates="author")
```

### iii. Creating Tables

```python
from database import Base, engine

Base.metadata.create_all(bind=engine)
```

### iv. CRUD Operations

```python
# Create
@app.post("/posts")
def create_post(new_post: BlogPostCreate, db: Session = Depends(get_db)):
    post = Post(title=new_post.title, content=new_post.content)
    db.add(post)
    db.commit()
    db.refresh(post)
    return post

# Read
@app.get("/posts")
def get_posts(db: Session = Depends(get_db)):
    posts = db.query(Post).all()
    return posts

@app.get("/posts/{id}")
def get_post(id: int, db: Session = Depends(get_db)):
    post = db.query(Post).filter(Post.id == id).first()
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")
    return post

# Update
@app.put("/posts/{id}")
def update_post(id: int, post_update: BlogPostUpdate, db: Session = Depends(get_db)):
    post = db.query(Post).filter(Post.id == id).first()
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")
    
    if post_update.title:
        post.title = post_update.title
    if post_update.content:
        post.content = post_update.content
    
    db.commit()
    db.refresh(post)
    return post

# Delete
@app.delete("/posts/{id}")
def delete_post(id: int, db: Session = Depends(get_db)):
    post = db.query(Post).filter(Post.id == id).first()
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")
    
    db.delete(post)
    db.commit()
    return {"message": "Post deleted"}
```

### v. Relationships

```python
# One-to-Many relationship
class Post(Base):
    author_id = Column(Integer, ForeignKey("users.id"))
    author = relationship("User", back_populates="posts")

class User(Base):
    posts = relationship("Post", back_populates="author")

# Query with relationships
post = db.query(Post).filter(Post.id == 1).first()
author_name = post.author.name  # Access related user

user = db.query(User).filter(User.id == 1).first()
user_posts = user.posts  # Access all posts by user
```

### vi. Environment Variables

```python
import os
from dotenv import load_dotenv

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")
```

- Use `.env` file for sensitive configuration
- Never commit `.env` files to version control

## 8. Authentication and Security

### i. Password Hashing

```python
from pwdlib import PasswordHash

password_hash = PasswordHash.recommended()

def get_password_hashed(password):
    return password_hash.hash(password)

def verify_password(plain_password, hashed_password):
    return password_hash.verify(plain_password, hashed_password)
```

### ii. JWT Tokens

```python
from datetime import datetime, timedelta, timezone
import jwt

SECRET_KEY = "your-secret-key"
ALGORITHM = "HS256"

def create_access_token(email: str):
    payload = {
        "sub": email,
        "exp": datetime.now(timezone.utc) + timedelta(minutes=30),
    }
    return jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)
```

### iii. OAuth2PasswordBearer

```python
from fastapi.security import OAuth2PasswordBearer

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="users/login")
```

- Defines token endpoint for Swagger UI
- Automatically extracts token from Authorization header

### iv. Protected Routes

```python
def get_current_user(
    token: str = Depends(oauth2_scheme),
    db: Session = Depends(get_db),
):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email = payload.get("sub")
    except jwt.PyJWTError:
        raise HTTPException(status_code=401, detail="Invalid token")

    user = db.query(User).filter(User.email == email).first()
    if not user:
        raise HTTPException(status_code=401, detail="User not found")

    return user

@app.post("/posts")
def create_post(
    new_post: BlogPostCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    post = Post(title=new_post.title, content=new_post.content, author_id=current_user.id)
    db.add(post)
    db.commit()
    return post
```

### v. Login Endpoint

```python
from fastapi.security import OAuth2PasswordRequestForm

@app.post("/users/login")
def login(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db)
):
    user = db.query(User).filter(User.email == form_data.username).first()
    
    if not user or not verify_password(form_data.password, user.password):
        raise HTTPException(401, "Invalid credentials")

    token = create_access_token(user.email)
    return {"access_token": token, "token_type": "bearer"}
```

## 9. Templates and Jinja2

### i. Template Setup

```python
from fastapi.templating import Jinja2Templates

templates = Jinja2Templates(directory="templates")
```

- Create `templates` directory in project root
- Store HTML templates in this directory

### ii. Rendering Templates

```python
from fastapi import Request

@app.get("/")
def root(request: Request):
    return templates.TemplateResponse("index.html", {"request": request})
```

- Always pass `request` in context
- Additional data passed as dictionary

### iii. Template Context

```python
@app.get("/")
def root(request: Request, db: Session = Depends(get_db)):
    posts = db.query(Post).all()
    return templates.TemplateResponse(
        "index.html",
        {"request": request, "posts": posts}
    )
```

### iv. Form Handling

```python
@app.get("/create")
def create_form(request: Request):
    return templates.TemplateResponse("create.html", {"request": request})

@app.post("/create")
def create_post(
    request: Request,
    title: str = Form(...),
    content: str = Form(...),
    author: str = Form(...)
):
    # Process form data
    return RedirectResponse(url=f"/posts/{post.id}", status_code=303)
```

## 10. Error Handling

### i. HTTPException

```python
from fastapi import HTTPException, status

@app.get("/posts/{id}")
def get_post(id: int, db: Session = Depends(get_db)):
    post = db.query(Post).filter(Post.id == id).first()
    if not post:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Post not found"
        )
    return post
```

### ii. Try-Except Blocks

```python
from sqlalchemy.exc import IntegrityError

@app.post("/posts")
def create_post(new_post: BlogPostCreate, db: Session = Depends(get_db)):
    post = Post(title=new_post.title, content=new_post.content, author_id=new_post.author_id)
    
    try:
        db.add(post)
        db.commit()
        db.refresh(post)
        return post
    except IntegrityError:
        raise HTTPException(
            detail="Author doesn't exist.",
            status_code=status.HTTP_404_NOT_FOUND
        )
    except Exception:
        raise HTTPException(
            detail="Something went wrong.",
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR
        )
```

### iii. Custom Error Messages

```python
raise HTTPException(
    status_code=status.HTTP_400_BAD_REQUEST,
    detail={
        "error": "Validation failed",
        "field": "email",
        "message": "Invalid email format"
    }
)
```

## 11. Project Structure

### i. Modular Organization

```
project/
├── main.py
├── database.py
├── models/
│   ├── __init__.py
│   ├── user_model.py
│   └── post_model.py
├── schemas/
│   ├── __init__.py
│   ├── user_schema.py
│   └── post_schema.py
├── routes/
│   ├── __init__.py
│   ├── user_route.py
│   └── post_route.py
├── auth.py
├── security.py
└── templates/
    ├── index.html
    └── create.html
```

### ii. Separating Concerns

```python
# models/user_model.py
from sqlalchemy import Column, Integer, String
from database import Base

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True)
    name = Column(String)
    email = Column(String)

# schemas/user_schema.py
from pydantic import BaseModel

class UserCreate(BaseModel):
    name: str
    email: str

class UserRead(BaseModel):
    id: int
    name: str
    email: str

# routes/user_route.py
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from database import get_db
from models.user_model import User
from schemas.user_schema import UserCreate, UserRead

router = APIRouter(prefix="/users", tags=["Users"])

@router.post("/", response_model=UserRead)
def create_user(user: UserCreate, db: Session = Depends(get_db)):
    # Create user logic
    return user
```

### iii. Main Application File

```python
# main.py
from fastapi import FastAPI
from database import Base, engine
from routes.user_route import router as user_router
from routes.post_route import router as post_router

Base.metadata.create_all(bind=engine)

app = FastAPI()

app.include_router(user_router)
app.include_router(post_router)
```

### iv. Best Practices

- Separate database models from Pydantic schemas
- Use APIRouter for route organization
- Keep business logic in route handlers or separate service files
- Use dependency injection for database sessions and authentication
- Store sensitive data in environment variables
- Use type hints throughout
- Document endpoints with tags and descriptions

## 12. Tips and Common Patterns

### i. Request/Response Pattern

```python
# Use separate schemas for request and response
class BlogPostCreate(BaseModel):
    title: str
    content: str

class BlogPostRead(BaseModel):
    id: int
    title: str
    content: str
    created_at: datetime

@app.post("/posts", response_model=BlogPostRead)
def create_post(post: BlogPostCreate, db: Session = Depends(get_db)):
    # Create logic
    return created_post
```

### ii. Update Pattern

```python
class BlogPostUpdate(BaseModel):
    title: Optional[str] = None
    content: Optional[str] = None

@app.put("/posts/{id}")
def update_post(id: int, post_update: BlogPostUpdate, db: Session = Depends(get_db)):
    post = db.query(Post).filter(Post.id == id).first()
    
    # Update only provided fields
    update_data = post_update.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(post, field, value)
    
    db.commit()
    return post
```

### iii. Pagination

```python
from typing import Optional

@app.get("/posts")
def get_posts(
    skip: int = Query(0, ge=0),
    limit: int = Query(10, ge=1, le=100),
    db: Session = Depends(get_db)
):
    posts = db.query(Post).offset(skip).limit(limit).all()
    total = db.query(Post).count()
    return {"posts": posts, "total": total, "skip": skip, "limit": limit}
```

### iv. Filtering and Searching

```python
@app.get("/posts")
def get_posts(
    search: Optional[str] = Query(None),
    category: Optional[str] = Query(None),
    db: Session = Depends(get_db)
):
    query = db.query(Post)
    
    if search:
        query = query.filter(Post.title.contains(search))
    if category:
        query = query.filter(Post.category == category)
    
    return query.all()
```

## References

1. [FastAPI Documentation](https://fastapi.tiangolo.com/)
2. [Pydantic Documentation](https://docs.pydantic.dev/)
3. [SQLAlchemy Documentation](https://docs.sqlalchemy.org/)
4. [Jinja2 Documentation](https://jinja.palletsprojects.com/)
5. [FastAPI Course Playlist](https://www.youtube.com/playlist?list=PLe-jr3hh4N_nHa7ftA_Bq9518k3cz9BXw)

