import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  tags: [{ type: String }], // Array of strings (e.g., ["C#", "ASP.NET"])
  type: { type: String, enum: ['code', 'data', 'media', 'video'], required: true },
  images: [{ type: String }],
  
  // Optional links depending on the project type
  link: { type: String, default: null },
  github: { type: String, default: null },
  
  // Media URLs (We will fill these later with Cloudinary URLs)
  imageUrl: { type: String, default: null },
  videoUrl: { type: String, default: null },
  
  // Native Code Viewing (For your C# and JavaFX projects)
  codeSnippet: { type: String, default: null }, 
  language: { type: String, default: null }, // e.g., 'java', 'csharp', 'javascript'

  // NEW: The order field to handle custom manual sorting from the Admin panel
  order: { type: Number, default: 0 }
}, { timestamps: true });

const Project = mongoose.model('Project', projectSchema);

export default Project;