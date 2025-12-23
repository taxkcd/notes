# Authentication & Authorization - Interview Guide

## JWT (JSON Web Tokens)

### JWT Basics

A JWT consists of three parts: Header, Payload, Signature

```javascript
// Structure: header.payload.signature
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c
```

### Implementation

```javascript
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

// Sign token
const generateToken = (user) => {
  const payload = {
    id: user.id,
    email: user.email,
    role: user.role
  };
  
  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: '7d', // Token expires in 7 days
    issuer: 'your-app-name',
    audience: 'your-app-users'
  });
};

// Refresh token (longer expiration)
const generateRefreshToken = (user) => {
  return jwt.sign(
    { id: user.id },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: '30d' }
  );
};

// Verify token
const verifyToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      throw new Error('Token expired');
    }
    if (error.name === 'JsonWebTokenError') {
      throw new Error('Invalid token');
    }
    throw error;
  }
};

// Login
const login = async (req, res) => {
  const { email, password } = req.body;
  
  // Find user
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }
  
  // Verify password
  const isValidPassword = await bcrypt.compare(password, user.password);
  if (!isValidPassword) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }
  
  // Generate tokens
  const accessToken = generateToken(user);
  const refreshToken = generateRefreshToken(user);
  
  // Store refresh token in database
  user.refreshToken = refreshToken;
  await user.save();
  
  res.json({
    accessToken,
    refreshToken,
    user: {
      id: user.id,
      email: user.email,
      name: user.name
    }
  });
};

// Refresh access token
const refreshAccessToken = async (req, res) => {
  const { refreshToken } = req.body;
  
  if (!refreshToken) {
    return res.status(401).json({ error: 'Refresh token required' });
  }
  
  try {
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    const user = await User.findById(decoded.id);
    
    if (!user || user.refreshToken !== refreshToken) {
      return res.status(403).json({ error: 'Invalid refresh token' });
    }
    
    const newAccessToken = generateToken(user);
    res.json({ accessToken: newAccessToken });
  } catch (error) {
    res.status(403).json({ error: 'Invalid refresh token' });
  }
};
```

### Authentication Middleware

```javascript
// middleware/authenticate.js
const jwt = require('jsonwebtoken');

const authenticate = async (req, res, next) => {
  try {
    // Get token from header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'No token provided' });
    }
    
    const token = authHeader.substring(7); // Remove 'Bearer '
    
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Get user from database
    const user = await User.findById(decoded.id).select('-password');
    if (!user) {
      return res.status(401).json({ error: 'Invalid token' });
    }
    
    // Attach user to request
    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Token expired' });
    }
    res.status(401).json({ error: 'Invalid token' });
  }
};

module.exports = authenticate;

// Usage
app.get('/profile', authenticate, (req, res) => {
  res.json({ user: req.user });
});
```

## Session-based Authentication

```javascript
const session = require('express-session');
const MongoStore = require('connect-mongo');

// Session configuration
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: process.env.MONGODB_URI,
    ttl: 24 * 60 * 60 // 1 day
  }),
  cookie: {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production', // HTTPS only in production
    maxAge: 24 * 60 * 60 * 1000, // 1 day
    sameSite: 'strict'
  }
}));

// Login
const login = async (req, res) => {
  const { email, password } = req.body;
  
  const user = await User.findOne({ email });
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }
  
  // Store user ID in session
  req.session.userId = user.id;
  req.session.save((err) => {
    if (err) {
      return res.status(500).json({ error: 'Session save failed' });
    }
    res.json({ user: { id: user.id, email: user.email } });
  });
};

// Logout
const logout = (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ error: 'Logout failed' });
    }
    res.clearCookie('connect.sid');
    res.json({ message: 'Logged out successfully' });
  });
};

// Session authentication middleware
const authenticateSession = async (req, res, next) => {
  if (!req.session.userId) {
    return res.status(401).json({ error: 'Not authenticated' });
  }
  
  const user = await User.findById(req.session.userId).select('-password');
  if (!user) {
    return res.status(401).json({ error: 'User not found' });
  }
  
  req.user = user;
  next();
};
```

## Password Hashing

```javascript
const bcrypt = require('bcrypt');

// Hash password
const hashPassword = async (password) => {
  const saltRounds = 10;
  return await bcrypt.hash(password, saltRounds);
};

// Compare password
const comparePassword = async (password, hash) => {
  return await bcrypt.compare(password, hash);
};

// In User model
userSchema.pre('save', async function(next) {
  // Only hash if password is modified
  if (!this.isModified('password')) {
    return next();
  }
  
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// Add method to compare passwords
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};
```

## OAuth 2.0

### Google OAuth

```javascript
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: '/auth/google/callback'
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      // Check if user exists
      let user = await User.findOne({ googleId: profile.id });
      
      if (!user) {
        // Create new user
        user = await User.create({
          googleId: profile.id,
          email: profile.emails[0].value,
          name: profile.displayName,
          picture: profile.photos[0].value
        });
      }
      
      return done(null, user);
    } catch (error) {
      return done(error, null);
    }
  }
));

// Serialize user
passport.serializeUser((user, done) => {
  done(null, user.id);
});

// Deserialize user
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

// Routes
app.get('/auth/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

app.get('/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/login' }),
  (req, res) => {
    // Generate JWT for the user
    const token = generateToken(req.user);
    res.redirect(`/dashboard?token=${token}`);
  }
);
```

### Microsoft OAuth

```javascript
const MicrosoftStrategy = require('passport-microsoft').Strategy;

passport.use(new MicrosoftStrategy({
    clientID: process.env.MICROSOFT_CLIENT_ID,
    clientSecret: process.env.MICROSOFT_CLIENT_SECRET,
    callbackURL: '/auth/microsoft/callback',
    scope: ['user.read']
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      let user = await User.findOne({ microsoftId: profile.id });
      
      if (!user) {
        user = await User.create({
          microsoftId: profile.id,
          email: profile.emails[0].value,
          name: profile.displayName
        });
      }
      
      return done(null, user);
    } catch (error) {
      return done(error, null);
    }
  }
));

app.get('/auth/microsoft',
  passport.authenticate('microsoft', { 
    prompt: 'select_account'
  })
);

app.get('/auth/microsoft/callback',
  passport.authenticate('microsoft', { failureRedirect: '/login' }),
  (req, res) => {
    const token = generateToken(req.user);
    res.redirect(`/dashboard?token=${token}`);
  }
);
```

## Two-Factor Authentication (2FA)

### TOTP (Time-based One-Time Password)

```javascript
const speakeasy = require('speakeasy');
const QRCode = require('qrcode');

// Generate secret
const enable2FA = async (req, res) => {
  const secret = speakeasy.generateSecret({
    name: `YourApp (${req.user.email})`,
    length: 32
  });
  
  // Save secret to user (temporary until verified)
  req.user.twoFactorTempSecret = secret.base32;
  await req.user.save();
  
  // Generate QR code
  const qrCodeUrl = await QRCode.toDataURL(secret.otpauth_url);
  
  res.json({
    secret: secret.base32,
    qrCode: qrCodeUrl
  });
};

// Verify and enable 2FA
const verify2FA = async (req, res) => {
  const { token } = req.body;
  
  const verified = speakeasy.totp.verify({
    secret: req.user.twoFactorTempSecret,
    encoding: 'base32',
    token: token,
    window: 2 // Allow 2 time steps before/after
  });
  
  if (!verified) {
    return res.status(400).json({ error: 'Invalid token' });
  }
  
  // Enable 2FA
  req.user.twoFactorSecret = req.user.twoFactorTempSecret;
  req.user.twoFactorEnabled = true;
  req.user.twoFactorTempSecret = undefined;
  await req.user.save();
  
  res.json({ message: '2FA enabled successfully' });
};

// Verify 2FA during login
const verify2FALogin = async (req, res) => {
  const { userId, token } = req.body;
  
  const user = await User.findById(userId);
  
  if (!user || !user.twoFactorEnabled) {
    return res.status(400).json({ error: 'Invalid request' });
  }
  
  const verified = speakeasy.totp.verify({
    secret: user.twoFactorSecret,
    encoding: 'base32',
    token: token,
    window: 2
  });
  
  if (!verified) {
    return res.status(401).json({ error: 'Invalid token' });
  }
  
  // Generate JWT
  const accessToken = generateToken(user);
  res.json({ accessToken });
};

// Disable 2FA
const disable2FA = async (req, res) => {
  const { token } = req.body;
  
  const verified = speakeasy.totp.verify({
    secret: req.user.twoFactorSecret,
    encoding: 'base32',
    token: token
  });
  
  if (!verified) {
    return res.status(400).json({ error: 'Invalid token' });
  }
  
  req.user.twoFactorSecret = undefined;
  req.user.twoFactorEnabled = false;
  await req.user.save();
  
  res.json({ message: '2FA disabled successfully' });
};
```

### SMS-based 2FA

```javascript
const twilio = require('twilio');
const client = twilio(process.env.TWILIO_SID, process.env.TWILIO_AUTH_TOKEN);

// Send verification code
const send2FACode = async (req, res) => {
  const code = Math.floor(100000 + Math.random() * 900000).toString();
  
  // Store code with expiration (5 minutes)
  req.user.twoFactorCode = code;
  req.user.twoFactorCodeExpires = Date.now() + 5 * 60 * 1000;
  await req.user.save();
  
  // Send SMS
  await client.messages.create({
    body: `Your verification code is: ${code}`,
    from: process.env.TWILIO_PHONE_NUMBER,
    to: req.user.phoneNumber
  });
  
  res.json({ message: 'Verification code sent' });
};

// Verify code
const verify2FACode = async (req, res) => {
  const { code } = req.body;
  
  if (!req.user.twoFactorCode || Date.now() > req.user.twoFactorCodeExpires) {
    return res.status(400).json({ error: 'Code expired' });
  }
  
  if (req.user.twoFactorCode !== code) {
    return res.status(400).json({ error: 'Invalid code' });
  }
  
  // Clear code
  req.user.twoFactorCode = undefined;
  req.user.twoFactorCodeExpires = undefined;
  await req.user.save();
  
  const accessToken = generateToken(req.user);
  res.json({ accessToken });
};
```

## Authorization (RBAC)

### Role-Based Access Control

```javascript
// User model with roles
const userSchema = new mongoose.Schema({
  email: String,
  password: String,
  role: {
    type: String,
    enum: ['user', 'admin', 'moderator'],
    default: 'user'
  },
  permissions: [{
    type: String,
    enum: ['read', 'write', 'delete', 'manage_users']
  }]
});

// Authorization middleware
const authorize = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Not authenticated' });
    }
    
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Insufficient permissions' });
    }
    
    next();
  };
};

// Permission-based authorization
const requirePermission = (...requiredPermissions) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Not authenticated' });
    }
    
    const hasPermission = requiredPermissions.every(permission =>
      req.user.permissions.includes(permission)
    );
    
    if (!hasPermission) {
      return res.status(403).json({ error: 'Insufficient permissions' });
    }
    
    next();
  };
};

// Usage
app.delete('/users/:id', authenticate, authorize('admin'), userController.delete);
app.post('/posts', authenticate, requirePermission('write'), postController.create);
app.delete('/posts/:id', authenticate, requirePermission('write', 'delete'), postController.delete);
```

### Resource-based Authorization

```javascript
// Check if user owns the resource
const checkOwnership = (model) => {
  return async (req, res, next) => {
    try {
      const resource = await model.findById(req.params.id);
      
      if (!resource) {
        return res.status(404).json({ error: 'Resource not found' });
      }
      
      // Check if user is owner or admin
      if (resource.userId.toString() !== req.user.id && req.user.role !== 'admin') {
        return res.status(403).json({ error: 'Access denied' });
      }
      
      req.resource = resource;
      next();
    } catch (error) {
      next(error);
    }
  };
};

// Usage
app.put('/posts/:id', authenticate, checkOwnership(Post), postController.update);
app.delete('/posts/:id', authenticate, checkOwnership(Post), postController.delete);
```

## Password Reset

```javascript
const crypto = require('crypto');
const nodemailer = require('nodemailer');

// Request password reset
const requestPasswordReset = async (req, res) => {
  const { email } = req.body;
  
  const user = await User.findOne({ email });
  if (!user) {
    // Don't reveal if user exists
    return res.json({ message: 'If email exists, reset link sent' });
  }
  
  // Generate reset token
  const resetToken = crypto.randomBytes(32).toString('hex');
  const resetTokenHash = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');
  
  user.passwordResetToken = resetTokenHash;
  user.passwordResetExpires = Date.now() + 60 * 60 * 1000; // 1 hour
  await user.save();
  
  // Send email
  const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;
  
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    }
  });
  
  await transporter.sendMail({
    from: 'noreply@yourapp.com',
    to: user.email,
    subject: 'Password Reset',
    html: `
      <p>You requested a password reset.</p>
      <p>Click <a href="${resetUrl}">here</a> to reset your password.</p>
      <p>This link expires in 1 hour.</p>
    `
  });
  
  res.json({ message: 'If email exists, reset link sent' });
};

// Reset password
const resetPassword = async (req, res) => {
  const { token, newPassword } = req.body;
  
  const resetTokenHash = crypto
    .createHash('sha256')
    .update(token)
    .digest('hex');
  
  const user = await User.findOne({
    passwordResetToken: resetTokenHash,
    passwordResetExpires: { $gt: Date.now() }
  });
  
  if (!user) {
    return res.status(400).json({ error: 'Invalid or expired token' });
  }
  
  // Update password
  user.password = newPassword; // Will be hashed by pre-save hook
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();
  
  res.json({ message: 'Password reset successful' });
};
```