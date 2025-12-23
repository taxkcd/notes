---
title: Node.js Reference Guide
date: 2025-01-13
---

## Important Functions

### 1. Built-in

#### i. Express Server Setup

```javascript
const express = require("express");
const app = express();
```

#### ii. Server Listening

```javascript
app.listen(3000, () => {
  console.log("Server listening on port 3000");
});

// Or with environment variable
const port = process.env.PORT;
app.listen(port, () => {
  console.log(`server is running on ${port} port`);
});
```

#### iii. Environment Variables

```javascript
require("dotenv").config();
const connectionString = process.env.CONNECTION_STRING;
const port = process.env.PORT;
const secretKey = process.env.SECRET_KEY;
```

#### iv. Router Creation

```javascript
const express = require("express");
const router = express.Router();
```

#### v. Module Exports

```javascript
module.exports = router;
module.exports = Users; // for models
```

### 2. Middleware

#### i. CORS (Cross-Origin Resource Sharing)

```javascript
const cors = require("cors");
app.use(cors());
```

#### ii. JSON Body Parser

```javascript
app.use(express.json());
```

#### iii. Route Middleware

```javascript
const userRoutes = require("./src/routes/userRoutes");
app.use("/", userRoutes);

const authRoutes = require("./src/routes/userAuthRoutes");
app.use("/auth", authRoutes);
```

## Operations

### 1. HTTP Route Handlers

#### i. GET Request

```javascript
// Get all items
router.get("/users", async (req, res) => {
  const usersData = await Users.find();
  res.json(usersData);
});

// Get specific item by ID
router.get("/users/:id", async (req, res) => {
  try {
    const userId = req.params.id;
    const userData = await Users.findById(userId);
    
    if (!userData) {
      return res.status(404).json({ message: "User not found!" });
    }
    res.status(200).json({ userData: userData });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});
```

#### ii. POST Request

```javascript
router.post("/addUser", async (req, res) => {
  try {
    const userData = new Users({
      _id: new mongoose.Types.ObjectId(),
      name: req.body.name,
      age: req.body.age,
      email: req.body.email,
      favouriteHobbies: req.body.favouriteHobbies,
    });
    const result = await userData.save();
    res.json(result);
  } catch (error) {
    console.log("error : ", error);
    res.json({ error: "something went wrong!" });
  }
});
```

#### iii. PUT Request (Update)

```javascript
router.put("/updateUser/:id", async (req, res) => {
  try {
    const userId = req.params.id;
    const dataToBeUpdate = new Users({
      name: req.body.name,
      age: req.body.age,
      email: req.body.email,
      favouriteHobbies: req.body.favouriteHobbies,
    });

    const updatedData = await Users.findByIdAndUpdate(userId, dataToBeUpdate, {
      new: true,
    });

    if (!updatedData) {
      return res.status(404).json({ message: "User not found!" });
    }

    return res.json({ message: "user updated successfuly!" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
```

#### iv. DELETE Request

```javascript
router.delete("/deleteUser/:id", async (req, res) => {
  try {
    const userId = req.params.id;
    const deletedUser = await Users.findByIdAndRemove(userId);

    if (!deletedUser) {
      return res.status(404).json({ message: "User not found!" });
    }

    return res.json({ message: "user deleted successfuly!" });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});
```

### 2. Request Object Methods

#### i. Access Request Body

```javascript
const name = req.body.name;
const age = req.body.age;
const email = req.body.email;
```

#### ii. Access URL Parameters

```javascript
// For route: /users/:id
const userId = req.params.id;
// req.params == { id: "3456780987345678909460876567" }
```

### 3. Response Object Methods

#### i. Send JSON Response

```javascript
res.json(usersData);
res.json({ message: "User registered successfuly!", user });
res.json({ error: "something went wrong!" });
```

#### ii. Set Status Code

```javascript
res.status(200).json({ userData: userData });
res.status(201).json({ message: "User registered successfuly!", user });
res.status(404).json({ message: "User not found!" });
res.status(500).json({ error: error.message });
```

### 4. Error Handling Pattern

```javascript
try {
  // code that might throw an error
  const userData = await Users.findById(userId);
  
  if (!userData) {
    return res.status(404).json({ message: "User not found!" });
  }
  
  res.status(200).json({ userData: userData });
} catch (error) {
  return res.status(500).json({ error: error.message });
}
```

## Data Structures

### 1. Express Application

#### i. Creation

```javascript
const express = require("express");
const app = express();
```

#### ii. Configuration

```javascript
app.use(cors());
app.use(express.json());
```

#### iii. Route Mounting

```javascript
app.use("/", userRoutes);
app.use("/auth", authRoutes);
```

### 2. Router

#### i. Creation

```javascript
const express = require("express");
const router = express.Router();
```

#### ii. Route Definition

```javascript
router.get("/users", async (req, res) => { /* ... */ });
router.post("/addUser", async (req, res) => { /* ... */ });
router.put("/updateUser/:id", async (req, res) => { /* ... */ });
router.delete("/deleteUser/:id", async (req, res) => { /* ... */ });
```

#### iii. Export

```javascript
module.exports = router;
```

## Common Patterns

### 1. Complete Server Setup

```javascript
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

require("dotenv").config();

// create app
const app = express();

// cors
app.use(cors());
app.use(express.json());

// routes
const userRoutes = require("./src/routes/userRoutes");
app.use("/", userRoutes);

// Mongodb connection
mongoose.connect(process.env.CONNECTION_STRING, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;

// Handle connection error
db.on("error", (error) => {
  console.log("Mongodb error : ", error);
});

// Handle successful connection
db.once("open", () => {
  console.log("Mongodb connected sucessfully!");
  const port = process.env.PORT;
  app.listen(port, () => {
    console.log(`server is running on ${port} port`);
  });
});
```

### 2. Async/Await Pattern

```javascript
router.get("/users", async (req, res) => {
  const usersData = await Users.find();
  res.json(usersData);
});
```

### 3. Status Code Reference

- `200` - OK (successful request)
- `201` - Created (successful creation)
- `404` - Not Found (resource doesn't exist)
- `400` - Bad Request (invalid input)
- `500` - Internal Server Error (server error)

