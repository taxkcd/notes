# Node.js Fundamentals - Interview Guide

## Event Loop & Asynchronous Programming

### The Event Loop
Node.js uses a single-threaded event loop architecture. The event loop has multiple phases:

1. **Timers Phase**: Executes callbacks scheduled by `setTimeout()` and `setInterval()`
2. **Pending Callbacks**: Executes I/O callbacks deferred to the next loop iteration
3. **Idle, Prepare**: Internal use only
4. **Poll Phase**: Retrieves new I/O events; executes I/O related callbacks
5. **Check Phase**: `setImmediate()` callbacks are invoked here
6. **Close Callbacks**: e.g., `socket.on('close', ...)`

**Interview Question**: What's the difference between `process.nextTick()`, `setImmediate()`, and `setTimeout(fn, 0)`?

- `process.nextTick()`: Executes before any I/O events, immediately after current operation
- `setImmediate()`: Executes in the check phase of the event loop
- `setTimeout(fn, 0)`: Executes in the timers phase (minimum 1ms delay)

```javascript
setImmediate(() => console.log('setImmediate'));
process.nextTick(() => console.log('nextTick'));
setTimeout(() => console.log('setTimeout'), 0);
console.log('sync');

// Output: sync, nextTick, setTimeout, setImmediate
```

### Callbacks, Promises, and Async/Await

**Callback Pattern**:
```javascript
fs.readFile('file.txt', 'utf8', (err, data) => {
  if (err) return console.error(err);
  console.log(data);
});
```

**Callback Hell** and how to avoid it:
```javascript
// Bad - Pyramid of Doom
getData(function(a) {
  getMoreData(a, function(b) {
    getMoreData(b, function(c) {
      // ...
    });
  });
});

// Good - Using Promises
getData()
  .then(a => getMoreData(a))
  .then(b => getMoreData(b))
  .then(c => console.log(c))
  .catch(err => console.error(err));

// Better - Using Async/Await
async function fetchData() {
  try {
    const a = await getData();
    const b = await getMoreData(a);
    const c = await getMoreData(b);
    console.log(c);
  } catch (err) {
    console.error(err);
  }
}
```

**Promise States**: Pending, Fulfilled, Rejected

**Promise Methods**:
- `Promise.all()`: Wait for all promises (fails fast on first rejection)
- `Promise.allSettled()`: Wait for all promises to settle (fulfilled or rejected)
- `Promise.race()`: Returns first settled promise
- `Promise.any()`: Returns first fulfilled promise

```javascript
// Parallel execution
const [users, posts, comments] = await Promise.all([
  fetchUsers(),
  fetchPosts(),
  fetchComments()
]);

// Handle multiple operations with error tolerance
const results = await Promise.allSettled([
  fetchUsers(),
  fetchPosts(),
  fetchComments()
]);
```

## Module System

### CommonJS (CJS)
Traditional Node.js module system:

```javascript
// Exporting
module.exports = { func1, func2 };
// or
exports.func1 = func1;

// Importing
const { func1, func2 } = require('./module');
```

### ES Modules (ESM)
Modern JavaScript module system:

```javascript
// Exporting
export const func1 = () => {};
export default class MyClass {}

// Importing
import MyClass, { func1 } from './module.js';
```

**Key Differences**:
- CJS is synchronous, ESM is asynchronous
- CJS has `require`, `module.exports`; ESM has `import`, `export`
- CJS loaded at runtime, ESM parsed before execution
- ESM enables tree-shaking (dead code elimination)

**Using ESM in Node.js**:
- Add `"type": "module"` in package.json, or
- Use `.mjs` file extension

### Module Caching
Node.js caches modules after first load:

```javascript
// module.js
console.log('Module loaded');
module.exports = { value: 42 };

// app.js
require('./module'); // Logs: "Module loaded"
require('./module'); // No log, cached
```

To clear cache:
```javascript
delete require.cache[require.resolve('./module')];
```

## Streams & Buffers

### Streams
Streams are collections of data that might not be available all at once. Four types:

1. **Readable**: Sources of data (e.g., `fs.createReadStream()`)
2. **Writable**: Destinations for data (e.g., `fs.createWriteStream()`)
3. **Duplex**: Both readable and writable (e.g., TCP sockets)
4. **Transform**: Duplex streams that can modify data (e.g., zlib)

```javascript
const fs = require('fs');

// Efficient file copy using streams
const readable = fs.createReadStream('source.txt');
const writable = fs.createWriteStream('destination.txt');

readable.pipe(writable);

// With error handling
readable
  .on('error', err => console.error('Read error:', err))
  .pipe(writable)
  .on('error', err => console.error('Write error:', err))
  .on('finish', () => console.log('Copy complete'));
```

**Why use streams?**
- Memory efficient: Process data in chunks
- Time efficient: Start processing before all data arrives

**Stream Events**:
- Readable: `data`, `end`, `error`, `readable`
- Writable: `drain`, `finish`, `error`, `pipe`

### Buffers
Binary data containers in Node.js:

```javascript
// Creating buffers
const buf1 = Buffer.from('Hello', 'utf8');
const buf2 = Buffer.alloc(10); // Filled with zeros
const buf3 = Buffer.allocUnsafe(10); // Faster but uninitialized

// Reading and writing
buf2.write('Hello');
console.log(buf2.toString()); // 'Hello'

// Concatenating
const buf4 = Buffer.concat([buf1, buf2]);

// Buffer vs String
// Buffers are fixed size, better for binary data
// Strings are for text, use encoding
```

## Error Handling

### Error Types

1. **Operational Errors**: Runtime problems (network issues, invalid input)
2. **Programmer Errors**: Bugs in code (undefined variable, type errors)

### Error Handling Patterns

**Callback Pattern**:
```javascript
function readData(callback) {
  fs.readFile('file.txt', (err, data) => {
    if (err) return callback(err);
    callback(null, data);
  });
}
```

**Promise Pattern**:
```javascript
function readData() {
  return fs.promises.readFile('file.txt')
    .catch(err => {
      console.error('Error:', err);
      throw err;
    });
}
```

**Async/Await Pattern**:
```javascript
async function readData() {
  try {
    const data = await fs.promises.readFile('file.txt');
    return data;
  } catch (err) {
    console.error('Error:', err);
    throw err;
  }
}
```

### Global Error Handlers

```javascript
// Uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
  process.exit(1); // Exit after cleanup
});

// Unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server');
  server.close(() => {
    console.log('HTTP server closed');
  });
});
```

### Custom Error Classes

```javascript
class ValidationError extends Error {
  constructor(message) {
    super(message);
    this.name = 'ValidationError';
    this.statusCode = 400;
  }
}

class DatabaseError extends Error {
  constructor(message) {
    super(message);
    this.name = 'DatabaseError';
    this.statusCode = 500;
  }
}

// Usage
function validateUser(user) {
  if (!user.email) {
    throw new ValidationError('Email is required');
  }
}
```

## Core Modules

### fs (File System)

```javascript
const fs = require('fs');
const fsPromises = require('fs').promises;

// Synchronous (blocks event loop)
const data = fs.readFileSync('file.txt', 'utf8');

// Asynchronous (callback)
fs.readFile('file.txt', 'utf8', (err, data) => {
  if (err) throw err;
  console.log(data);
});

// Asynchronous (promises)
const data = await fsPromises.readFile('file.txt', 'utf8');

// Common operations
await fsPromises.writeFile('file.txt', 'content');
await fsPromises.appendFile('file.txt', 'more content');
await fsPromises.unlink('file.txt'); // Delete
await fsPromises.mkdir('directory', { recursive: true });
const files = await fsPromises.readdir('directory');

// Check if file exists
const exists = await fsPromises.access('file.txt')
  .then(() => true)
  .catch(() => false);
```

### path

```javascript
const path = require('path');

path.join('/users', 'john', 'documents'); // /users/john/documents
path.resolve('file.txt'); // Absolute path
path.basename('/users/john/file.txt'); // file.txt
path.dirname('/users/john/file.txt'); // /users/john
path.extname('file.txt'); // .txt
path.parse('/users/john/file.txt');
// { root: '/', dir: '/users/john', base: 'file.txt', ext: '.txt', name: 'file' }
```

### http/https

```javascript
const http = require('http');

const server = http.createServer((req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify({ message: 'Hello World' }));
});

server.listen(3000, () => {
  console.log('Server running on port 3000');
});
```

### util

```javascript
const util = require('util');

// Promisify callback-based functions
const readFile = util.promisify(fs.readFile);
const data = await readFile('file.txt', 'utf8');

// Inspect objects
console.log(util.inspect(obj, { depth: null, colors: true }));
```

## Process & Environment

### process Object

```javascript
// Environment variables
const dbUrl = process.env.DATABASE_URL;

// Command line arguments
console.log(process.argv);
// ['node', '/path/to/script.js', 'arg1', 'arg2']

// Current working directory
console.log(process.cwd());

// Change directory
process.chdir('/new/path');

// Memory usage
console.log(process.memoryUsage());

// CPU usage
console.log(process.cpuUsage());

// Exit
process.exit(0); // Success
process.exit(1); // Failure
```

### Environment Variables

```javascript
// Using dotenv
require('dotenv').config();

const config = {
  port: process.env.PORT || 3000,
  dbUrl: process.env.DATABASE_URL,
  nodeEnv: process.env.NODE_ENV || 'development'
};

// Different configs for environments
if (process.env.NODE_ENV === 'production') {
  // Production config
} else {
  // Development config
}
```

## NPM & Package Management

### package.json Essentials

```json
{
  "name": "my-app",
  "version": "1.0.0",
  "main": "index.js",
  "scripts": {
    "start": "node index.js",
    "dev": "nodemon index.js",
    "test": "jest"
  },
  "dependencies": {
    "express": "^4.18.0"
  },
  "devDependencies": {
    "nodemon": "^2.0.0"
  },
  "engines": {
    "node": ">=18.0.0"
  }
}
```

### Semantic Versioning (SemVer)

Format: `MAJOR.MINOR.PATCH`

- `^1.2.3`: Compatible with 1.x.x (>= 1.2.3, < 2.0.0)
- `~1.2.3`: Compatible with 1.2.x (>= 1.2.3, < 1.3.0)
- `1.2.3`: Exact version
- `*` or `latest`: Any version

### package-lock.json

Locks exact versions of all dependencies for consistent installations across environments.

### Common NPM Commands

```bash
npm install express          # Install dependency
npm install --save-dev jest  # Install dev dependency
npm install -g nodemon       # Install globally
npm uninstall express        # Remove dependency
npm update                   # Update all packages
npm outdated                 # Check for outdated packages
npm audit                    # Security audit
npm audit fix                # Auto-fix vulnerabilities
npm ci                       # Clean install from lock file
```

## Child Processes

Node.js can spawn child processes to run other programs:

```javascript
const { exec, execFile, spawn, fork } = require('child_process');

// exec: Buffer output, run shell command
exec('ls -la', (err, stdout, stderr) => {
  if (err) return console.error(err);
  console.log(stdout);
});

// spawn: Stream output, more efficient for large outputs
const ls = spawn('ls', ['-la']);
ls.stdout.on('data', data => console.log(data.toString()));
ls.stderr.on('data', data => console.error(data.toString()));
ls.on('close', code => console.log(`Exit code: ${code}`));

// fork: Special case for running Node.js scripts
const child = fork('child.js');
child.send({ message: 'Hello' });
child.on('message', msg => console.log('From child:', msg));

// In child.js
process.on('message', msg => {
  console.log('From parent:', msg);
  process.send({ response: 'Hi' });
});
```

**When to use each**:
- `exec`: Simple commands with small output
- `spawn`: Long-running processes or large output
- `fork`: Communication between Node.js processes