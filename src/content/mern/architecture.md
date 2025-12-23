# Architecture & Design Patterns - Interview Guide

## Project Structure

### MVC Architecture

```
project/
├── src/
│   ├── controllers/
│   │   ├── userController.js
│   │   ├── postController.js
│   │   └── authController.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Post.js
│   │   └── Comment.js
│   ├── routes/
│   │   ├── index.js
│   │   ├── users.js
│   │   ├── posts.js
│   │   └── auth.js
│   ├── views/
│   │   └── templates/
│   ├── middleware/
│   │   ├── authenticate.js
│   │   ├── authorize.js
│   │   └── errorHandler.js
│   ├── config/
│   │   ├── database.js
│   │   └── config.js
│   └── app.js
├── tests/
├── .env
├── .gitignore
├── package.json
└── server.js
```

### Layered Architecture

```
project/
├── src/
│   ├── api/ (Presentation Layer)
│   │   ├── controllers/
│   │   ├── routes/
│   │   ├── middleware/
│   │   └── validators/
│   ├── services/ (Business Logic Layer)
│   │   ├── userService.js
│   │   ├── postService.js
│   │   └── authService.js
│   ├── data/ (Data Access Layer)
│   │   ├── repositories/
│   │   │   ├── userRepository.js
│   │   │   └── postRepository.js
│   │   └── models/
│   │       ├── User.js
│   │       └── Post.js
│   ├── domain/ (Domain Layer)
│   │   ├── entities/
│   │   └── valueObjects/
│   └── infrastructure/
│       ├── database/
│       ├── cache/
│       └── queue/
```

## Design Patterns

### Repository Pattern

```javascript
// repositories/userRepository.js
class UserRepository {
  constructor(model) {
    this.model = model;
  }
  
  async findById(id) {
    return await this.model.findById(id);
  }
  
  async findByEmail(email) {
    return await this.model.findOne({ email });
  }
  
  async create(userData) {
    return await this.model.create(userData);
  }
  
  async update(id, updates) {
    return await this.model.findByIdAndUpdate(id, updates, { new: true });
  }
  
  async delete(id) {
    return await this.model.findByIdAndDelete(id);
  }
  
  async findAll(filters = {}, options = {}) {
    const { page = 1, limit = 10, sort = '-createdAt' } = options;
    
    return await this.model
      .find(filters)
      .limit(limit)
      .skip((page - 1) * limit)
      .sort(sort);
  }
}

module.exports = UserRepository;

// Usage in service
const User = require('../models/User');
const UserRepository = require('../repositories/userRepository');

const userRepository = new UserRepository(User);

class UserService {
  async getUserById(id) {
    return await userRepository.findById(id);
  }
  
  async createUser(userData) {
    const existingUser = await userRepository.findByEmail(userData.email);
    if (existingUser) {
      throw new Error('Email already exists');
    }
    return await userRepository.create(userData);
  }
}
```

### Service Layer Pattern

```javascript
// services/orderService.js
class OrderService {
  constructor(orderRepository, productRepository, paymentService, emailService) {
    this.orderRepository = orderRepository;
    this.productRepository = productRepository;
    this.paymentService = paymentService;
    this.emailService = emailService;
  }
  
  async createOrder(userId, items) {
    // Validate products
    const products = await this.productRepository.findByIds(
      items.map(item => item.productId)
    );
    
    if (products.length !== items.length) {
      throw new Error('Some products not found');
    }
    
    // Calculate total
    let total = 0;
    const orderItems = items.map(item => {
      const product = products.find(p => p.id === item.productId);
      const itemTotal = product.price * item.quantity;
      total += itemTotal;
      
      return {
        productId: product.id,
        quantity: item.quantity,
        price: product.price,
        total: itemTotal
      };
    });
    
    // Create order
    const order = await this.orderRepository.create({
      userId,
      items: orderItems,
      total,
      status: 'pending'
    });
    
    // Process payment
    try {
      const payment = await this.paymentService.charge(userId, total);
      
      // Update order
      await this.orderRepository.update(order.id, {
        status: 'paid',
        paymentId: payment.id
      });
      
      // Send confirmation email
      await this.emailService.sendOrderConfirmation(userId, order);
      
      return order;
    } catch (error) {
      // Update order status
      await this.orderRepository.update(order.id, {
        status: 'failed',
        error: error.message
      });
      
      throw error;
    }
  }
  
  async getOrderById(orderId, userId) {
    const order = await this.orderRepository.findById(orderId);
    
    if (!order) {
      throw new Error('Order not found');
    }
    
    // Authorization check
    if (order.userId !== userId) {
      throw new Error('Unauthorized');
    }
    
    return order;
  }
}

module.exports = OrderService;
```

### Factory Pattern

```javascript
// factories/notificationFactory.js
class EmailNotification {
  async send(recipient, message) {
    console.log(`Sending email to ${recipient}: ${message}`);
  }
}

class SMSNotification {
  async send(recipient, message) {
    console.log(`Sending SMS to ${recipient}: ${message}`);
  }
}

class PushNotification {
  async send(recipient, message) {
    console.log(`Sending push to ${recipient}: ${message}`);
  }
}

class NotificationFactory {
  static create(type) {
    switch (type) {
      case 'email':
        return new EmailNotification();
      case 'sms':
        return new SMSNotification();
      case 'push':
        return new PushNotification();
      default:
        throw new Error('Invalid notification type');
    }
  }
}

// Usage
const notification = NotificationFactory.create('email');
await notification.send('user@example.com', 'Hello!');
```

### Strategy Pattern

```javascript
// strategies/paymentStrategies.js
class CreditCardPayment {
  async process(amount, details) {
    console.log(`Processing credit card payment: $${amount}`);
    return { success: true, transactionId: 'cc_123' };
  }
}

class PayPalPayment {
  async process(amount, details) {
    console.log(`Processing PayPal payment: $${amount}`);
    return { success: true, transactionId: 'pp_456' };
  }
}

class CryptoPayment {
  async process(amount, details) {
    console.log(`Processing crypto payment: $${amount}`);
    return { success: true, transactionId: 'crypto_789' };
  }
}

class PaymentProcessor {
  constructor(strategy) {
    this.strategy = strategy;
  }
  
  setStrategy(strategy) {
    this.strategy = strategy;
  }
  
  async processPayment(amount, details) {
    return await this.strategy.process(amount, details);
  }
}

// Usage
const processor = new PaymentProcessor(new CreditCardPayment());
await processor.processPayment(100, { cardNumber: '****' });

// Switch strategy
processor.setStrategy(new PayPalPayment());
await processor.processPayment(200, { email: 'user@example.com' });
```

### Observer Pattern (Event Emitter)

```javascript
const EventEmitter = require('events');

class UserEvents extends EventEmitter {}
const userEvents = new UserEvents();

// Subscribers
userEvents.on('user:created', async (user) => {
  // Send welcome email
  await emailService.sendWelcomeEmail(user.email);
});

userEvents.on('user:created', async (user) => {
  // Create default profile
  await profileService.createDefaultProfile(user.id);
});

userEvents.on('user:created', async (user) => {
  // Track analytics
  await analytics.track('user_registered', { userId: user.id });
});

// Publisher
class UserService {
  async createUser(userData) {
    const user = await User.create(userData);
    
    // Emit event
    userEvents.emit('user:created', user);
    
    return user;
  }
}
```

### Singleton Pattern

```javascript
// database/connection.js
class DatabaseConnection {
  constructor() {
    if (DatabaseConnection.instance) {
      return DatabaseConnection.instance;
    }
    
    this.connection = null;
    DatabaseConnection.instance = this;
  }
  
  async connect() {
    if (!this.connection) {
      this.connection = await mongoose.connect(process.env.MONGODB_URI);
      console.log('Database connected');
    }
    return this.connection;
  }
  
  getConnection() {
    return this.connection;
  }
}

const instance = new DatabaseConnection();
Object.freeze(instance);

module.exports = instance;
```

### Dependency Injection

```javascript
// container.js
class Container {
  constructor() {
    this.services = {};
  }
  
  register(name, definition, dependencies = []) {
    this.services[name] = { definition, dependencies };
  }
  
  get(name) {
    const service = this.services[name];
    
    if (!service) {
      throw new Error(`Service ${name} not found`);
    }
    
    const dependencies = service.dependencies.map(dep => this.get(dep));
    
    if (typeof service.definition === 'function') {
      return new service.definition(...dependencies);
    }
    
    return service.definition;
  }
}

const container = new Container();

// Register services
container.register('userRepository', UserRepository);
container.register('userService', UserService, ['userRepository']);
container.register('userController', UserController, ['userService']);

// Get service
const userController = container.get('userController');

// Using dependency-injection library
const { createContainer, asClass, asValue } = require('awilix');

const container = createContainer();

container.register({
  userRepository: asClass(UserRepository).singleton(),
  userService: asClass(UserService).singleton(),
  userController: asClass(UserController).scoped()
});

// Usage in routes
app.get('/users', (req, res) => {
  const userController = req.container.resolve('userController');
  return userController.getAll(req, res);
});
```

## Microservices Architecture

### Service Structure

```
services/
├── user-service/
│   ├── src/
│   ├── Dockerfile
│   └── package.json
├── order-service/
│   ├── src/
│   ├── Dockerfile
│   └── package.json
├── payment-service/
│   ├── src/
│   ├── Dockerfile
│   └── package.json
└── api-gateway/
    ├── src/
    ├── Dockerfile
    └── package.json
```

### Inter-Service Communication

```javascript
// Using HTTP
const axios = require('axios');

class UserServiceClient {
  constructor(baseUrl) {
    this.client = axios.create({
      baseURL: baseUrl || process.env.USER_SERVICE_URL,
      timeout: 5000
    });
  }
  
  async getUserById(userId) {
    const response = await this.client.get(`/users/${userId}`);
    return response.data;
  }
}

// Using Message Queue (RabbitMQ)
const amqp = require('amqplib');

class MessageBroker {
  async connect() {
    this.connection = await amqp.connect(process.env.RABBITMQ_URL);
    this.channel = await this.connection.createChannel();
  }
  
  async publish(queue, message) {
    await this.channel.assertQueue(queue, { durable: true });
    this.channel.sendToQueue(queue, Buffer.from(JSON.stringify(message)));
  }
  
  async subscribe(queue, handler) {
    await this.channel.assertQueue(queue, { durable: true });
    this.channel.consume(queue, async (msg) => {
      const data = JSON.parse(msg.content.toString());
      await handler(data);
      this.channel.ack(msg);
    });
  }
}

// Usage
const broker = new MessageBroker();
await broker.connect();

// Publish event
await broker.publish('user-created', { userId: '123', email: 'user@example.com' });

// Subscribe to events
await broker.subscribe('user-created', async (data) => {
  console.log('User created:', data);
  // Handle event
});
```

## Clean Architecture

```javascript
// domain/entities/User.js
class User {
  constructor(id, email, name, createdAt) {
    this.id = id;
    this.email = email;
    this.name = name;
    this.createdAt = createdAt;
  }
  
  updateEmail(newEmail) {
    // Business logic
    if (!this.isValidEmail(newEmail)) {
      throw new Error('Invalid email format');
    }
    this.email = newEmail;
  }
  
  isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }
}

// domain/usecases/CreateUser.js
class CreateUser {
  constructor(userRepository, emailService) {
    this.userRepository = userRepository;
    this.emailService = emailService;
  }
  
  async execute(userData) {
    // Validate
    const existingUser = await this.userRepository.findByEmail(userData.email);
    if (existingUser) {
      throw new Error('Email already exists');
    }
    
    // Create entity
    const user = new User(
      null,
      userData.email,
      userData.name,
      new Date()
    );
    
    // Persist
    const savedUser = await this.userRepository.save(user);
    
    // Send welcome email
    await this.emailService.sendWelcomeEmail(user.email);
    
    return savedUser;
  }
}

// infrastructure/repositories/MongoUserRepository.js
class MongoUserRepository {
  constructor(model) {
    this.model = model;
  }
  
  async save(user) {
    const doc = await this.model.create({
      email: user.email,
      name: user.name
    });
    
    return new User(doc._id, doc.email, doc.name, doc.createdAt);
  }
  
  async findByEmail(email) {
    const doc = await this.model.findOne({ email });
    if (!doc) return null;
    return new User(doc._id, doc.email, doc.name, doc.createdAt);
  }
}
```

## API Gateway Pattern

```javascript
// api-gateway/routes/index.js
const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();

// Route to user service
app.use('/api/users', createProxyMiddleware({
  target: process.env.USER_SERVICE_URL,
  changeOrigin: true,
  pathRewrite: {
    '^/api/users': '/users'
  }
}));

// Route to order service
app.use('/api/orders', createProxyMiddleware({
  target: process.env.ORDER_SERVICE_URL,
  changeOrigin: true,
  pathRewrite: {
    '^/api/orders': '/orders'
  }
}));

// Route to payment service
app.use('/api/payments', createProxyMiddleware({
  target: process.env.PAYMENT_SERVICE_URL,
  changeOrigin: true
}));

// Aggregation endpoint
app.get('/api/user-dashboard/:userId', async (req, res) => {
  try {
    const [user, orders, stats] = await Promise.all([
      axios.get(`${process.env.USER_SERVICE_URL}/users/${req.params.userId}`),
      axios.get(`${process.env.ORDER_SERVICE_URL}/orders?userId=${req.params.userId}`),
      axios.get(`${process.env.ANALYTICS_SERVICE_URL}/stats/${req.params.userId}`)
    ]);
    
    res.json({
      user: user.data,
      orders: orders.data,
      stats: stats.data
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
```

## CQRS (Command Query Responsibility Segregation)

```javascript
// commands/CreateUserCommand.js
class CreateUserCommand {
  constructor(email, name, password) {
    this.email = email;
    this.name = name;
    this.password = password;
  }
}

// commandHandlers/CreateUserHandler.js
class CreateUserHandler {
  constructor(userRepository, eventBus) {
    this.userRepository = userRepository;
    this.eventBus = eventBus;
  }
  
  async handle(command) {
    const user = await this.userRepository.create({
      email: command.email,
      name: command.name,
      password: command.password
    });
    
    // Publish event
    this.eventBus.publish('UserCreated', {
      userId: user.id,
      email: user.email
    });
    
    return user;
  }
}

// queries/GetUserQuery.js
class GetUserQuery {
  constructor(userId) {
    this.userId = userId;
  }
}

// queryHandlers/GetUserHandler.js
class GetUserHandler {
  constructor(userReadModel) {
    this.userReadModel = userReadModel;
  }
  
  async handle(query) {
    return await this.userReadModel.findById(query.userId);
  }
}
```

## Best Practices

1. **Separation of Concerns**: Keep different layers independent
2. **Single Responsibility**: Each class/function should have one job
3. **Dependency Inversion**: Depend on abstractions, not concretions
4. **Don't Repeat Yourself (DRY)**: Avoid code duplication
5. **KISS (Keep It Simple)**: Simplicity over complexity
6. **YAGNI (You Aren't Gonna Need It)**: Don't add unnecessary features
7. **Composition over Inheritance**: Prefer composition
8. **Interface Segregation**: Use small, focused interfaces
9. **Loose Coupling**: Minimize dependencies between modules
10. **High Cohesion**: Related functionality should be together