# Background Jobs & Async Processing - Interview Guide

## Bull Queue (Redis-based)

### Basic Setup

```javascript
const Queue = require('bull');
const redis = require('redis');

// Create queue
const emailQueue = new Queue('email', {
  redis: {
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
    password: process.env.REDIS_PASSWORD
  }
});

// Add job to queue
const sendEmail = async (to, subject, body) => {
  const job = await emailQueue.add('send-email', {
    to,
    subject,
    body
  }, {
    attempts: 3, // Retry 3 times on failure
    backoff: {
      type: 'exponential',
      delay: 2000 // Start with 2 seconds, then 4, 8, etc.
    },
    removeOnComplete: true, // Remove job when completed
    removeOnFail: false // Keep failed jobs for debugging
  });
  
  return job.id;
};

// Process jobs
emailQueue.process('send-email', async (job) => {
  const { to, subject, body } = job.data;
  
  // Update progress
  job.progress(10);
  
  // Send email logic
  await transporter.sendMail({
    from: 'noreply@app.com',
    to,
    subject,
    html: body
  });
  
  job.progress(100);
  
  return { sent: true, to };
});

// Event listeners
emailQueue.on('completed', (job, result) => {
  console.log(`Job ${job.id} completed:`, result);
});

emailQueue.on('failed', (job, err) => {
  console.error(`Job ${job.id} failed:`, err.message);
});

emailQueue.on('progress', (job, progress) => {
  console.log(`Job ${job.id} progress: ${progress}%`);
});

emailQueue.on('stalled', (job) => {
  console.warn(`Job ${job.id} stalled`);
});
```

### Advanced Job Options

```javascript
// Delayed jobs
await queue.add('task', data, {
  delay: 60000 // Delay 1 minute
});

// Scheduled jobs (cron-like)
await queue.add('report', data, {
  repeat: {
    cron: '0 9 * * *' // Every day at 9 AM
  }
});

// Job priority
await queue.add('urgent-task', data, {
  priority: 1 // Lower number = higher priority
});

// Job timeout
await queue.add('task', data, {
  timeout: 30000 // Fail if not completed in 30 seconds
});

// Rate limiting
await queue.add('api-call', data, {
  limiter: {
    max: 100, // Max 100 jobs
    duration: 60000 // Per 60 seconds
  }
});

// Job dependencies (wait for other job)
const job1 = await queue.add('task1', data1);
await queue.add('task2', data2, {
  delay: 1000,
  jobId: `task2-after-${job1.id}`
});
```

### Queue Management

```javascript
// Get job by ID
const job = await queue.getJob(jobId);

// Get job state
const state = await job.getState(); // 'completed', 'failed', 'delayed', etc.

// Retry failed job
await job.retry();

// Remove job
await job.remove();

// Get queue counts
const counts = await queue.getJobCounts();
console.log(counts); // { waiting: 5, active: 2, completed: 100, failed: 3 }

// Clean old jobs
await queue.clean(24 * 60 * 60 * 1000); // Remove jobs older than 1 day
await queue.clean(0, 'completed'); // Remove all completed jobs
await queue.clean(0, 'failed'); // Remove all failed jobs

// Pause queue
await queue.pause();

// Resume queue
await queue.resume();

// Empty queue (remove all jobs)
await queue.empty();

// Close queue
await queue.close();
```

### Multiple Processors

```javascript
// Process different job types
queue.process('send-email', async (job) => {
  // Email processing
});

queue.process('generate-report', async (job) => {
  // Report generation
});

// Concurrent processing
queue.process('send-email', 5, async (job) => {
  // Process up to 5 jobs concurrently
});

// Named processors with different concurrency
queue.process('high-priority', 10, async (job) => {
  // High priority tasks
});

queue.process('low-priority', 2, async (job) => {
  // Low priority tasks
});
```

## BullMQ (Modern version of Bull)

```javascript
const { Queue, Worker, QueueScheduler } = require('bullmq');

// Create queue
const myQueue = new Queue('myqueue', {
  connection: {
    host: 'localhost',
    port: 6379
  }
});

// Queue Scheduler (required for delayed jobs)
const scheduler = new QueueScheduler('myqueue', {
  connection: {
    host: 'localhost',
    port: 6379
  }
});

// Create worker
const worker = new Worker('myqueue', async (job) => {
  // Process job
  console.log('Processing:', job.data);
  return { processed: true };
}, {
  connection: {
    host: 'localhost',
    port: 6379
  },
  concurrency: 5
});

// Worker events
worker.on('completed', (job, result) => {
  console.log(`Job ${job.id} completed:`, result);
});

worker.on('failed', (job, err) => {
  console.error(`Job ${job.id} failed:`, err);
});

// Add job
await myQueue.add('task-name', {
  foo: 'bar'
}, {
  removeOnComplete: true,
  removeOnFail: 1000 // Keep last 1000 failed jobs
});
```

## Agenda (MongoDB-based)

```javascript
const Agenda = require('agenda');

const agenda = new Agenda({
  db: { address: process.env.MONGODB_URI, collection: 'jobs' },
  processEvery: '1 minute',
  maxConcurrency: 20
});

// Define jobs
agenda.define('send-email', async (job) => {
  const { to, subject, body } = job.attrs.data;
  await sendEmail(to, subject, body);
});

agenda.define('generate-report', { priority: 'high', concurrency: 5 }, async (job) => {
  const { userId } = job.attrs.data;
  await generateReport(userId);
});

// Start agenda
await agenda.start();

// Schedule jobs
await agenda.now('send-email', { to: 'user@example.com', subject: 'Hello' });

// Schedule with delay
await agenda.schedule('in 5 minutes', 'send-email', { to: 'user@example.com' });

// Recurring jobs
await agenda.every('15 minutes', 'check-status');
await agenda.every('0 9 * * *', 'daily-report'); // Cron format

// Cancel jobs
await agenda.cancel({ name: 'send-email', 'data.to': 'user@example.com' });

// Graceful shutdown
const graceful = () => {
  agenda.stop(() => {
    process.exit(0);
  });
};

process.on('SIGTERM', graceful);
process.on('SIGINT', graceful);
```

## Node-cron (Simple Scheduler)

```javascript
const cron = require('node-cron');

// Run every minute
cron.schedule('* * * * *', () => {
  console.log('Running every minute');
});

// Run at specific time (9 AM every day)
cron.schedule('0 9 * * *', () => {
  console.log('Running at 9 AM');
});

// Run on specific days (Mon-Fri at 8 AM)
cron.schedule('0 8 * * 1-5', () => {
  console.log('Running Mon-Fri at 8 AM');
});

// Run every 5 minutes
cron.schedule('*/5 * * * *', () => {
  console.log('Running every 5 minutes');
});

// Scheduled task with timezone
cron.schedule('0 9 * * *', () => {
  console.log('9 AM in New York');
}, {
  timezone: 'America/New_York'
});

// Task with control
const task = cron.schedule('* * * * *', () => {
  console.log('Scheduled task');
}, {
  scheduled: false // Don't start immediately
});

task.start(); // Start task
task.stop(); // Stop task
task.destroy(); // Remove task
```

## Worker Threads

For CPU-intensive tasks without blocking the event loop:

```javascript
const { Worker, isMainThread, parentPort, workerData } = require('worker_threads');

if (isMainThread) {
  // Main thread
  const runWorker = (data) => {
    return new Promise((resolve, reject) => {
      const worker = new Worker(__filename, {
        workerData: data
      });
      
      worker.on('message', resolve);
      worker.on('error', reject);
      worker.on('exit', (code) => {
        if (code !== 0) {
          reject(new Error(`Worker stopped with exit code ${code}`));
        }
      });
    });
  };
  
  // Use worker
  app.post('/process', async (req, res) => {
    try {
      const result = await runWorker(req.body.data);
      res.json({ result });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  
} else {
  // Worker thread
  const processData = (data) => {
    // CPU-intensive task
    let result = 0;
    for (let i = 0; i < 1000000000; i++) {
      result += i;
    }
    return result;
  };
  
  const result = processData(workerData);
  parentPort.postMessage(result);
}
```

### Worker Pool

```javascript
const { StaticPool } = require('node-worker-threads-pool');

// Create pool with 4 workers
const pool = new StaticPool({
  size: 4,
  task: './worker.js'
});

// Execute task
app.post('/heavy-task', async (req, res) => {
  try {
    const result = await pool.exec(req.body.data);
    res.json({ result });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// worker.js
module.exports = (data) => {
  // Heavy computation
  return processData(data);
};
```

## Message Queues (RabbitMQ)

```javascript
const amqp = require('amqplib');

// Connect to RabbitMQ
const connection = await amqp.connect('amqp://localhost');
const channel = await connection.createChannel();

// Assert queue
await channel.assertQueue('tasks', {
  durable: true // Queue survives broker restart
});

// Send message
const sendTask = async (data) => {
  channel.sendToQueue('tasks', Buffer.from(JSON.stringify(data)), {
    persistent: true // Message survives broker restart
  });
};

// Consume messages
channel.consume('tasks', async (msg) => {
  const data = JSON.parse(msg.content.toString());
  
  try {
    // Process task
    await processTask(data);
    
    // Acknowledge message
    channel.ack(msg);
  } catch (error) {
    console.error('Task failed:', error);
    
    // Reject and requeue
    channel.nack(msg, false, true);
  }
}, {
  noAck: false // Manual acknowledgment
});

// Prefetch count (process N messages at a time)
channel.prefetch(1);

// Publish/Subscribe pattern
await channel.assertExchange('logs', 'fanout', { durable: false });

// Publish
channel.publish('logs', '', Buffer.from('Log message'));

// Subscribe
const q = await channel.assertQueue('', { exclusive: true });
await channel.bindQueue(q.queue, 'logs', '');

channel.consume(q.queue, (msg) => {
  console.log('Log:', msg.content.toString());
}, { noAck: true });
```

## Event Emitters

For in-process event handling:

```javascript
const EventEmitter = require('events');

class OrderService extends EventEmitter {
  async createOrder(orderData) {
    const order = await Order.create(orderData);
    
    // Emit event
    this.emit('order:created', order);
    
    return order;
  }
  
  async cancelOrder(orderId) {
    const order = await Order.findByIdAndUpdate(
      orderId,
      { status: 'cancelled' },
      { new: true }
    );
    
    this.emit('order:cancelled', order);
    
    return order;
  }
}

const orderService = new OrderService();

// Listen to events
orderService.on('order:created', async (order) => {
  // Send confirmation email
  await emailQueue.add('send-email', {
    to: order.customerEmail,
    subject: 'Order Confirmation',
    body: `Your order #${order.id} has been confirmed`
  });
  
  // Update inventory
  await inventoryService.decreaseStock(order.items);
});

orderService.on('order:cancelled', async (order) => {
  // Send cancellation email
  await emailQueue.add('send-email', {
    to: order.customerEmail,
    subject: 'Order Cancelled',
    body: `Your order #${order.id} has been cancelled`
  });
  
  // Restore inventory
  await inventoryService.increaseStock(order.items);
});

// Listen once
orderService.once('order:created', () => {
  console.log('First order created!');
});

// Remove listener
const handler = (order) => console.log(order);
orderService.on('order:created', handler);
orderService.off('order:created', handler);
```

## Job Scheduling Patterns

### Recurring Tasks

```javascript
// Daily cleanup
agenda.define('daily-cleanup', async () => {
  // Delete old logs
  await Log.deleteMany({
    createdAt: { $lt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) }
  });
  
  // Clear temp files
  await clearTempFiles();
});

await agenda.every('0 0 * * *', 'daily-cleanup');
```

### Batch Processing

```javascript
// Process users in batches
queue.process('process-users', async (job) => {
  const batchSize = 100;
  let processed = 0;
  let page = 0;
  
  while (true) {
    const users = await User.find()
      .skip(page * batchSize)
      .limit(batchSize);
    
    if (users.length === 0) break;
    
    for (const user of users) {
      await processUser(user);
      processed++;
      job.progress((processed / job.data.totalUsers) * 100);
    }
    
    page++;
  }
  
  return { processed };
});
```

### Webhook Processing

```javascript
// Queue webhook deliveries
const webhookQueue = new Queue('webhooks');

webhookQueue.process(async (job) => {
  const { url, payload } = job.data;
  
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  
  if (!response.ok) {
    throw new Error(`Webhook failed: ${response.status}`);
  }
  
  return { status: response.status };
});

// Send webhook
await webhookQueue.add({
  url: 'https://example.com/webhook',
  payload: { event: 'user.created', data: user }
}, {
  attempts: 5,
  backoff: {
    type: 'exponential',
    delay: 1000
  }
});
```

## Monitoring & Management

### Bull Board (UI for Bull queues)

```javascript
const { createBullBoard } = require('@bull-board/api');
const { BullAdapter } = require('@bull-board/api/bullAdapter');
const { ExpressAdapter } = require('@bull-board/express');

const serverAdapter = new ExpressAdapter();
serverAdapter.setBasePath('/admin/queues');

createBullBoard({
  queues: [
    new BullAdapter(emailQueue),
    new BullAdapter(reportQueue),
    new BullAdapter(webhookQueue)
  ],
  serverAdapter
});

app.use('/admin/queues', serverAdapter.getRouter());
```

### Queue Metrics

```javascript
// Get queue metrics
const getQueueMetrics = async (queue) => {
  const [waiting, active, completed, failed, delayed] = await Promise.all([
    queue.getWaitingCount(),
    queue.getActiveCount(),
    queue.getCompletedCount(),
    queue.getFailedCount(),
    queue.getDelayedCount()
  ]);
  
  return { waiting, active, completed, failed, delayed };
};

// Expose metrics endpoint
app.get('/metrics/queues', async (req, res) => {
  const metrics = await getQueueMetrics(emailQueue);
  res.json(metrics);
});
```