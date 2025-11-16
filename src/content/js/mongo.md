---
title: MongoDB & Mongoose Reference Guide
date: 2025-01-13
---

## Important Functions

### 1. Built-in

#### i. Mongoose Connection

```javascript
const mongoose = require("mongoose");

mongoose.connect(process.env.CONNECTION_STRING, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
```

#### ii. Connection Object

```javascript
const db = mongoose.connection;
```

#### iii. Connection Event Handlers

```javascript
// Handle connection error
db.on("error", (error) => {
  console.log("Mongodb error : ", error);
});

// Handle successful connection (fires once)
db.once("open", () => {
  console.log("Mongodb connected sucessfully!");
  // Start server after connection
  app.listen(port, () => {
    console.log(`server is running on ${port} port`);
  });
});
```

#### iv. ObjectId Generation

```javascript
const mongoose = require("mongoose");
const newId = new mongoose.Types.ObjectId();
```

### 2. Schema Definition

#### i. Basic Schema

```javascript
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: String,
  age: Number,
  email: String,
  favouriteHobbies: [String], // Array of strings
});
```

#### ii. Schema with Options

```javascript
const userSchema = new mongoose.Schema(
  {
    _id: mongoose.Schema.ObjectId,
    name: String,
    age: Number,
    email: String,
    favouriteHobbies: [String],
  },
  {
    collection: "userInfo", // Force collection name
    versionKey: false, // Disable __v field
  }
);
```

#### iii. Schema with Validation

```javascript
const userAuthSchema = new mongoose.Schema({
  email: {
    type: String,
    unique: true,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
});
```

#### iv. Schema Field Types

```javascript
const schema = new mongoose.Schema({
  _id: String,
  name: String,
  age: Number,
  email: String,
  isActive: Boolean,
  coordinates: [Number], // Array of numbers
  favouriteHobbies: [String], // Array of strings
  createdAt: Date,
});
```

### 3. Model Creation

#### i. Create Model

```javascript
const Users = mongoose.model("userInfo", userSchema);
```

#### ii. Export Model

```javascript
module.exports = Users;
```

## Operations

### 1. Create Operations

#### i. Create New Document

```javascript
const userData = new Users({
  _id: new mongoose.Types.ObjectId(),
  name: req.body.name,
  age: req.body.age,
  email: req.body.email,
  favouriteHobbies: req.body.favouriteHobbies,
});
```

#### ii. Save Document

```javascript
const result = await userData.save();
res.json(result);
```

#### iii. Complete Create Pattern

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

### 2. Read Operations

#### i. Find All Documents

```javascript
const usersData = await Users.find();
res.json(usersData);
```

#### ii. Find by ID

```javascript
const userId = req.params.id;
const userData = await Users.findById(userId);

if (!userData) {
  return res.status(404).json({ message: "User not found!" });
}
res.status(200).json({ userData: userData });
```

#### iii. Find One Document

```javascript
const user = await User.findOne({ email: req.body.email });

if (!user) {
  return res.status(404).json({ message: "Authentication failed" });
}
```

#### iv. Find with Query

```javascript
// Find documents matching criteria
const users = await Users.find({ age: { $gte: 18 } });
const activeUsers = await Users.find({ isActive: true });
```

### 3. Update Operations

#### i. Find by ID and Update

```javascript
const userId = req.params.id;
const dataToBeUpdate = new Users({
  name: req.body.name,
  age: req.body.age,
  email: req.body.email,
  favouriteHobbies: req.body.favouriteHobbies,
});

const updatedData = await Users.findByIdAndUpdate(
  userId,
  dataToBeUpdate,
  { new: true } // Return updated document
);

if (!updatedData) {
  return res.status(404).json({ message: "User not found!" });
}

return res.json({ message: "user updated successfuly!" });
```

#### ii. Update Options

```javascript
// { new: true } - Returns the updated document instead of the original
// { upsert: true } - Creates document if it doesn't exist
const updatedData = await Users.findByIdAndUpdate(
  userId,
  updateData,
  { new: true }
);
```

### 4. Delete Operations

#### i. Find by ID and Remove

```javascript
const userId = req.params.id;
const deletedUser = await Users.findByIdAndRemove(userId);

if (!deletedUser) {
  return res.status(404).json({ message: "User not found!" });
}

return res.json({ message: "user deleted successfuly!" });
```

#### ii. Delete One

```javascript
const result = await Users.deleteOne({ email: "user@example.com" });
```

## Data Structures

### 1. Schema

#### i. Basic Schema Structure

```javascript
const schema = new mongoose.Schema({
  field1: Type,
  field2: Type,
  // ...
});
```

#### ii. Schema with Options

```javascript
const schema = new mongoose.Schema(
  {
    // fields
  },
  {
    collection: "collectionName", // Custom collection name
    versionKey: false, // Disable version key
  }
);
```

#### iii. Schema Field Options

```javascript
{
  type: String,
  required: true, // Field is required
  unique: true, // Field must be unique
  default: "defaultValue", // Default value
}
```

### 2. Model

#### i. Model Creation

```javascript
const ModelName = mongoose.model("collectionName", schema);
```

#### ii. Model Usage

```javascript
// Create instance
const instance = new ModelName({ /* data */ });

// Query methods
ModelName.find();
ModelName.findById(id);
ModelName.findOne(query);
ModelName.findByIdAndUpdate(id, data, options);
ModelName.findByIdAndRemove(id);
```

## Common Patterns

### 1. Complete MongoDB Connection Setup

```javascript
const mongoose = require("mongoose");
require("dotenv").config();

// Mongodb connection
mongoose.connect(process.env.CONNECTION_STRING, {
  useNewUrlParser: true, // Compatibility with older MongoDB driver versions
  useUnifiedTopology: true, // Enable unified topology engine
});

const db = mongoose.connection;

// Handle connection error
db.on("error", (error) => {
  console.log("Mongodb error : ", error);
});

// Handle successful connection
db.once("open", () => {
  console.log("Mongodb connected sucessfully!");
  // Start server after connection
  const port = process.env.PORT;
  app.listen(port, () => {
    console.log(`server is running on ${port} port`);
  });
});
```

### 2. Complete Model Definition

```javascript
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    _id: mongoose.Schema.ObjectId,
    name: String,
    age: Number,
    email: String,
    favouriteHobbies: [String],
  },
  {
    collection: "userInfo", // Force collection name
    versionKey: false, // Disable __v field
  }
);

const Users = mongoose.model("userInfo", userSchema);

module.exports = Users;
```

### 3. CRUD Pattern with Error Handling

```javascript
// CREATE
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
    res.json({ error: "something went wrong!" });
  }
});

// READ
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

// UPDATE
router.put("/updateUser/:id", async (req, res) => {
  try {
    const userId = req.params.id;
    const updatedData = await Users.findByIdAndUpdate(
      userId,
      req.body,
      { new: true }
    );
    
    if (!updatedData) {
      return res.status(404).json({ message: "User not found!" });
    }
    
    return res.json({ message: "user updated successfuly!" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// DELETE
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

### 4. Connection Options Explanation

```javascript
mongoose.connect(process.env.CONNECTION_STRING, {
  useNewUrlParser: true, // Used for compatibility with older MongoDB driver versions
  useUnifiedTopology: true, // Used to enable the new unified topology engine in MongoDB
  // Enabling unified topology ensures your Node.js application uses the most
  // efficient and up-to-date connection management and communication methods
  // when interacting with your MongoDB database
});
```

## MongoDB Shell Commands (Reference)

### 1. Database Commands

```javascript
// View all databases
show dbs

// Create a new or switch databases
use dbName

// View current Database
db

// Delete Database
db.dropDatabase()
```

### 2. Collection Commands

```javascript
// Show collections
show collections

// Create a collection named 'comments'
db.createCollection('comments')

// Drop a collection named 'comments'
db.comments.drop()
```

### 3. Document Commands

```javascript
// Show all documents in a collection
db.comments.find()

// Show all documents (Prettified)
db.comments.find().pretty()

// Find the first document matching the object
db.comments.findOne({name: 'Harry'})

// Insert One Document
db.comments.insert({
  'name': 'Harry',
  'lang': 'JavaScript',
  'member_since': 5
})

// Insert Many Documents
db.comments.insertMany([
  {'name': 'Harry', 'lang': 'JavaScript', 'member_since': 5},
  {'name': 'Rohan', 'lang': 'Python', 'member_since': 3}
])

// Search in a MongoDB Database
db.comments.find({lang:'Python'})

// Limit the number of documents in output
db.comments.find().limit(2)

// Count the number of documents
db.comments.find().count()

// Update a document
db.comments.updateOne(
  {name: 'Shubham'},
  {$set: {'name': 'Harry', 'lang': 'JavaScript', 'member_since': 51}},
  {upsert: true}
)

// MongoDB Increment Operator
db.comments.update(
  {name: 'Rohan'},
  {$inc: {member_since: 2}}
)

// MongoDB Rename Operator
db.comments.update(
  {name: 'Rohan'},
  {$rename: {member_since: 'member'}}
)

// Delete Document
db.comments.deleteOne({name: 'Harry'})

// Less than/Greater than operators
db.comments.find({member_since: {$lt: 90}})  // Less than
db.comments.find({member_since: {$lte: 90}}) // Less than or equal
db.comments.find({member_since: {$gt: 90}})  // Greater than
db.comments.find({member_since: {$gte: 90}}) // Greater than or equal
```

