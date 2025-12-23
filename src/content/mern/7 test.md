# Testing - Interview Guide

## Jest Testing Framework

### Basic Setup

```javascript
// package.json
{
  "scripts": {
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage"
  }
}

// jest.config.js
module.exports = {
  testEnvironment: 'node',
  coverageDirectory: 'coverage',
  collectCoverageFrom: [
    'src/**/*.js',
    '!src/**/*.test.js'
  ],
  testMatch: [
    '**/__tests__/**/*.js',
    '**/*.test.js'
  ],
  setupFilesAfterEnv: ['./tests/setup.js']
};
```

### Unit Tests

```javascript
// utils/math.js
const add = (a, b) => a + b;
const subtract = (a, b) => a - b;
const multiply = (a, b) => a * b;
const divide = (a, b) => {
  if (b === 0) throw new Error('Division by zero');
  return a / b;
};

module.exports = { add, subtract, multiply, divide };

// utils/math.test.js
const { add, subtract, multiply, divide } = require('./math');

describe('Math utilities', () => {
  describe('add', () => {
    test('adds two positive numbers', () => {
      expect(add(2, 3)).toBe(5);
    });
    
    test('adds negative numbers', () => {
      expect(add(-2, -3)).toBe(-5);
    });
  });
  
  describe('divide', () => {
    test('divides two numbers', () => {
      expect(divide(10, 2)).toBe(5);
    });
    
    test('throws error on division by zero', () => {
      expect(() => divide(10, 0)).toThrow('Division by zero');
    });
  });
});
```

### Testing Async Code

```javascript
// services/userService.js
const User = require('../models/User');

class UserService {
  async createUser(userData) {
    const user = await User.create(userData);
    return user;
  }
  
  async getUserById(id) {
    const user = await User.findById(id);
    if (!user) {
      throw new Error('User not found');
    }
    return user;
  }
}

module.exports = new UserService();

// services/userService.test.js
const userService = require('./userService');
const User = require('../models/User');

// Mock the User model
jest.mock('../models/User');

describe('UserService', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });
  
  describe('createUser', () => {
    test('creates a new user', async () => {
      const userData = { email: 'test@example.com', name: 'Test User' };
      const mockUser = { id: '123', ...userData };
      
      User.create.mockResolvedValue(mockUser);
      
      const result = await userService.createUser(userData);
      
      expect(User.create).toHaveBeenCalledWith(userData);
      expect(result).toEqual(mockUser);
    });
  });
  
  describe('getUserById', () => {
    test('returns user when found', async () => {
      const mockUser = { id: '123', email: 'test@example.com' };
      
      User.findById.mockResolvedValue(mockUser);
      
      const result = await userService.getUserById('123');
      
      expect(result).toEqual(mockUser);
    });
    
    test('throws error when user not found', async () => {
      User.findById.mockResolvedValue(null);
      
      await expect(userService.getUserById('999'))
        .rejects
        .toThrow('User not found');
    });
  });
});
```

### Mocking

```javascript
// Mock functions
const mockCallback = jest.fn(x => x * 2);

test('mock function', () => {
  mockCallback(1);
  mockCallback(2);
  
  // Function was called twice
  expect(mockCallback).toHaveBeenCalledTimes(2);
  
  // First call with argument 1
  expect(mockCallback).toHaveBeenNthCalledWith(1, 1);
  
  // Returns correct values
  expect(mockCallback).toHaveReturnedWith(2);
  expect(mockCallback).toHaveLastReturnedWith(4);
});

// Mock return values
const mockFn = jest.fn();
mockFn.mockReturnValue(42);
mockFn.mockReturnValueOnce(1).mockReturnValueOnce(2).mockReturnValue(3);

// Mock resolved/rejected promises
mockFn.mockResolvedValue('success');
mockFn.mockRejectedValue(new Error('failure'));

// Mock implementation
const mockFn = jest.fn((a, b) => a + b);

// Spy on methods
const user = {
  getName: () => 'John'
};
const spy = jest.spyOn(user, 'getName');
user.getName();
expect(spy).toHaveBeenCalled();
spy.mockRestore();
```

### Testing Express Routes

```javascript
// routes/users.test.js
const request = require('supertest');
const express = require('express');
const userRoutes = require('./users');
const userService = require('../services/userService');

jest.mock('../services/userService');

const app = express();
app.use(express.json());
app.use('/users', userRoutes);

describe('User Routes', () => {
  describe('GET /users', () => {
    test('returns list of users', async () => {
      const mockUsers = [
        { id: '1', name: 'User 1' },
        { id: '2', name: 'User 2' }
      ];
      
      userService.getAllUsers.mockResolvedValue(mockUsers);
      
      const response = await request(app)
        .get('/users')
        .expect(200);
      
      expect(response.body.users).toEqual(mockUsers);
    });
  });
  
  describe('POST /users', () => {
    test('creates a new user', async () => {
      const userData = { email: 'test@example.com', name: 'Test' };
      const mockUser = { id: '123', ...userData };
      
      userService.createUser.mockResolvedValue(mockUser);
      
      const response = await request(app)
        .post('/users')
        .send(userData)
        .expect(201);
      
      expect(response.body.user).toEqual(mockUser);
    });
    
    test('returns 400 on validation error', async () => {
      const response = await request(app)
        .post('/users')
        .send({ email: 'invalid' })
        .expect(400);
      
      expect(response.body.error).toBeDefined();
    });
  });
  
  describe('GET /users/:id', () => {
    test('returns user by id', async () => {
      const mockUser = { id: '123', name: 'Test User' };
      
      userService.getUserById.mockResolvedValue(mockUser);
      
      const response = await request(app)
        .get('/users/123')
        .expect(200);
      
      expect(response.body.user).toEqual(mockUser);
    });
    
    test('returns 404 when user not found', async () => {
      userService.getUserById.mockRejectedValue(new Error('User not found'));
      
      await request(app)
        .get('/users/999')
        .expect(404);
    });
  });
});
```

### Testing Middleware

```javascript
// middleware/authenticate.test.js
const authenticate = require('./authenticate');
const jwt = require('jsonwebtoken');

jest.mock('jsonwebtoken');

describe('authenticate middleware', () => {
  let req, res, next;
  
  beforeEach(() => {
    req = {
      headers: {}
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    next = jest.fn();
  });
  
  test('calls next() with valid token', () => {
    const mockUser = { id: '123', email: 'test@example.com' };
    req.headers.authorization = 'Bearer validtoken';
    jwt.verify.mockReturnValue(mockUser);
    
    authenticate(req, res, next);
    
    expect(req.user).toEqual(mockUser);
    expect(next).toHaveBeenCalled();
  });
  
  test('returns 401 without token', () => {
    authenticate(req, res, next);
    
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ error: 'No token provided' });
    expect(next).not.toHaveBeenCalled();
  });
  
  test('returns 401 with invalid token', () => {
    req.headers.authorization = 'Bearer invalidtoken';
    jwt.verify.mockImplementation(() => {
      throw new Error('Invalid token');
    });
    
    authenticate(req, res, next);
    
    expect(res.status).toHaveBeenCalledWith(401);
  });
});
```

## Integration Tests

```javascript
// tests/integration/user.test.js
const mongoose = require('mongoose');
const request = require('supertest');
const app = require('../../app');
const User = require('../../models/User');

describe('User Integration Tests', () => {
  beforeAll(async () => {
    // Connect to test database
    await mongoose.connect(process.env.TEST_MONGODB_URI);
  });
  
  afterAll(async () => {
    await mongoose.connection.close();
  });
  
  beforeEach(async () => {
    // Clear database before each test
    await User.deleteMany({});
  });
  
  describe('POST /api/users', () => {
    test('creates user in database', async () => {
      const userData = {
        email: 'test@example.com',
        password: 'password123',
        name: 'Test User'
      };
      
      const response = await request(app)
        .post('/api/users')
        .send(userData)
        .expect(201);
      
      expect(response.body.user).toHaveProperty('id');
      expect(response.body.user.email).toBe(userData.email);
      
      // Verify in database
      const user = await User.findById(response.body.user.id);
      expect(user).toBeTruthy();
      expect(user.email).toBe(userData.email);
    });
  });
  
  describe('GET /api/users/:id', () => {
    test('retrieves existing user', async () => {
      // Create user first
      const user = await User.create({
        email: 'test@example.com',
        password: 'hashedpassword',
        name: 'Test User'
      });
      
      const response = await request(app)
        .get(`/api/users/${user._id}`)
        .expect(200);
      
      expect(response.body.user.email).toBe(user.email);
    });
  });
});
```

## Test Database Setup

```javascript
// tests/setup.js
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();
  await mongoose.connect(mongoUri);
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

afterEach(async () => {
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    await collections[key].deleteMany({});
  }
});
```

## Test Fixtures

```javascript
// tests/fixtures/users.js
const userFixtures = {
  validUser: {
    email: 'user@example.com',
    password: 'password123',
    name: 'Test User'
  },
  
  adminUser: {
    email: 'admin@example.com',
    password: 'adminpass',
    name: 'Admin User',
    role: 'admin'
  },
  
  invalidUser: {
    email: 'invalid-email',
    password: '123' // Too short
  }
};

module.exports = userFixtures;

// Usage in tests
const { validUser } = require('../fixtures/users');

test('creates valid user', async () => {
  const response = await request(app)
    .post('/api/users')
    .send(validUser)
    .expect(201);
});
```

## Code Coverage

```bash
# Run tests with coverage
npm test -- --coverage

# Generate coverage report
npm test -- --coverage --coverageReporters=html

# Set coverage thresholds in jest.config.js
module.exports = {
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80
    }
  }
};
```

## Best Practices

1. **AAA Pattern**: Arrange, Act, Assert
2. **Test isolation**: Each test should be independent
3. **Clear test names**: Describe what is being tested
4. **Mock external dependencies**: Database, APIs, third-party services
5. **Test edge cases**: Not just happy path
6. **Use beforeEach/afterEach**: Setup and cleanup
7. **Don't test implementation details**: Test behavior, not internals
8. **Keep tests simple**: One assertion per test when possible
9. **Use meaningful assertions**: Prefer specific matchers
10. **Test error handling**: Test both success and failure scenarios