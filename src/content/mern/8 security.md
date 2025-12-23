# Security Best Practices - Interview Guide

## Input Validation & Sanitization

### XSS Prevention

```javascript
const validator = require('validator');
const xss = require('xss');

// Sanitize user input
const sanitizeInput = (input) => {
  // Remove HTML tags
  return validator.escape(input);
};

// Use xss library for more control
const clean = xss('<script>alert("xss")</script>Hello');
// Output: Hello

// Whitelist HTML tags
const options = {
  whiteList: {
    p: [],
    b: [],
    i: [],
    a: ['href', 'title']
  }
};

const cleanHtml = xss('<p>Safe content</p><script>alert("xss")</script>', options);
```

### SQL Injection Prevention

```javascript
// NEVER do this
const query = `SELECT * FROM users WHERE email = '${email}'`; // VULNERABLE

// Use parameterized queries
const query = 'SELECT * FROM users WHERE email = ?';
const result = await db.query(query, [email]);

// With ORM (Sequelize)
const user = await User.findOne({ where: { email } }); // Safe

// With MongoDB
const user = await User.findOne({ email }); // Safe
```

### NoSQL Injection Prevention

```javascript
// Vulnerable code
app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  // If attacker sends: { email: { $ne: null }, password: { $ne: null } }
  const user = await User.findOne({ email, password }); // VULNERABLE
});

// Safe approach
app.post('/login', async (req, res) => {
  const email = String(req.body.email);
  const password = String(req.body.password);
  
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }
  
  // Compare hashed password
  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }
});

// Use mongo-sanitize
const mongoSanitize = require('express-mongo-sanitize');
app.use(mongoSanitize()); // Removes $ and . from user input
```

## Authentication Security

### Password Security

```javascript
const bcrypt = require('bcrypt');

// Hash password with appropriate cost factor
const hashPassword = async (password) => {
  const saltRounds = 12; // Higher = more secure but slower
  return await bcrypt.hash(password, saltRounds);
};

// Password strength validation
const validatePassword = (password) => {
  const minLength = 8;
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumbers = /\d/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
  
  if (password.length < minLength) {
    throw new Error('Password must be at least 8 characters');
  }
  
  if (!hasUpperCase || !hasLowerCase || !hasNumbers || !hasSpecialChar) {
    throw new Error('Password must contain uppercase, lowercase, number, and special character');
  }
  
  return true;
};

// Check against common passwords
const commonPasswords = ['password', '123456', 'qwerty'];
if (commonPasswords.includes(password.toLowerCase())) {
  throw new Error('Password is too common');
}
```

### JWT Security

```javascript
// Use strong secret (256-bit minimum)
const JWT_SECRET = crypto.randomBytes(32).toString('hex');

// Short expiration for access tokens
const accessToken = jwt.sign(payload, JWT_SECRET, {
  expiresIn: '15m',
  issuer: 'your-app',
  audience: 'your-app-users'
});

// Longer expiration for refresh tokens
const refreshToken = jwt.sign(
  { id: user.id },
  JWT_REFRESH_SECRET,
  { expiresIn: '7d' }
);

// Verify with all options
const verifyToken = (token) => {
  return jwt.verify(token, JWT_SECRET, {
    issuer: 'your-app',
    audience: 'your-app-users'
  });
};

// Token blacklist (for logout)
const tokenBlacklist = new Set();

const logout = async (req, res) => {
  const token = req.headers.authorization.split(' ')[1];
  tokenBlacklist.add(token);
  
  // Also store in Redis with expiration
  await redis.setex(`blacklist:${token}`, 900, '1'); // 15 minutes
  
  res.json({ message: 'Logged out' });
};

// Check blacklist in auth middleware
const authenticate = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  
  // Check blacklist
  if (await redis.exists(`blacklist:${token}`)) {
    return res.status(401).json({ error: 'Token revoked' });
  }
  
  // Verify token
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
};
```

## HTTPS & Security Headers

### Helmet.js

```javascript
const helmet = require('helmet');

// Use helmet with default settings
app.use(helmet());

// Custom configuration
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", 'data:', 'https:'],
      connectSrc: ["'self'"],
      fontSrc: ["'self'"],
      objectSrc: ["'none'"],
      mediaSrc: ["'self'"],
      frameSrc: ["'none'"]
    }
  },
  hsts: {
    maxAge: 31536000, // 1 year
    includeSubDomains: true,
    preload: true
  }
}));

// Individual security headers
app.use(helmet.noSniff()); // X-Content-Type-Options: nosniff
app.use(helmet.frameguard({ action: 'deny' })); // X-Frame-Options: DENY
app.use(helmet.xssFilter()); // X-XSS-Protection
app.use(helmet.hidePoweredBy()); // Remove X-Powered-By header
```

### HTTPS Enforcement

```javascript
// Redirect HTTP to HTTPS
app.use((req, res, next) => {
  if (req.protocol === 'http' && process.env.NODE_ENV === 'production') {
    return res.redirect(301, `https://${req.headers.host}${req.url}`);
  }
  next();
});

// HSTS header (use helmet.hsts instead)
app.use((req, res, next) => {
  res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  next();
});
```

## Rate Limiting & DDoS Protection

```javascript
const rateLimit = require('express-rate-limit');
const slowDown = require('express-slow-down');

// General rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: 'Too many requests',
  standardHeaders: true,
  legacyHeaders: false
});

app.use('/api/', limiter);

// Stricter limits for authentication endpoints
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  skipSuccessfulRequests: true,
  message: 'Too many login attempts'
});

app.post('/auth/login', authLimiter, authController.login);

// Slow down responses after threshold
const speedLimiter = slowDown({
  windowMs: 15 * 60 * 1000,
  delayAfter: 50, // Start slowing down after 50 requests
  delayMs: 500 // Add 500ms delay per request
});

app.use('/api/', speedLimiter);

// IP-based blocking
const blockedIPs = new Set();

app.use((req, res, next) => {
  if (blockedIPs.has(req.ip)) {
    return res.status(403).json({ error: 'Access denied' });
  }
  next();
});
```

## Session Security

```javascript
const session = require('express-session');
const MongoStore = require('connect-mongo');

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: process.env.MONGODB_URI,
    ttl: 24 * 60 * 60 // 1 day
  }),
  cookie: {
    httpOnly: true, // Prevent XSS
    secure: process.env.NODE_ENV === 'production', // HTTPS only
    sameSite: 'strict', // CSRF protection
    maxAge: 24 * 60 * 60 * 1000 // 1 day
  },
  name: 'sessionId' // Don't use default 'connect.sid'
}));

// Session regeneration after login (prevent session fixation)
app.post('/login', async (req, res) => {
  const user = await authenticateUser(req.body);
  
  req.session.regenerate((err) => {
    if (err) {
      return res.status(500).json({ error: 'Session error' });
    }
    
    req.session.userId = user.id;
    res.json({ user });
  });
});
```

## CSRF Protection

```javascript
const csrf = require('csurf');
const cookieParser = require('cookie-parser');

app.use(cookieParser());

// CSRF protection
const csrfProtection = csrf({ 
  cookie: {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production'
  }
});

// Provide CSRF token to client
app.get('/api/csrf-token', csrfProtection, (req, res) => {
  res.json({ csrfToken: req.csrfToken() });
});

// Protect state-changing operations
app.post('/api/users', csrfProtection, userController.create);
app.put('/api/users/:id', csrfProtection, userController.update);
app.delete('/api/users/:id', csrfProtection, userController.delete);

// For APIs, use double-submit cookie pattern
app.use((req, res, next) => {
  if (req.method !== 'GET') {
    const token = req.headers['x-csrf-token'];
    const cookieToken = req.cookies['csrf-token'];
    
    if (!token || token !== cookieToken) {
      return res.status(403).json({ error: 'Invalid CSRF token' });
    }
  }
  next();
});
```

## File Upload Security

```javascript
const multer = require('multer');
const path = require('path');

// Configure multer
const storage = multer.diskStorage({
  destination: './uploads/',
  filename: (req, file, cb) => {
    // Generate unique filename
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB max
  },
  fileFilter: (req, file, cb) => {
    // Whitelist allowed file types
    const allowedTypes = /jpeg|jpg|png|pdf/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (extname && mimetype) {
      return cb(null, true);
    }
    cb(new Error('Invalid file type'));
  }
});

// Validate file content (not just extension)
const fileType = require('file-type');

app.post('/upload', upload.single('file'), async (req, res) => {
  try {
    // Verify actual file type
    const type = await fileType.fromFile(req.file.path);
    
    if (!type || !['image/jpeg', 'image/png', 'application/pdf'].includes(type.mime)) {
      fs.unlinkSync(req.file.path); // Delete file
      return res.status(400).json({ error: 'Invalid file type' });
    }
    
    // Scan for viruses (optional)
    // await scanFile(req.file.path);
    
    res.json({ file: req.file });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
```

## Environment Variables

```javascript
// Use dotenv for local development
require('dotenv').config();

// Never commit .env files
// Add to .gitignore:
// .env
// .env.local
// .env.production

// Validate required environment variables
const requiredEnvVars = [
  'DATABASE_URL',
  'JWT_SECRET',
  'SESSION_SECRET',
  'API_KEY'
];

for (const envVar of requiredEnvVars) {
  if (!process.env[envVar]) {
    throw new Error(`Missing required environment variable: ${envVar}`);
  }
}

// Use different configs for different environments
const config = {
  development: {
    database: process.env.DEV_DATABASE_URL
  },
  production: {
    database: process.env.PROD_DATABASE_URL
  }
};

const env = process.env.NODE_ENV || 'development';
module.exports = config[env];
```

## Logging & Monitoring

```javascript
const winston = require('winston');

// Configure logger
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ 
      filename: 'error.log', 
      level: 'error' 
    }),
    new winston.transports.File({ 
      filename: 'combined.log' 
    })
  ]
});

// Don't log sensitive data
const sanitizeLog = (data) => {
  const sanitized = { ...data };
  delete sanitized.password;
  delete sanitized.token;
  delete sanitized.creditCard;
  return sanitized;
};

// Log security events
app.post('/login', async (req, res) => {
  try {
    const user = await authenticateUser(req.body);
    
    logger.info('User login', {
      userId: user.id,
      ip: req.ip,
      userAgent: req.get('user-agent')
    });
    
    res.json({ user });
  } catch (error) {
    logger.warn('Failed login attempt', {
      email: req.body.email,
      ip: req.ip,
      error: error.message
    });
    
    res.status(401).json({ error: 'Invalid credentials' });
  }
});
```

## Dependency Security

```bash
# Regular security audits
npm audit

# Fix vulnerabilities automatically
npm audit fix

# Check for outdated packages
npm outdated

# Use Snyk for continuous monitoring
npm install -g snyk
snyk test
snyk monitor

# Keep dependencies updated
npm update
```

## Security Checklist

- [ ] Use HTTPS in production
- [ ] Implement rate limiting
- [ ] Validate and sanitize all input
- [ ] Use parameterized queries
- [ ] Hash passwords with bcrypt
- [ ] Use secure session configuration
- [ ] Implement CSRF protection
- [ ] Set security headers (Helmet)
- [ ] Validate file uploads
- [ ] Keep dependencies updated
- [ ] Log security events
- [ ] Use environment variables
- [ ] Implement proper error handling
- [ ] Use Content Security Policy
- [ ] Enable CORS properly
- [ ] Implement authentication and authorization
- [ ] Regular security audits
- [ ] Use secrets management
- [ ] Implement 2FA for sensitive operations
- [ ] Monitor for suspicious activity


