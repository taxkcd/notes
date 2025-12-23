# API Development - Interview Guide

## API Design Principles

### REST API Best Practices

**1. Use Nouns for Resources, Verbs for Actions**
```
Good:
GET    /users          - Get all users
POST   /users          - Create user
GET    /users/123      - Get specific user
PUT    /users/123      - Update user
DELETE /users/123      - Delete user

Bad:
GET    /getUsers
POST   /createUser
GET    /getUserById/123
```

**2. Use Plural Nouns**
```
Good: /users, /products, /orders
Bad: /user, /product, /order
```

**3. Use Hierarchical Structure for Relationships**
```
GET /users/123/posts           - Get posts by user 123
GET /posts/456/comments        - Get comments for post 456
POST /users/123/posts          - Create post for user 123
```

**4. Filtering, Sorting, and Pagination**
```javascript
// Filtering
GET /users?role=admin&status=active

// Sorting
GET /users?sort=createdAt&order=desc
GET /users?sort=-createdAt  // minus for descending

// Pagination
GET /users?page=2&limit=20
GET /users?offset=20&limit=20

// Field selection
GET /users?fields=name,email,createdAt

// Search
GET /users?search=john
```

**5. Versioning**
```
URL versioning: /api/v1/users
Header versioning: Accept: application/vnd.api.v1+json
Query parameter: /api/users?version=1
```

### Response Format Standards

```javascript
// Success response
{
  "success": true,
  "data": {
    "user": {
      "id": "123",
      "name": "John Doe",
      "email": "john@example.com"
    }
  }
}

// List response with pagination
{
  "success": true,
  "data": {
    "users": [...],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 100,
      "totalPages": 5
    }
  }
}

// Error response
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input data",
    "details": [
      {
        "field": "email",
        "message": "Invalid email format"
      }
    ]
  }
}

// Multiple errors
{
  "success": false,
  "errors": [
    {
      "code": "REQUIRED_FIELD",
      "message": "Email is required",
      "field": "email"
    },
    {
      "code": "MIN_LENGTH",
      "message": "Password must be at least 8 characters",
      "field": "password"
    }
  ]
}
```

## CORS (Cross-Origin Resource Sharing)

```javascript
const cors = require('cors');

// Basic CORS - Allow all origins
app.use(cors());

// Custom CORS configuration
const corsOptions = {
  origin: function (origin, callback) {
    const allowedOrigins = [
      'https://yourapp.com',
      'https://www.yourapp.com',
      'http://localhost:3000'
    ];
    
    // Allow requests with no origin (like mobile apps or curl)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true, // Allow cookies
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  exposedHeaders: ['X-Total-Count'], // Expose custom headers to client
  maxAge: 86400 // Preflight cache duration (24 hours)
};

app.use(cors(corsOptions));

// Different CORS for different routes
app.use('/api/public', cors()); // Public API - all origins
app.use('/api/private', cors(corsOptions)); // Private API - restricted origins

// Manual CORS handling
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'https://yourapp.com');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.header('Access-Control-Allow-Credentials', 'true');
  
  // Handle preflight
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  
  next();
});
```

## Rate Limiting

```javascript
const rateLimit = require('express-rate-limit');
const RedisStore = require('rate-limit-redis');
const Redis = require('ioredis');

// Basic rate limiting (in-memory)
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later',
  standardHeaders: true, // Return rate limit info in `RateLimit-*` headers
  legacyHeaders: false, // Disable `X-RateLimit-*` headers
});

app.use('/api/', limiter);

// Different limits for different routes
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5, // 5 login attempts per 15 minutes
  skipSuccessfulRequests: true
});

app.post('/auth/login', authLimiter, authController.login);

// Redis-based rate limiting (for distributed systems)
const redisClient = new Redis({
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT
});

const distributedLimiter = rateLimit({
  store: new RedisStore({
    client: redisClient,
    prefix: 'rl:'
  }),
  windowMs: 15 * 60 * 1000,
  max: 100
});

app.use('/api/', distributedLimiter);

// Custom rate limiting logic
const customRateLimit = async (req, res, next) => {
  const key = `rate_limit:${req.ip}`;
  const current = await redisClient.incr(key);
  
  if (current === 1) {
    await redisClient.expire(key, 60); // 1 minute window
  }
  
  if (current > 10) {
    return res.status(429).json({
      error: 'Too many requests',
      retryAfter: await redisClient.ttl(key)
    });
  }
  
  res.setHeader('X-RateLimit-Limit', 10);
  res.setHeader('X-RateLimit-Remaining', Math.max(0, 10 - current));
  
  next();
};

// User-based rate limiting
const userRateLimit = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: async (req) => {
    // Premium users get higher limits
    if (req.user && req.user.plan === 'premium') {
      return 1000;
    }
    return 100;
  },
  keyGenerator: (req) => {
    return req.user ? req.user.id : req.ip;
  }
});
```

## Request Logging

```javascript
const morgan = require('morgan');
const fs = require('fs');
const path = require('path');

// Basic logging
app.use(morgan('combined'));

// Custom log format
morgan.token('user-id', (req) => req.user ? req.user.id : 'anonymous');
morgan.token('request-body', (req) => JSON.stringify(req.body));

const customFormat = ':method :url :status :response-time ms - :user-id';
app.use(morgan(customFormat));

// Log to file
const accessLogStream = fs.createWriteStream(
  path.join(__dirname, 'logs', 'access.log'),
  { flags: 'a' }
);

app.use(morgan('combined', { stream: accessLogStream }));

// Different logging for different environments
if (process.env.NODE_ENV === 'production') {
  app.use(morgan('combined', { stream: accessLogStream }));
} else {
  app.use(morgan('dev'));
}

// Skip logging for certain routes
app.use(morgan('combined', {
  skip: (req, res) => req.url === '/health' || res.statusCode < 400
}));

// Custom logger with Winston
const winston = require('winston');

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' })
  ]
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.simple()
  }));
}

// Custom logging middleware
app.use((req, res, next) => {
  const start = Date.now();
  
  res.on('finish', () => {
    const duration = Date.now() - start;
    logger.info({
      method: req.method,
      url: req.url,
      status: res.statusCode,
      duration: `${duration}ms`,
      userId: req.user ? req.user.id : null,
      ip: req.ip,
      userAgent: req.get('user-agent')
    });
  });
  
  next();
});
```

## API Documentation

### Swagger/OpenAPI

```javascript
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Your API',
      version: '1.0.0',
      description: 'API documentation'
    },
    servers: [
      {
        url: 'http://localhost:3000/api',
        description: 'Development server'
      },
      {
        url: 'https://api.yourapp.com',
        description: 'Production server'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      }
    }
  },
  apis: ['./routes/*.js', './controllers/*.js']
};

const specs = swaggerJsdoc(options);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

// Documenting routes with JSDoc comments
/**
 * @swagger
 * /users:
 *   get:
 *     summary: Get all users
 *     tags: [Users]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Number of items per page
 *     responses:
 *       200:
 *         description: List of users
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 users:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/User'
 *                 pagination:
 *                   $ref: '#/components/schemas/Pagination'
 */
router.get('/', userController.getAll);

/**
 * @swagger
 * /users/{id}:
 *   get:
 *     summary: Get user by ID
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     responses:
 *       200:
 *         description: User details
 *       404:
 *         description: User not found
 *       401:
 *         description: Unauthorized
 */
router.get('/:id', authenticate, userController.getById);

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         email:
 *           type: string
 *         name:
 *           type: string
 *         createdAt:
 *           type: string
 *           format: date-time
 */
```

## Content Negotiation

```javascript
// Handle different content types
app.get('/users/:id', async (req, res) => {
  const user = await User.findById(req.params.id);
  
  res.format({
    'application/json': () => {
      res.json(user);
    },
    
    'application/xml': () => {
      res.type('application/xml');
      res.send(`
        <user>
          <id>${user.id}</id>
          <name>${user.name}</name>
          <email>${user.email}</email>
        </user>
      `);
    },
    
    'text/html': () => {
      res.send(`
        <html>
          <body>
            <h1>${user.name}</h1>
            <p>Email: ${user.email}</p>
          </body>
        </html>
      `);
    },
    
    'text/csv': () => {
      res.type('text/csv');
      res.send(`id,name,email\n${user.id},${user.name},${user.email}`);
    },
    
    default: () => {
      res.status(406).send('Not Acceptable');
    }
  });
});

// Compression
const compression = require('compression');

app.use(compression({
  level: 6, // Compression level (0-9)
  threshold: 1024, // Minimum size to compress (bytes)
  filter: (req, res) => {
    if (req.headers['x-no-compression']) {
      return false;
    }
    return compression.filter(req, res);
  }
}));
```

## API Versioning

### URL Versioning

```javascript
// routes/v1/users.js
const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.json({ version: 'v1', users: [] });
});

module.exports = router;

// routes/v2/users.js
const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.json({ 
    version: 'v2', 
    data: { users: [] },
    meta: { total: 0 }
  });
});

module.exports = router;

// app.js
app.use('/api/v1/users', require('./routes/v1/users'));
app.use('/api/v2/users', require('./routes/v2/users'));
```

### Header Versioning

```javascript
const versionMiddleware = (req, res, next) => {
  const version = req.headers['api-version'] || 'v1';
  req.apiVersion = version;
  next();
};

app.use(versionMiddleware);

app.get('/users', (req, res) => {
  if (req.apiVersion === 'v2') {
    // V2 response format
    return res.json({ 
      data: { users: [] },
      meta: { version: 'v2' }
    });
  }
  
  // V1 response format
  res.json({ users: [] });
});
```

## Webhooks

```javascript
// Webhook endpoint
app.post('/webhooks/stripe', express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature'];
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;
  
  let event;
  
  try {
    event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }
  
  // Handle different event types
  switch (event.type) {
    case 'payment_intent.succeeded':
      const paymentIntent = event.data.object;
      await handlePaymentSuccess(paymentIntent);
      break;
      
    case 'payment_intent.payment_failed':
      const failedPayment = event.data.object;
      await handlePaymentFailure(failedPayment);
      break;
      
    case 'customer.subscription.updated':
      const subscription = event.data.object;
      await handleSubscriptionUpdate(subscription);
      break;
      
    default:
      console.log(`Unhandled event type ${event.type}`);
  }
  
  res.json({ received: true });
});

// Sending webhooks to other services
const sendWebhook = async (url, data) => {
  const secret = process.env.WEBHOOK_SECRET;
  const timestamp = Date.now();
  
  // Create signature
  const crypto = require('crypto');
  const signature = crypto
    .createHmac('sha256', secret)
    .update(`${timestamp}.${JSON.stringify(data)}`)
    .digest('hex');
  
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Webhook-Signature': signature,
        'X-Webhook-Timestamp': timestamp
      },
      body: JSON.stringify(data)
    });
    
    if (!response.ok) {
      throw new Error(`Webhook failed: ${response.status}`);
    }
    
    return { success: true };
  } catch (error) {
    console.error('Webhook error:', error);
    // Implement retry logic
    return { success: false, error: error.message };
  }
};

// Webhook retry mechanism
const retryWebhook = async (url, data, maxRetries = 3) => {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    const result = await sendWebhook(url, data);
    
    if (result.success) {
      return result;
    }
    
    // Exponential backoff
    const delay = Math.pow(2, attempt) * 1000;
    await new Promise(resolve => setTimeout(resolve, delay));
  }
  
  throw new Error('Webhook failed after max retries');
};
```

## GraphQL (Alternative to REST)

```javascript
const { ApolloServer, gql } = require('apollo-server-express');

// Type definitions
const typeDefs = gql`
  type User {
    id: ID!
    email: String!
    name: String!
    posts: [Post!]!
  }
  
  type Post {
    id: ID!
    title: String!
    content: String!
    author: User!
  }
  
  type Query {
    users: [User!]!
    user(id: ID!): User
    posts: [Post!]!
  }
  
  type Mutation {
    createUser(email: String!, name: String!, password: String!): User!
    createPost(title: String!, content: String!): Post!
  }
`;

// Resolvers
const resolvers = {
  Query: {
    users: async () => await User.find(),
    user: async (_, { id }) => await User.findById(id),
    posts: async () => await Post.find()
  },
  
  Mutation: {
    createUser: async (_, { email, name, password }) => {
      const user = await User.create({ email, name, password });
      return user;
    },
    createPost: async (_, { title, content }, context) => {
      if (!context.user) {
        throw new Error('Not authenticated');
      }
      const post = await Post.create({
        title,
        content,
        authorId: context.user.id
      });
      return post;
    }
  },
  
  User: {
    posts: async (user) => await Post.find({ authorId: user.id })
  },
  
  Post: {
    author: async (post) => await User.findById(post.authorId)
  }
};

// Create Apollo Server
const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req }) => {
    // Add user to context from JWT
    const token = req.headers.authorization?.replace('Bearer ', '');
    const user = verifyToken(token);
    return { user };
  }
});

await server.start();
server.applyMiddleware({ app });
```