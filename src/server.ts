import express from 'express';
import { json } from 'express';
import jwt from 'jsonwebtoken';
import { config } from 'dotenv';
import BetterSqlite3 from 'better-sqlite3';
import { z } from 'zod'; // Using zod for input validation
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';

// Load environment variables
config();

const CLAW_CLOUD_ENABLED = process.env.CLAW_CLOUD_ENABLED === 'true';
const JWT_SECRET = process.env.JWT_SECRET || 'supersecretjwtkey'; // In production, use a strong, unique key from env
const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY || 'sk_test_123';
const STRIPE_WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET || 'whsec_123';
const DATABASE_URL = process.env.DATABASE_URL || './data/clawcloud.db';
const ADMIN_API_KEY = process.env.ADMIN_API_KEY || 'admin_api_key';

if (!CLAW_CLOUD_ENABLED) {
  console.log("ClawCloud server is disabled. Set CLAW_CLOUD_ENABLED=true in your .env to enable.");
  process.exit(0);
}

// Initialize SQLite Database
const db = new BetterSqlite3(DATABASE_URL);

// Create users table if it doesn't exist
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    stripeCustomerId TEXT,
    plan TEXT DEFAULT 'free',
    quota int DEFAULT 100,
    lastLogin TEXT,
    createdAt TEXT DEFAULT CURRENT_TIMESTAMP
  );
`);

const app = express();
const PORT = process.env.PORT || 3000;

// Security Middlewares
app.use(helmet()); // Basic security headers
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: "Too many requests from this IP, please try again after 15 minutes",
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});
app.use(limiter); // Apply rate limiting to all requests

// Middleware to parse JSON for most routes
app.use((req, res, next) => {
  if (req.originalUrl === '/webhook/stripe') {
    next(); // Skip JSON parsing for Stripe webhook, as it needs raw body
  } else {
    json()(req, res, next);
  }
});

// Zod schemas for validation
const LoginSchema = z.object({
  email: z.string().email(),
  // In a real app, we'd have a password and bcrypt it
});

const TaskSchema = z.object({
  task: z.string().min(5).max(500), // Example task validation
});

// Middleware for JWT authentication
const authenticateJWT = (req: any, res: express.Response, next: express.NextFunction) => {
  const authHeader = req.headers.authorization;

  if (authHeader) {
    const token = authHeader.split(' ')[1]; // Bearer TOKEN

    jwt.verify(token, JWT_SECRET, (err: any, user: any) => {
      if (err) {
        return res.sendStatus(403); // Forbidden
      }
      req.user = user;
      next();
    });
  } else {
    res.sendStatus(401); // Unauthorized
  }
};

// Middleware for quota checking
const checkQuota = (req: any, res: express.Response, next: express.NextFunction) => {
  // This is a simplified check. In a real app, this would be more sophisticated
  // and involve decrementing quota after successful task execution.
  const user = db.prepare('SELECT quota FROM users WHERE id = ?').get(req.user.id);

  if (!user || user.quota <= 0) {
    return res.status(403).json({ message: 'Quota exceeded. Please upgrade your plan.' });
  }
  next();
};

// --- Routes ---

// Public route for user login/registration (simplified)
app.post('/auth/login', (req, res) => {
  const parseResult = LoginSchema.safeParse(req.body);
  if (!parseResult.success) {
    return res.status(400).json({ errors: parseResult.error.errors });
  }

  const { email } = parseResult.data;
  let user = db.prepare('SELECT id, email, quota, plan FROM users WHERE email = ?').get(email);

  if (!user) {
    // Register new user
    const newUser = {
      id: crypto.randomUUID(), // Node.js 16+
      email,
      plan: 'free',
      quota: 100, // Free tier quota
      createdAt: new Date().toISOString(),
    };
    db.prepare('INSERT INTO users (id, email, plan, quota, createdAt) VALUES (?, ?, ?, ?, ?)').run(
      newUser.id, newUser.email, newUser.plan, newUser.quota, newUser.createdAt
    );
    user = newUser;
  }

  // Update last login
  db.prepare('UPDATE users SET lastLogin = ? WHERE id = ?').run(new Date().toISOString(), user.id);

  const token = jwt.sign({ id: user.id, email: user.email, plan: user.plan }, JWT_SECRET, { expiresIn: '1h' });
  res.json({ token, user: { id: user.id, email: user.email, plan: user.plan, quota: user.quota } });
});

// Protected route for agent task execution
app.post('/api/agent/do', authenticateJWT, checkQuota, async (req, res) => {
  const parseResult = TaskSchema.safeParse(req.body);
  if (!parseResult.success) {
    return res.status(400).json({ errors: parseResult.error.errors });
  }
  const { task } = parseResult.data;
  const user = req.user; // From authenticateJWT middleware

  console.log(`[ClawCloud] User ${user.email} (ID: ${user.id}) submitting task: "${task}"`);

  // TODO: Integrate the actual agent logic here.
  // This would involve instantiating and running the 'Agent' from agent-cli/src/agent.ts
  // Ensure the agent execution is isolated and secure for multi-tenancy.
  // The agent would need to be passed a context object with user details and potentially
  // adjusted policies/quotas based on the user's plan.
  try {
    // Simulate agent processing
    await new Promise(resolve => setTimeout(resolve, 2000));
    const simulatedResult = {
      message: `Task "${task}" processed for user ${user.email}. (Agent integration TODO)`,
      status: 'success',
      // In a real scenario, decrement user quota here
    };

    // Decrement quota (simplified example)
    db.prepare('UPDATE users SET quota = quota - 1 WHERE id = ?').run(user.id);

    res.json(simulatedResult);
  } catch (error: any) {
    console.error('Agent execution error:', error);
    res.status(500).json({ message: 'Error processing task.', error: error.message });
  }
});

// Stripe Webhook endpoint
app.post('/webhook/stripe', express.raw({ type: 'application/json' }), (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    // In a real scenario, use Stripe's library to verify the webhook signature
    // event = stripe.webhooks.constructEvent(req.body, sig, STRIPE_WEBHOOK_SECRET);
    console.log('[Stripe Webhook] Received event:', req.body); // Log raw body for now
    event = JSON.parse(req.body.toString()); // Dummy parse
  } catch (err: any) {
    console.error(`[Stripe Webhook] Webhook Error: ${err.message}`);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the event
  switch (event.type) {
    case 'customer.subscription.created':
    case 'customer.subscription.updated':
      // Update user's plan and quota in database
      console.log(`[Stripe Webhook] Subscription event for ${event.data.object.customer}`);
      break;
    case 'invoice.payment_succeeded':
      // Grant access to paid features
      console.log(`[Stripe Webhook] Payment succeeded for ${event.data.object.customer}`);
      break;
    // ... handle other event types
    default:
      console.log(`[Stripe Webhook] Unhandled event type ${event.type}`);
  }

  res.json({ received: true });
});

// Admin endpoint (basic example, secure with a strong API key)
app.post('/admin/users', (req, res) => {
  const adminKey = req.headers['x-admin-api-key'];
  if (adminKey !== ADMIN_API_KEY) {
    return res.sendStatus(403);
  }
  const users = db.prepare('SELECT id, email, plan, quota FROM users').all();
  res.json(users);
});


// Start the server
app.listen(PORT, () => {
  console.log(`ClawCloud server listening on port ${PORT}`);
  console.log(`ClawCloud server status: ${CLAW_CLOUD_ENABLED ? 'ENABLED' : 'DISABLED'}`);
});

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('Closing database connection.');
  db.close();
  process.exit(0);
});

// TODO:
// - Implement actual agent integration, ensuring multi-tenancy and resource isolation.
// - More robust error handling and logging.
// - Advanced user management (password hashing, MFA).
// - Full Stripe webhook event handling.
// - WebSocket for real-time agent feedback.
// - Detailed quota management and billing integration.
// - Consider a more scalable database for production (PostgreSQL).
