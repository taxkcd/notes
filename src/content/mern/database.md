# Database & Active Record - Interview Guide

## ORM/ODM Patterns

### Sequelize (SQL Databases)

**Setup and Connection**:
```javascript
const { Sequelize, DataTypes } = require('sequelize');

const sequelize = new Sequelize('database', 'username', 'password', {
  host: 'localhost',
  dialect: 'postgres',
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  },
  logging: false // Disable SQL logging
});

// Test connection
await sequelize.authenticate();
```

**Model Definition**:
```javascript
const User = sequelize.define('User', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true
    }
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  },
  role: {
    type: DataTypes.ENUM('user', 'admin'),
    defaultValue: 'user'
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
}, {
  timestamps: true, // createdAt, updatedAt
  paranoid: true, // Soft deletes (deletedAt)
  hooks: {
    beforeCreate: async (user) => {
      user.password = await bcrypt.hash(user.password, 10);
    }
  }
});
```

**Associations**:
```javascript
// One-to-Many
User.hasMany(Post, { foreignKey: 'userId', as: 'posts' });
Post.belongsTo(User, { foreignKey: 'userId', as: 'author' });

// Many-to-Many
User.belongsToMany(Role, { through: 'UserRoles' });
Role.belongsToMany(User, { through: 'UserRoles' });

// One-to-One
User.hasOne(Profile, { foreignKey: 'userId' });
Profile.belongsTo(User, { foreignKey: 'userId' });
```

**CRUD Operations**:
```javascript
// Create
const user = await User.create({
  email: 'user@example.com',
  password: 'password123'
});

// Bulk create
await User.bulkCreate([
  { email: 'user1@example.com', password: 'pass1' },
  { email: 'user2@example.com', password: 'pass2' }
]);

// Read
const user = await User.findByPk(1);
const user = await User.findOne({ where: { email: 'user@example.com' } });
const users = await User.findAll({ where: { isActive: true } });

// Update
await user.update({ isActive: false });
// or
await User.update(
  { isActive: false },
  { where: { id: 1 } }
);

// Delete
await user.destroy(); // Soft delete if paranoid: true
await User.destroy({ where: { id: 1 }, force: true }); // Hard delete
```

**Advanced Queries**:
```javascript
const { Op } = require('sequelize');

// Operators
const users = await User.findAll({
  where: {
    age: { [Op.gte]: 18 },
    email: { [Op.like]: '%@gmail.com' },
    role: { [Op.in]: ['admin', 'moderator'] },
    [Op.and]: [
      { isActive: true },
      { createdAt: { [Op.gte]: new Date('2024-01-01') } }
    ]
  }
});

// Pagination
const { count, rows } = await User.findAndCountAll({
  limit: 10,
  offset: 20,
  order: [['createdAt', 'DESC']]
});

// Include associations
const users = await User.findAll({
  include: [
    {
      model: Post,
      as: 'posts',
      where: { published: true },
      required: false // LEFT JOIN
    }
  ]
});

// Aggregation
const result = await User.findAll({
  attributes: [
    'role',
    [sequelize.fn('COUNT', sequelize.col('id')), 'count']
  ],
  group: ['role']
});

// Raw queries
const [results, metadata] = await sequelize.query(
  'SELECT * FROM users WHERE email = ?',
  {
    replacements: ['user@example.com'],
    type: sequelize.QueryTypes.SELECT
  }
);
```

**Transactions**:
```javascript
// Managed transaction
await sequelize.transaction(async (t) => {
  const user = await User.create({
    email: 'user@example.com'
  }, { transaction: t });
  
  await Post.create({
    userId: user.id,
    title: 'First Post'
  }, { transaction: t });
  
  // If error occurs, everything rolls back
});

// Unmanaged transaction
const t = await sequelize.transaction();
try {
  const user = await User.create({ email: 'user@example.com' }, { transaction: t });
  await Post.create({ userId: user.id }, { transaction: t });
  await t.commit();
} catch (error) {
  await t.rollback();
  throw error;
}
```

### Mongoose (MongoDB)

**Connection**:
```javascript
const mongoose = require('mongoose');

await mongoose.connect('mongodb://localhost:27017/mydb', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

mongoose.connection.on('error', err => console.error(err));
mongoose.connection.once('open', () => console.log('Connected to MongoDB'));
```

**Schema Definition**:
```javascript
const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    validate: {
      validator: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v),
      message: 'Invalid email format'
    }
  },
  password: {
    type: String,
    required: true,
    minlength: 8
  },
  profile: {
    firstName: String,
    lastName: String,
    age: {
      type: Number,
      min: 0,
      max: 120
    }
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  tags: [String],
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtuals
userSchema.virtual('fullName').get(function() {
  return `${this.profile.firstName} ${this.profile.lastName}`;
});

// Indexes
userSchema.index({ email: 1 });
userSchema.index({ 'profile.firstName': 1, 'profile.lastName': 1 });

// Middleware (Hooks)
userSchema.pre('save', async function(next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

userSchema.post('save', function(doc) {
  console.log('User saved:', doc._id);
});

// Methods
userSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// Statics
userSchema.statics.findByEmail = function(email) {
  return this.findOne({ email });
};

const User = mongoose.model('User', userSchema);
```

**CRUD Operations**:
```javascript
// Create
const user = await User.create({
  email: 'user@example.com',
  password: 'password123',
  profile: { firstName: 'John', lastName: 'Doe' }
});

// Read
const user = await User.findById(id);
const user = await User.findOne({ email: 'user@example.com' });
const users = await User.find({ role: 'admin' });

// Update
await User.findByIdAndUpdate(id, { role: 'admin' }, { new: true });
await User.updateOne({ _id: id }, { $set: { role: 'admin' } });
await User.updateMany({ role: 'user' }, { $set: { isActive: true } });

// Delete
await User.findByIdAndDelete(id);
await User.deleteOne({ _id: id });
await User.deleteMany({ isActive: false });
```

**Advanced Queries**:
```javascript
// Query operators
const users = await User.find({
  age: { $gte: 18, $lte: 65 },
  email: { $regex: /@gmail\.com$/ },
  role: { $in: ['admin', 'moderator'] },
  $or: [
    { 'profile.firstName': 'John' },
    { 'profile.lastName': 'Doe' }
  ]
});

// Pagination and sorting
const users = await User.find()
  .skip(20)
  .limit(10)
  .sort({ createdAt: -1 })
  .select('email profile.firstName profile.lastName');

// Population (similar to joins)
const postSchema = new mongoose.Schema({
  title: String,
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
});

const Post = mongoose.model('Post', postSchema);

const posts = await Post.find()
  .populate('author', 'email profile.firstName')
  .exec();

// Aggregation
const result = await User.aggregate([
  { $match: { isActive: true } },
  { $group: {
    _id: '$role',
    count: { $sum: 1 },
    avgAge: { $avg: '$profile.age' }
  }},
  { $sort: { count: -1 } }
]);
```

**Transactions (MongoDB 4.0+)**:
```javascript
const session = await mongoose.startSession();
session.startTransaction();

try {
  const user = await User.create([{
    email: 'user@example.com'
  }], { session });
  
  await Post.create([{
    author: user[0]._id,
    title: 'First Post'
  }], { session });
  
  await session.commitTransaction();
} catch (error) {
  await session.abortTransaction();
  throw error;
} finally {
  session.endSession();
}
```

## Raw SQL Queries

### Using pg (PostgreSQL)

```javascript
const { Pool } = require('pg');

const pool = new Pool({
  user: 'username',
  host: 'localhost',
  database: 'mydb',
  password: 'password',
  port: 5432,
  max: 20, // Max clients in pool
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000
});

// Simple query
const result = await pool.query('SELECT * FROM users WHERE id = $1', [userId]);
const user = result.rows[0];

// Parameterized queries (prevents SQL injection)
const result = await pool.query(
  'INSERT INTO users(email, password) VALUES($1, $2) RETURNING *',
  [email, hashedPassword]
);

// Transaction
const client = await pool.connect();
try {
  await client.query('BEGIN');
  const user = await client.query('INSERT INTO users(email) VALUES($1) RETURNING *', [email]);
  await client.query('INSERT INTO profiles(user_id, name) VALUES($1, $2)', [user.rows[0].id, name]);
  await client.query('COMMIT');
} catch (e) {
  await client.query('ROLLBACK');
  throw e;
} finally {
  client.release();
}

// Prepared statements (performance optimization)
const query = {
  name: 'fetch-user',
  text: 'SELECT * FROM users WHERE id = $1',
  values: [userId]
};
const result = await pool.query(query);
```

### Query Optimization

**Indexing**:
```sql
-- Single column index
CREATE INDEX idx_users_email ON users(email);

-- Composite index
CREATE INDEX idx_users_name ON users(first_name, last_name);

-- Unique index
CREATE UNIQUE INDEX idx_users_email_unique ON users(email);

-- Partial index
CREATE INDEX idx_active_users ON users(email) WHERE is_active = true;

-- Full-text search index
CREATE INDEX idx_posts_search ON posts USING gin(to_tsvector('english', content));
```

**EXPLAIN and ANALYZE**:
```javascript
const result = await pool.query('EXPLAIN ANALYZE SELECT * FROM users WHERE email = $1', [email]);
console.log(result.rows);
```

**N+1 Query Problem**:
```javascript
// Bad - N+1 queries
const users = await User.findAll();
for (const user of users) {
  const posts = await Post.findAll({ where: { userId: user.id } });
  user.posts = posts;
}

// Good - Single query with join
const users = await User.findAll({
  include: [{ model: Post, as: 'posts' }]
});

// Alternative - Two queries with IN clause
const users = await User.findAll();
const userIds = users.map(u => u.id);
const posts = await Post.findAll({ where: { userId: userIds } });
// Group posts by userId
```

## Database Migrations

### Sequelize Migrations

```bash
npx sequelize-cli migration:generate --name create-users-table
```

```javascript
// migrations/20240101000000-create-users-table.js
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('users', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
      },
      password: {
        type: Sequelize.STRING,
        allowNull: false
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false
      }
    });
    
    await queryInterface.addIndex('users', ['email']);
  },
  
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('users');
  }
};

// Add column migration
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('users', 'role', {
      type: Sequelize.STRING,
      defaultValue: 'user'
    });
  },
  
  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('users', 'role');
  }
};
```

**Running migrations**:
```bash
npx sequelize-cli db:migrate
npx sequelize-cli db:migrate:undo
npx sequelize-cli db:migrate:undo:all
```

### Database Seeders

```javascript
// seeders/20240101000000-demo-users.js
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('users', [
      {
        email: 'admin@example.com',
        password: 'hashedpassword',
        role: 'admin',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        email: 'user@example.com',
        password: 'hashedpassword',
        role: 'user',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);
  },
  
  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('users', null, {});
  }
};
```

## Connection Pooling

Connection pooling reuses database connections to improve performance:

```javascript
// PostgreSQL
const pool = new Pool({
  max: 20, // Maximum connections in pool
  min: 5, // Minimum connections
  idleTimeoutMillis: 30000, // Close idle connections after 30s
  connectionTimeoutMillis: 2000, // Timeout when acquiring connection
});

// MySQL
const mysql = require('mysql2/promise');
const pool = mysql.createPool({
  host: 'localhost',
  user: 'user',
  password: 'password',
  database: 'mydb',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// MongoDB connection pooling is built-in
await mongoose.connect('mongodb://localhost:27017/mydb', {
  maxPoolSize: 10,
  minPoolSize: 5
});
```

**Best Practices**:
- Set appropriate pool size based on application load
- Monitor pool usage and adjust as needed
- Always release connections back to pool
- Handle connection errors gracefully
- Use connection pools for all database operations

## Query Builders

### Knex.js

```javascript
const knex = require('knex')({
  client: 'pg',
  connection: {
    host: 'localhost',
    user: 'user',
    password: 'password',
    database: 'mydb'
  }
});

// Select
const users = await knex('users')
  .select('*')
  .where('is_active', true)
  .andWhere('age', '>=', 18)
  .orderBy('created_at', 'desc')
  .limit(10);

// Insert
const [id] = await knex('users')
  .insert({ email: 'user@example.com', password: 'hash' })
  .returning('id');

// Update
await knex('users')
  .where({ id: use



  