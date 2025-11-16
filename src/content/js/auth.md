---
title: Authentication Reference Guide
date: 2025-01-13
---

## Important Functions

### 1. Built-in

#### i. bcryptjs - Password Hashing

```javascript
const bcrypt = require("bcryptjs");
```

#### ii. JWT - Token Generation

```javascript
const jwt = require("jsonwebtoken");
```

### 2. Password Hashing

#### i. Hash Password

```javascript
const hashedPassword = await bcrypt.hash(req.body.password, 8);
// 8 is the salt rounds (number of times to hash)
```

#### ii. Compare Password

```javascript
const passwordMatched = await bcrypt.compare(
  req.body.password,
  user.password
);

if (!passwordMatched) {
  return res.status(404).json({ message: "Authentication failed" });
}
```

### 3. JWT Token Generation

#### i. Sign Token

```javascript
var token = jwt.sign(
  { id: user._id, admin: false },
  process.env.SECRET_KEY
);
```

#### ii. Token with Payload

```javascript
// Payload contains user information
const payload = {
  id: user._id,
  admin: false,
  email: user.email
};

const token = jwt.sign(payload, process.env.SECRET_KEY);
```

## Operations

### 1. User Registration

#### i. Complete Registration Pattern

```javascript
router.post("/register", async (req, res) => {
  // Hash the password
  const hashedPassword = await bcrypt.hash(req.body.password, 8);

  // Create user with hashed password
  const userData = new User({
    email: req.body.email,
    password: hashedPassword,
  });

  try {
    const user = await userData.save();
    res.status(201).json({ message: "User registered successfuly!", user });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});
```

#### ii. Registration Flow

```javascript
// 1. Receive email and password from request
const email = req.body.email;
const password = req.body.password;

// 2. Hash the password
const hashedPassword = await bcrypt.hash(password, 8);

// 3. Create user document
const userData = new User({
  email: email,
  password: hashedPassword,
});

// 4. Save to database
const user = await userData.save();
```

### 2. User Login

#### i. Complete Login Pattern

```javascript
router.post("/login", async (req, res) => {
  // Find user by email
  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    return res.status(404).json({ message: "Authentication failed" });
  }

  // Compare passwords
  const passwordMatched = await bcrypt.compare(
    req.body.password,
    user.password
  );

  if (!passwordMatched) {
    return res.status(404).json({ message: "Authentication failed" });
  }

  // Generate JWT token
  var token = jwt.sign({ id: user._id, admin: false }, process.env.SECRET_KEY);

  return res.status(200).json({ message: "User logged in!", token });
});
```

#### ii. Login Flow

```javascript
// 1. Find user by email
const user = await User.findOne({ email: req.body.email });

// 2. Check if user exists
if (!user) {
  return res.status(404).json({ message: "Authentication failed" });
}

// 3. Compare provided password with hashed password
const passwordMatched = await bcrypt.compare(
  req.body.password,
  user.password
);

// 4. Check if password matches
if (!passwordMatched) {
  return res.status(404).json({ message: "Authentication failed" });
}

// 5. Generate and return JWT token
var token = jwt.sign({ id: user._id, admin: false }, process.env.SECRET_KEY);
return res.status(200).json({ message: "User logged in!", token });
```

### 3. Authentication Schema

#### i. User Auth Model

```javascript
const mongoose = require("mongoose");

const userAuthSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      unique: true, // Email must be unique
      required: true, // Email is required
    },
    password: {
      type: String,
      required: true, // Password is required
    },
  },
  {
    collection: "userAuth",
    versionKey: false,
  }
);

const User = mongoose.model("userAuth", userAuthSchema);

module.exports = User;
```

## Data Structures

### 1. Authentication Schema Fields

#### i. Email Field

```javascript
email: {
  type: String,
  unique: true, // Prevents duplicate emails
  required: true, // Field is mandatory
}
```

#### ii. Password Field

```javascript
password: {
  type: String,
  required: true, // Field is mandatory
}
```

### 2. JWT Token Structure

#### i. Token Payload

```javascript
{
  id: user._id,      // User ID
  admin: false,      // Admin status
  // Can add more fields like email, name, etc.
}
```

#### ii. Token Generation

```javascript
jwt.sign(payload, secretKey);
// Returns: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

## Common Patterns

### 1. Complete Authentication Setup

```javascript
const express = require("express");
const router = express.Router();
const User = require("../models/userAuthModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Register Route
router.post("/register", async (req, res) => {
  const hashedPassword = await bcrypt.hash(req.body.password, 8);

  const userData = new User({
    email: req.body.email,
    password: hashedPassword,
  });

  try {
    const user = await userData.save();
    res.status(201).json({ message: "User registered successfuly!", user });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Login Route
router.post("/login", async (req, res) => {
  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    return res.status(404).json({ message: "Authentication failed" });
  }

  const passwordMatched = await bcrypt.compare(
    req.body.password,
    user.password
  );

  if (!passwordMatched) {
    return res.status(404).json({ message: "Authentication failed" });
  }

  var token = jwt.sign({ id: user._id, admin: false }, process.env.SECRET_KEY);

  return res.status(200).json({ message: "User logged in!", token });
});

module.exports = router;
```

### 2. Authentication Flow Diagram

```
Client               ------------------->         Server (login api)
                                              Generate JWT
                                              (Data ---> 2345xcv34)
2345xcv34            <------------------         2345xcv34(Contains user info)
```

### 3. Password Hashing Best Practices

#### i. Salt Rounds

```javascript
// Recommended: 8-12 rounds
// Higher rounds = more secure but slower
const hashedPassword = await bcrypt.hash(password, 8); // Good balance
const hashedPassword = await bcrypt.hash(password, 12); // More secure
```

#### ii. Never Store Plain Text Passwords

```javascript
// ❌ BAD
const userData = new User({
  email: req.body.email,
  password: req.body.password, // Never do this!
});

// ✅ GOOD
const hashedPassword = await bcrypt.hash(req.body.password, 8);
const userData = new User({
  email: req.body.email,
  password: hashedPassword,
});
```

### 4. JWT Token Usage

#### i. Token Storage

```javascript
// Client receives token
const response = await fetch('/auth/login', {
  method: 'POST',
  body: JSON.stringify({ email, password })
});
const { token } = await response.json();

// Store token (localStorage, sessionStorage, or httpOnly cookie)
localStorage.setItem('token', token);
```

#### ii. Token Verification (Middleware Example)

```javascript
// Middleware to verify JWT token
const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  const token = req.headers.authorization;
  
  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }
  
  try {
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    req.userId = decoded.id;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid token" });
  }
};

// Use middleware
router.get("/protected", verifyToken, async (req, res) => {
  // req.userId is available here
  res.json({ message: "Protected route", userId: req.userId });
});
```

### 5. Error Handling in Authentication

#### i. Registration Errors

```javascript
router.post("/register", async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 8);
    const userData = new User({
      email: req.body.email,
      password: hashedPassword,
    });
    
    const user = await userData.save();
    res.status(201).json({ message: "User registered successfuly!", user });
  } catch (error) {
    // Handle duplicate email error
    if (error.code === 11000) {
      return res.status(400).json({ message: "Email already exists" });
    }
    res.status(400).json({ message: error.message });
  }
});
```

#### ii. Login Errors

```javascript
router.post("/login", async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });

    if (!user) {
      return res.status(404).json({ message: "Authentication failed" });
    }

    const passwordMatched = await bcrypt.compare(
      req.body.password,
      user.password
    );

    if (!passwordMatched) {
      return res.status(404).json({ message: "Authentication failed" });
    }

    var token = jwt.sign({ id: user._id, admin: false }, process.env.SECRET_KEY);
    return res.status(200).json({ message: "User logged in!", token });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});
```

## Security Best Practices

### 1. Environment Variables

```javascript
// .env file
SECRET_KEY=your_secret_key_here
CONNECTION_STRING=mongodb://localhost:27017/mydb
PORT=3000

// Never commit .env to version control
// Add .env to .gitignore
```

### 2. Password Requirements

```javascript
// Validate password strength before hashing
const password = req.body.password;

if (password.length < 8) {
  return res.status(400).json({ message: "Password must be at least 8 characters" });
}

const hashedPassword = await bcrypt.hash(password, 8);
```

### 3. Token Expiration

```javascript
// Add expiration to JWT token
const token = jwt.sign(
  { id: user._id, admin: false },
  process.env.SECRET_KEY,
  { expiresIn: '24h' } // Token expires in 24 hours
);
```

