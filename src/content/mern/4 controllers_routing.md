# Controllers & Routing - Interview Guide

## Express.js Fundamentals

### Basic Setup

```javascript
const express = require('express');
const app = express();

// Middleware
app.use(express.json()); // Parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies

// Basic route
app.get('/', (req, res) => {
  res.send('Hello World');
});

app.listen(3000, () => {
  console.log('Server running on port 3000');
});
```

### Request and Response Objects

**Request (req)**:
```javascript
app.get('/users/:id', (req, res) => {
  // Route parameters
  const userId = req.params.id;
  
  // Query parameters (?name=John&age=30)
  const { name, age } = req.query;
  
  // Request body (POST/PUT/PATCH)
  const { email, password } = req.body;
  
  // Headers
  const token = req.headers.authorization;
  const userAgent = req.get('User-Agent');
  
  // Other useful properties
  console.log(req.method); // GET, POST, etc.
  console.log(req.path); // /users/123
  console.log(req.url); // /users/123?sort=asc
  console.log(req.ip); // Client IP
  console.log(req.protocol); // http or https
  console.log(req.hostname); // example.com
  console.log(req.cookies); // Requires cookie-parser middleware
});
```

**Response (res)**:
```javascript
app.get('/api/users', (req, res) => {
  // Send JSON
  res.json({ users: [] });
  
  // Set status code
  res.status(404).json({ error: 'Not found' });
  
  // Send different content types
  res.send('Plain text');
  res.sendFile('/path/to/file.pdf');
  
  // Set headers
  res.set('Content-Type', 'application/json');
  res.setHeader('X-Custom-Header', 'value');
  
  // Redirect
  res.redirect('/login');
  res.redirect(301, 'https://example.com');
  
  // Set cookies
  res.cookie('sessionId', '123', { 
    httpOnly: true, 
    secure: true,
    maxAge: 3600000 // 1 hour
  });
  
  // Download file
  res.download('/path/to/file.pdf', 'document.pdf');
  
  // End response
  res.end();
});
```

## Routing Patterns

### Route Parameters

```javascript
// Simple parameter
app.get('/users/:id', (req, res) => {
  const { id } = req.params;
  res.json({ userId: id });
});

// Multiple parameters
app.get('/users/:userId/posts/:postId', (req, res) => {
  const { userId, postId } = req.params;
  res.json({ userId, postId });
});

// Optional parameters (using RegEx)
app.get('/users/:id?', (req, res) => {
  if (req.params.id) {
    res.json({ user: req.params.id });
  } else {
    res.json({ users: [] });
  }
});

// Parameter validation
app.param('id', (req, res, next, id) => {
  if (!/^\d+$/.test(id)) {
    return res.status(400).json({ error: 'Invalid ID format' });
  }
  next();
});
```

### Router Modules

```javascript
// routes/users.js
const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { authenticate, authorize } = require('../middleware/auth');

// All routes in this router are prefixed with /users
router.get('/', userController.getAll);
router.get('/:id', userController.getById);
router.post('/', authenticate, userController.create);
router.put('/:id', authenticate, authorize('admin'), userController.update);
router.delete('/:id', authenticate, authorize('admin'), userController.delete);

module.exports = router;

// app.js
const userRoutes = require('./routes/users');
app.use('/users', userRoutes);
```

### Route Organization

```javascript
// routes/index.js
const express = require('express');
const router = express.Router();

const userRoutes = require('./users');
const postRoutes = require('./posts');
const authRoutes = require('./auth');

router.use('/users', userRoutes);
router.use('/posts', postRoutes);
router.use('/auth', authRoutes);

// Health check
router.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

module.exports = router;

// app.js
const routes = require('./routes');
app.use('/api', routes);
```

## Controllers

### Controller Pattern

```javascript
// controllers/userController.js
const User = require('../models/User');
const { validationResult } = require('express-validator');

class UserController {
  // Get all users
  async getAll(req, res, next) {
    try {
      const { page = 1, limit = 10, sort = '-createdAt' } = req.query;
      
      const users = await User.find()
        .select('-password')
        .limit(limit * 1)
        .skip((page - 1) * limit)
        .sort(sort);
      
      const count = await User.countDocuments();
      
      res.json({
        users,
        totalPages: Math.ceil(count / limit),
        currentPage: page,
        total: count
      });
    } catch (error) {
      next(error);
    }
  }
  
  // Get user by ID
  async getById(req, res, next) {
    try {
      const user = await User.findById(req.params.id)
        .select('-password')
        .populate('posts');
      
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
      
      res.json({ user });
    } catch (error) {
      next(error);
    }
  }
  
  // Create user
  async create(req, res, next) {
    try {
      // Validate input
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      
      const { email, password, name } = req.body;
      
      // Check if user exists
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ error: 'Email already exists' });
      }
      
      const user = await User.create({ email, password, name });
      
      res.status(201).json({ 
        user: {
          id: user._id,
          email: user.email,
          name: user.name
        }
      });
    } catch (error) {
      next(error);
    }
  }
  
  // Update user
  async update(req, res, next) {
    try {
      const { id } = req.params;
      const updates = req.body;
      
      // Remove sensitive fields
      delete updates.password;
      delete updates.role;
      
      const user = await User.findByIdAndUpdate(
        id,
        updates,
        { new: true, runValidators: true }
      ).select('-password');
      
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
      
      res.json({ user });
    } catch (error) {
      next(error);
    }
  }
  
  // Delete user
  async delete(req, res, next) {
    try {
      const user = await User.findByIdAndDelete(req.params.id);
      
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
      
      res.json({ message: 'User deleted successfully' });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new UserController();
```

### Service Layer Pattern

Separate business logic from controllers:

```javascript
// services/userService.js
const User = require('../models/User');
const bcrypt = require('bcrypt');

class UserService {
  async createUser(userData) {
    const { email, password, name } = userData;
    
    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new Error('Email already exists');
    }
    
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Create user
    const user = await User.create({
      email,
      password: hashedPassword,
      name
    });
    
    return this.sanitizeUser(user);
  }
  
  async getUserById(userId) {
    const user = await User.findById(userId)
      .select('-password')
      .populate('posts');
    
    if (!user) {
      throw new Error('User not found');
    }
    
    return user;
  }
  
  async updateUser(userId, updates) {
    // Business logic
    if (updates.password) {
      updates.password = await bcrypt.hash(updates.password, 10);
    }
    
    const user = await User.findByIdAndUpdate(
      userId,
      updates,
      { new: true, runValidators: true }
    );
    
    if (!user) {
      throw new Error('User not found');
    }
    
    return this.sanitizeUser(user);
  }
  
  sanitizeUser(user) {
    const userObj = user.toObject();
    delete userObj.password;
    return userObj;
  }
}

module.exports = new UserService();

// controllers/userController.js
const userService = require('../services/userService');

class UserController {
  async create(req, res, next) {
    try {
      const user = await userService.createUser(req.body);
      res.status(201).json({ user });
    } catch (error) {
      next(error);
    }
  }
  
  async getById(req, res, next) {
    try {
      const user = await userService.getUserById(req.params.id);
      res.json({ user });
    } catch (error) {
      next(error);
    }
  }
}
```

## Middleware

### Custom Middleware

```javascript
// middleware/logger.js
const logger = (req, res, next) => {
  console.log(`${req.method} ${req.url} - ${new Date().toISOString()}`);
  next();
};

// middleware/requestId.js
const { v4: uuidv4 } = require('uuid');

const requestId = (req, res, next) => {
  req.id = uuidv4();
  res.setHeader('X-Request-ID', req.id);
  next();
};

// middleware/timing.js
const timing = (req, res, next) => {
  const start = Date.now();
  
  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(`${req.method} ${req.url} - ${duration}ms`);
  });
  
  next();
};

// Usage
app.use(logger);
app.use(requestId);
app.use(timing);
```

### Error Handling Middleware

```javascript
// middleware/errorHandler.js
const errorHandler = (err, req, res, next) => {
  console.error(err.stack);
  
  // Mongoose validation error
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      error: 'Validation Error',
      details: Object.values(err.errors).map(e => e.message)
    });
  }
  
  // Mongoose cast error (invalid ObjectId)
  if (err.name === 'CastError') {
    return res.status(400).json({
      error: 'Invalid ID format'
    });
  }
  
  // JWT error
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({
      error: 'Invalid token'
    });
  }
  
  // Default error
  res.status(err.statusCode || 500).json({
    error: err.message || 'Internal Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
};

// 404 handler
const notFound = (req, res, next) => {
  res.status(404).json({
    error: 'Route not found',
    path: req.url
  });
};

// Usage (must be last)
app.use(notFound);
app.use(errorHandler);
```

### Async Error Handling

```javascript
// utils/asyncHandler.js
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

// Usage
app.get('/users', asyncHandler(async (req, res) => {
  const users = await User.find();
  res.json({ users });
}));

// Or using express-async-errors package
require('express-async-errors');

// Now you can use async without wrapper
app.get('/users', async (req, res) => {
  const users = await User.find();
  res.json({ users });
});
```

## Input Validation

### Using express-validator

```javascript
const { body, param, query, validationResult } = require('express-validator');

// Validation middleware
const validateUser = [
  body('email')
    .isEmail().withMessage('Invalid email')
    .normalizeEmail(),
  body('password')
    .isLength({ min: 8 }).withMessage('Password must be at least 8 characters')
    .matches(/\d/).withMessage('Password must contain a number'),
  body('name')
    .trim()
    .isLength({ min: 2 }).withMessage('Name must be at least 2 characters'),
  body('age')
    .optional()
    .isInt({ min: 0, max: 120 }).withMessage('Invalid age'),
  
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];

// Route with validation
app.post('/users', validateUser, userController.create);

// Query validation
const validatePagination = [
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 100 }),
  query('sort').optional().isIn(['asc', 'desc'])
];

app.get('/users', validatePagination, userController.getAll);

// Param validation
const validateId = [
  param('id').isMongoId().withMessage('Invalid ID format')
];

app.get('/users/:id', validateId, userController.getById);
```

### Custom Validators

```javascript
const { body } = require('express-validator');

const validateUserUpdate = [
  body('email')
    .optional()
    .isEmail()
    .custom(async (email, { req }) => {
      const user = await User.findOne({ email });
      if (user && user._id.toString() !== req.params.id) {
        throw new Error('Email already in use');
      }
      return true;
    }),
  
  body('username')
    .optional()
    .isLength({ min: 3, max: 20 })
    .matches(/^[a-zA-Z0-9_]+$/).withMessage('Username can only contain letters, numbers, and underscores')
    .custom(async (username) => {
      const user = await User.findOne({ username });
      if (user) {
        throw new Error('Username already taken');
      }
      return true;
    }),
  
  body('age')
    .optional()
    .custom((value) => {
      if (value < 18) {
        throw new Error('Must be 18 or older');
      }
      return true;
    })
];
```

## RESTful API Design

### REST Conventions

```javascript
// Resource-based URLs
GET    /users           - Get all users
GET    /users/:id       - Get user by ID
POST   /users           - Create new user
PUT    /users/:id       - Replace user
PATCH  /users/:id       - Update user partially
DELETE /users/:id       - Delete user

// Nested resources
GET    /users/:id/posts           - Get user's posts
POST   /users/:id/posts           - Create post for user
GET    /users/:id/posts/:postId   - Get specific post
PUT    /users/:id/posts/:postId   - Update post
DELETE /users/:id/posts/:postId   - Delete post

// Filtering, sorting, pagination
GET /users?role=admin&sort=createdAt&order=desc&page=1&limit=10

// Searching
GET /users?search=john&fields=name,email
```

### Response Formats

```javascript
// Success response
res.json({
  success: true,
  data: {
    user: { id: 1, name: 'John' }
  }
});

// Error response
res.status(400).json({
  success: false,
  error: {
    message: 'Validation failed',
    code: 'VALIDATION_ERROR',
    details: [
      { field: 'email', message: 'Invalid email format' }
    ]
  }
});

// Pagination response
res.json({
  success: true,
  data: users,
  pagination: {
    page: 1,
    limit: 10,
    total: 100,
    totalPages: 10
  }
});
```

### HTTP Status Codes

```javascript
// Success
200 OK              - Standard success
201 Created         - Resource created
204 No Content      - Success with no response body

// Client Errors
400 Bad Request     - Invalid input
401 Unauthorized    - Authentication required
403 Forbidden       - Authenticated but not authorized
404 Not Found       - Resource doesn't exist
409 Conflict        - Resource conflict (e.g., duplicate)
422 Unprocessable   - Validation error

// Server Errors
500 Internal Server Error
503 Service Unavailable
```

## Advanced Routing

### Route Versioning

```javascript
// Version in URL
app.use('/api/v1', require('./routes/v1'));
app.use('/api/v2', require('./routes/v2'));

// Version in header
app.use((req, res, next) => {
  const version = req.headers['api-version'] || 'v1';
  req.apiVersion = version;
  next();
});

// Route based on version
app.get('/users', (req, res) => {
  if (req.apiVersion === 'v2') {
    // V2 logic
  } else {
    // V1 logic
  }
});
```

### Content Negotiation

```javascript
app.get('/users/:id', (req, res) => {
  const user = getUserById(req.params.id);
  
  res.format({
    'application/json': () => {
      res.json(user);
    },
    'application/xml': () => {
      res.send(`<user><id>${user.id}</id><name>${user.name}</name></user>`);
    },
    'text/html': () => {
      res.send(`<h1>${user.name}</h1>`);
    },
    default: () => {
      res.status(406).send('Not Acceptable');
    }
  });
});
```