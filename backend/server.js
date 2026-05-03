import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import nodemailer from 'nodemailer';
import mongoose from 'mongoose';
import Project from './models/Project.js';
import { upload, uploadToCloudinary } from './uploadConfig.js';
import jwt from 'jsonwebtoken';
import rateLimit from 'express-rate-limit';

// Load environment variables from the .env file
dotenv.config();

// --- SECURITY: Rate Limiters ---
// Limit login attempts to 5 per 15 minutes
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 5, 
  message: { error: 'Too many login attempts. Please try again in 15 minutes.' }
});

// Limit contact form submissions to 3 per hour per IP
const contactLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, 
  max: 3, 
  message: { error: 'You have reached the message limit. Please try again later.' }
});

console.log("-> Checking Email User:", process.env.EMAIL_USER);
console.log("-> Checking Pass Length:", process.env.EMAIL_PASS ? process.env.EMAIL_PASS.length : "UNDEFINED");

const app = express();

// Middleware
app.use(express.json()); // Parses incoming JSON data from React
// --- SECURITY: Strict CORS Policy ---
// Only allow requests from your local React app AND your future live Vercel domain
const allowedOrigins = [
  'http://localhost:5173', 
  // We will update this string with your real domain after Vercel gives us one!
  'https://portfolio-front-henna-omega.vercel.app' ,
  'https://aossama.me'
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true 
}));
// --- Database Connection ---
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ Connected to MongoDB Database'))
  .catch((err) => console.error('❌ MongoDB Connection Error:', err));

// --- API Route: Admin Login ---
app.post('/api/login', loginLimiter,  (req, res) => {
  const { password } = req.body;
  
  // Check if the password matches the .env file
  if (password === process.env.ADMIN_PASSWORD) {
    // Generate a VIP Token that lasts for 24 hours
    const token = jwt.sign({ role: 'admin' }, process.env.JWT_SECRET, { expiresIn: '24h' });
    res.status(200).json({ token });
  } else {
    res.status(401).json({ error: 'Invalid password' });
  }
});

// --- THE BOUNCER (Security Middleware) ---
// This function intercepts requests and checks for a valid token
const verifyAdmin = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1]; // Expects "Bearer <token>"
  
  if (!token) return res.status(401).json({ error: 'Access denied. No token provided.' });

  try {
    jwt.verify(token, process.env.JWT_SECRET);
    next(); // Token is valid, let them through to the route!
  } catch (error) {
    res.status(400).json({ error: 'Invalid token.' });
  }
};

// --- API Route: Get All Projects ---
// --- API Route: Get All Projects ---
app.get('/api/projects', async (req, res) => {
  try {
    // THE FIX: Tell MongoDB to sort by our custom 'order' numbers first (1 = ascending)
    const projects = await Project.find().sort({ order: 1, createdAt: -1 }); 
    res.status(200).json(projects);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch projects' });
  }
});

// --- API Route: Reorder Projects (Bulk Update) ---
app.put('/api/projects/reorder', verifyAdmin, async (req, res) => {
  try {
    const { orderedIds } = req.body; 
    
    // Creates a MongoDB Bulk Operation to update the 'order' number
    const bulkOps = orderedIds.map((id, index) => ({
      updateOne: {
        filter: { _id: id },
        // THE FIX: You must explicitly use $set to modify a single field in bulkWrite
        update: { $set: { order: index } } 
      }
    }));
    
    await Project.bulkWrite(bulkOps);
    res.status(200).json({ message: 'Order successfully updated' });
  } catch (error) {
    console.error('Error reordering projects:', error);
    res.status(500).json({ error: 'Failed to save new order' });
  }
});

// --- API Route: Create a New Project ---
app.post('/api/projects', verifyAdmin, async (req, res) => {
  try {
    const newProject = new Project(req.body);
    const savedProject = await newProject.save();
    res.status(201).json(savedProject);
  } catch (error) {
    console.error('Error creating project:', error);
    res.status(500).json({ error: 'Failed to create project in database' });
  }
});

// --- API Route: Update an Existing Project ---
app.put('/api/projects/:id', verifyAdmin, async (req, res) => {
  try {
    // Finds the project by ID and updates it with the new data from req.body
    const updatedProject = await Project.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json(updatedProject);
  } catch (error) {
    console.error('Error updating project:', error);
    res.status(500).json({ error: 'Failed to update project' });
  }
});

// --- API Route: Delete a Project ---
app.delete('/api/projects/:id', verifyAdmin, async (req, res) => {
  try {
    await Project.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Project successfully deleted' });
  } catch (error) {
    console.error('Error deleting project:', error);
    res.status(500).json({ error: 'Failed to delete project' });
  }
});

// --- API Route: Upload Media ---
// --- API Route: Upload Media (MULTIPLE FILES) ---
app.post('/api/upload', upload.array('media', 10), async (req, res) => {
  try {
    // Check for req.files (plural) instead of req.file
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: 'No files provided' });
    }

    // Loop through all uploaded files and send them to Cloudinary concurrently
    const uploadPromises = req.files.map(file => 
      uploadToCloudinary(file.buffer, 'portfolio_assets')
    );
    
    const results = await Promise.all(uploadPromises);

    // Extract the secure URLs from the Cloudinary results
    const imageUrls = results.map(result => result.secure_url);

    // Send back an array of URLs
    res.status(200).json({ 
      success: true, 
      urls: imageUrls 
    });

  } catch (error) {
    console.error('Upload Error:', error);
    res.status(500).json({ error: 'Failed to upload media to cloud' });
  }
});

// Configure the Email Transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Verify the email connection on startup
transporter.verify((error, success) => {
  if (error) {
    console.log('Server Email Error: ', error);
  } else {
    console.log('Server is ready to take our messages');
  }
});

// The API Route to handle the form submission
app.post('/api/contact', contactLimiter, async (req, res) => {
  const { name, email, message } = req.body;

  // Basic validation
  if (!name || !email || !message) {
    return res.status(400).json({ error: 'Please fill in all fields.' });
  }

  // Define what the email will look like in your inbox
  const mailOptions = {
    from: `"${name}" <${email}>`, // Who it's from
    to: process.env.EMAIL_USER,    // Sent to yourself
    subject: `New Portfolio Message from ${name}`,
    text: `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
    html: `
      <div style="font-family: Arial, sans-serif; padding: 20px; border-radius: 8px; border: 1px solid #ddd;">
        <h2 style="color: #00b8ff;">New Message from Portfolio</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
        <p style="white-space: pre-wrap;">${message}</p>
      </div>
    `,
  };

  try {
    // Send the email
    await transporter.sendMail(mailOptions);
    res.status(200).json({ success: 'Message sent successfully!' });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ error: 'Failed to send message. Please try again later.' });
  }
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
});
export default app;