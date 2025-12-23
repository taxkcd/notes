# Third-Party Integrations - Interview Guide

## Payment Processing

### Stripe Integration

```javascript
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

// Create payment intent
const createPaymentIntent = async (amount, currency = 'usd') => {
  const paymentIntent = await stripe.paymentIntents.create({
    amount: amount * 100, // Convert to cents
    currency,
    payment_method_types: ['card'],
    metadata: {
      orderId: 'order_123'
    }
  });
  
  return paymentIntent.client_secret;
};

// Create customer
const createCustomer = async (email, name) => {
  const customer = await stripe.customers.create({
    email,
    name,
    metadata: {
      userId: 'user_123'
    }
  });
  
  return customer;
};

// Create subscription
const createSubscription = async (customerId, priceId) => {
  const subscription = await stripe.subscriptions.create({
    customer: customerId,
    items: [{ price: priceId }],
    payment_behavior: 'default_incomplete',
    expand: ['latest_invoice.payment_intent']
  });
  
  return subscription;
};

// Handle webhook
app.post('/webhooks/stripe', express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature'];
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;
  
  let event;
  
  try {
    event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }
  
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
    case 'customer.subscription.deleted':
      const subscription = event.data.object;
      await handleSubscriptionChange(subscription);
      break;
      
    default:
      console.log(`Unhandled event type ${event.type}`);
  }
  
  res.json({ received: true });
});

// Refund payment
const refundPayment = async (paymentIntentId, amount) => {
  const refund = await stripe.refunds.create({
    payment_intent: paymentIntentId,
    amount: amount * 100
  });
  
  return refund;
};

// List customer payments
const getCustomerPayments = async (customerId) => {
  const charges = await stripe.charges.list({
    customer: customerId,
    limit: 100
  });
  
  return charges.data;
};
```

### Chargebee Integration

```javascript
const chargebee = require('chargebee');

chargebee.configure({
  site: process.env.CHARGEBEE_SITE,
  api_key: process.env.CHARGEBEE_API_KEY
});

// Create customer
const createCustomer = async (customerData) => {
  const result = await chargebee.customer.create({
    email: customerData.email,
    first_name: customerData.firstName,
    last_name: customerData.lastName,
    phone: customerData.phone
  }).request();
  
  return result.customer;
};

// Create subscription
const createSubscription = async (customerId, planId) => {
  const result = await chargebee.subscription.create({
    plan_id: planId,
    customer_id: customerId
  }).request();
  
  return result.subscription;
};

// Generate hosted page for checkout
const generateCheckoutUrl = async (planId, customerId) => {
  const result = await chargebee.hosted_page.checkout_new({
    subscription: {
      plan_id: planId,
      customer_id: customerId
    }
  }).request();
  
  return result.hosted_page.url;
};

// Handle webhook
app.post('/webhooks/chargebee', express.json(), async (req, res) => {
  const event = req.body;
  
  switch (event.event_type) {
    case 'subscription_created':
      await handleSubscriptionCreated(event.content.subscription);
      break;
      
    case 'subscription_changed':
      await handleSubscriptionChanged(event.content.subscription);
      break;
      
    case 'subscription_cancelled':
      await handleSubscriptionCancelled(event.content.subscription);
      break;
      
    case 'payment_succeeded':
      await handlePaymentSucceeded(event.content.transaction);
      break;
      
    case 'payment_failed':
      await handlePaymentFailed(event.content.transaction);
      break;
  }
  
  res.status(200).send();
});

// Cancel subscription
const cancelSubscription = async (subscriptionId) => {
  const result = await chargebee.subscription.cancel(subscriptionId, {
    end_of_term: true
  }).request();
  
  return result.subscription;
};

// Update subscription
const updateSubscription = async (subscriptionId, updates) => {
  const result = await chargebee.subscription.update(subscriptionId, updates).request();
  return result.subscription;
};
```

## Calendar Integrations

### Google Calendar

```javascript
const { google } = require('googleapis');

// Initialize OAuth2 client
const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI
);

// Generate auth URL
const getAuthUrl = () => {
  return oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: ['https://www.googleapis.com/auth/calendar']
  });
};

// Exchange code for tokens
const getTokens = async (code) => {
  const { tokens } = await oauth2Client.getToken(code);
  oauth2Client.setCredentials(tokens);
  return tokens;
};

// Set credentials
const setCredentials = (tokens) => {
  oauth2Client.setCredentials(tokens);
};

// Create calendar event
const createEvent = async (eventData) => {
  const calendar = google.calendar({ version: 'v3', auth: oauth2Client });
  
  const event = {
    summary: eventData.title,
    description: eventData.description,
    start: {
      dateTime: eventData.startTime,
      timeZone: 'America/New_York'
    },
    end: {
      dateTime: eventData.endTime,
      timeZone: 'America/New_York'
    },
    attendees: eventData.attendees?.map(email => ({ email })),
    conferenceData: {
      createRequest: {
        requestId: `${Date.now()}`,
        conferenceSolutionKey: { type: 'hangoutsMeet' }
      }
    }
  };
  
  const response = await calendar.events.insert({
    calendarId: 'primary',
    resource: event,
    conferenceDataVersion: 1
  });
  
  return response.data;
};

// List events
const listEvents = async (timeMin, timeMax) => {
  const calendar = google.calendar({ version: 'v3', auth: oauth2Client });
  
  const response = await calendar.events.list({
    calendarId: 'primary',
    timeMin: timeMin || new Date().toISOString(),
    timeMax: timeMax,
    maxResults: 10,
    singleEvents: true,
    orderBy: 'startTime'
  });
  
  return response.data.items;
};

// Update event
const updateEvent = async (eventId, updates) => {
  const calendar = google.calendar({ version: 'v3', auth: oauth2Client });
  
  const response = await calendar.events.patch({
    calendarId: 'primary',
    eventId: eventId,
    resource: updates
  });
  
  return response.data;
};

// Delete event
const deleteEvent = async (eventId) => {
  const calendar = google.calendar({ version: 'v3', auth: oauth2Client });
  
  await calendar.events.delete({
    calendarId: 'primary',
    eventId: eventId
  });
};

// Watch for changes
const watchCalendar = async (webhookUrl) => {
  const calendar = google.calendar({ version: 'v3', auth: oauth2Client });
  
  const response = await calendar.events.watch({
    calendarId: 'primary',
    resource: {
      id: `channel-${Date.now()}`,
      type: 'web_hook',
      address: webhookUrl
    }
  });
  
  return response.data;
};
```

### Microsoft Calendar (Outlook)

```javascript
const { Client } = require('@microsoft/microsoft-graph-client');
require('isomorphic-fetch');

// Initialize client with access token
const getGraphClient = (accessToken) => {
  return Client.init({
    authProvider: (done) => {
      done(null, accessToken);
    }
  });
};

// Create event
const createEvent = async (accessToken, eventData) => {
  const client = getGraphClient(accessToken);
  
  const event = {
    subject: eventData.title,
    body: {
      contentType: 'HTML',
      content: eventData.description
    },
    start: {
      dateTime: eventData.startTime,
      timeZone: 'Eastern Standard Time'
    },
    end: {
      dateTime: eventData.endTime,
      timeZone: 'Eastern Standard Time'
    },
    attendees: eventData.attendees?.map(email => ({
      emailAddress: { address: email },
      type: 'required'
    })),
    isOnlineMeeting: true,
    onlineMeetingProvider: 'teamsForBusiness'
  };
  
  const result = await client.api('/me/events').post(event);
  return result;
};

// List events
const listEvents = async (accessToken, startDate, endDate) => {
  const client = getGraphClient(accessToken);
  
  const events = await client
    .api('/me/calendarview')
    .query({
      startDateTime: startDate || new Date().toISOString(),
      endDateTime: endDate
    })
    .top(10)
    .orderby('start/dateTime')
    .get();
  
  return events.value;
};

// Update event
const updateEvent = async (accessToken, eventId, updates) => {
  const client = getGraphClient(accessToken);
  
  const result = await client
    .api(`/me/events/${eventId}`)
    .patch(updates);
  
  return result;
};

// Delete event
const deleteEvent = async (accessToken, eventId) => {
  const client = getGraphClient(accessToken);
  await client.api(`/me/events/${eventId}`).delete();
};

// Subscribe to notifications
const subscribeToCalendar = async (accessToken, notificationUrl) => {
  const client = getGraphClient(accessToken);
  
  const subscription = {
    changeType: 'created,updated,deleted',
    notificationUrl: notificationUrl,
    resource: '/me/events',
    expirationDateTime: new Date(Date.now() + 3600000).toISOString(),
    clientState: 'secretClientState'
  };
  
  const result = await client.api('/subscriptions').post(subscription);
  return result;
};

// Handle webhook notification
app.post('/webhooks/microsoft-calendar', express.json(), (req, res) => {
  // Validation token
  if (req.query.validationToken) {
    res.send(req.query.validationToken);
    return;
  }
  
  // Handle notification
  const notifications = req.body.value;
  
  notifications.forEach(notification => {
    if (notification.clientState !== 'secretClientState') {
      return;
    }
    
    switch (notification.changeType) {
      case 'created':
        handleEventCreated(notification);
        break;
      case 'updated':
        handleEventUpdated(notification);
        break;
      case 'deleted':
        handleEventDeleted(notification);
        break;
    }
  });
  
  res.status(202).send();
});
```

## Email Services

### SendGrid

```javascript
const sgMail = require('@sendgrid/mail');

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// Send email
const sendEmail = async (to, subject, html) => {
  const msg = {
    to,
    from: 'noreply@yourapp.com',
    subject,
    html
  };
  
  await sgMail.send(msg);
};

// Send with template
const sendTemplateEmail = async (to, templateId, dynamicData) => {
  const msg = {
    to,
    from: 'noreply@yourapp.com',
    templateId,
    dynamicTemplateData: dynamicData
  };
  
  await sgMail.send(msg);
};

// Send bulk emails
const sendBulkEmails = async (recipients) => {
  const messages = recipients.map(recipient => ({
    to: recipient.email,
    from: 'noreply@yourapp.com',
    subject: 'Hello',
    html: `<p>Hi ${recipient.name}</p>`
  }));
  
  await sgMail.send(messages);
};
```

### Nodemailer

```javascript
const nodemailer = require('nodemailer');

// Create transporter
const transporter = nodemailer.createTransporter({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: true,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

// Send email
const sendEmail = async (to, subject, html) => {
  const info = await transporter.sendMail({
    from: '"Your App" <noreply@yourapp.com>',
    to,
    subject,
    html
  });
  
  return info.messageId;
};

// Send with attachments
const sendEmailWithAttachment = async (to, subject, html, attachments) => {
  const info = await transporter.sendMail({
    from: 'noreply@yourapp.com',
    to,
    subject,
    html,
    attachments: attachments.map(file => ({
      filename: file.name,
      path: file.path
    }))
  });
  
  return info;
};
```

## File Storage

### AWS S3

```javascript
const AWS = require('aws-sdk');

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY,
  secretAccessKey: process.env.AWS_SECRET_KEY,
  region: process.env.AWS_REGION
});

// Upload file
const uploadFile = async (file, fileName) => {
  const params = {
    Bucket: process.env.S3_BUCKET,
    Key: fileName,
    Body: file.buffer,
    ContentType: file.mimetype,
    ACL: 'public-read'
  };
  
  const result = await s3.upload(params).promise();
  return result.Location;
};

// Generate presigned URL for upload
const getPresignedUploadUrl = (fileName, contentType) => {
  const params = {
    Bucket: process.env.S3_BUCKET,
    Key: fileName,
    ContentType: contentType,
    Expires: 300 // 5 minutes
  };
  
  return s3.getSignedUrl('putObject', params);
};

// Download file
const downloadFile = async (fileName) => {
  const params = {
    Bucket: process.env.S3_BUCKET,
    Key: fileName
  };
  
  const data = await s3.getObject(params).promise();
  return data.Body;
};

// Delete file
const deleteFile = async (fileName) => {
  const params = {
    Bucket: process.env.S3_BUCKET,
    Key: fileName
  };
  
  await s3.deleteObject(params).promise();
};

// List files
const listFiles = async (prefix) => {
  const params = {
    Bucket: process.env.S3_BUCKET,
    Prefix: prefix
  };
  
  const data = await s3.listObjectsV2(params).promise();
  return data.Contents;
};
```

## Social Media APIs

### Twitter API

```javascript
const Twitter = require('twitter');

const client = new Twitter({
  consumer_key: process.env.TWITTER_API_KEY,
  consumer_secret: process.env.TWITTER_API_SECRET,
  access_token_key: process.env.TWITTER_ACCESS_TOKEN,
  access_token_secret: process.env.TWITTER_ACCESS_SECRET
});

// Post tweet
const postTweet = async (status) => {
  const tweet = await client.post('statuses/update', { status });
  return tweet;
};

// Get user timeline
const getUserTimeline = async (screenName, count = 20) => {
  const tweets = await client.get('statuses/user_timeline', {
    screen_name: screenName,
    count
  });
  return tweets;
};
```

## SMS Services

### Twilio

```javascript
const twilio = require('twilio');

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

// Send SMS
const sendSMS = async (to, message) => {
  const result = await client.messages.create({
    body: message,
    from: process.env.TWILIO_PHONE_NUMBER,
    to
  });
  
  return result.sid;
};

// Send verification code
const sendVerificationCode = async (phoneNumber) => {
  const verification = await client.verify
    .services(process.env.TWILIO_VERIFY_SERVICE)
    .verifications
    .create({ to: phoneNumber, channel: 'sms' });
  
  return verification.sid;
};

// Verify code
const verifyCode = async (phoneNumber, code) => {
  const verification = await client.verify
    .services(process.env.TWILIO_VERIFY_SERVICE)
    .verificationChecks
    .create({ to: phoneNumber, code });
  
  return verification.status === 'approved';
};
```

## Best Practices

1. **Store API keys securely**: Use environment variables
2. **Handle rate limits**: Implement exponential backoff
3. **Validate webhooks**: Verify signatures
4. **Log API calls**: For debugging and monitoring
5. **Handle errors gracefully**: Retry failed requests
6. **Use SDK when available**: Better than raw HTTP
7. **Cache responses**: When appropriate
8. **Monitor API usage**: Track quotas and limits
9. **Version your integrations**: Handle API changes
10. **Test in sandbox**: Before production