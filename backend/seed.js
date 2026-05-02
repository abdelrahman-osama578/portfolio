import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Project from './models/Project.js';

dotenv.config();

const seedProjects = [
  {
    title: "HR Management System",
    description: "A comprehensive backend dashboard built with MVC architecture, handling scalable data routing and deployed to a cloud-based IIS production environment.",
    tags: ["C#", "ASP.NET Core 8.0", "SQL Server", "IIS"],
    type: "code",
    github: "https://github.com/abdelrahman-osama578/Guc_Uni_System",
    language: "csharp",
    codeSnippet: `// A preview of the HR System routing logic will go here.\n// We will populate this when we build the Code Viewer UI!`
  },
  {
    title: "Jackaroo Digital Board Game",
    description: "Interactive desktop game utilizing OOP principles, custom view animations, and complex independent probability mechanics for managing a 102-card deck.",
    tags: ["Java", "JavaFX", "MVC"],
    type: "code",
    github: "#",
    language: "java",
    codeSnippet: `// JavaFX controller logic preview will go here.`
  },
  {
    title: "Automated Finance Dashboards",
    description: "Cloud-based analytics system that captures transaction inputs and automatically categorizes data across unique granular tracking views.",
    tags: ["Google Sheets", "Looker Studio", "Data Analytics"],
    type: "data",
    link: "#"
  },
  {
    title: "Swiss & Bauhaus Visual Design",
    description: "Exploration of grid-based layout systems, typography-heavy compositional designs, and minimalist media aesthetics for targeted marketing.",
    tags: ["Photoshop", "Typography", "Creative"],
    type: "media",
    imageUrl: "https://images.unsplash.com/photo-1600428864434-2e2e718cc930?q=80&w=1000&auto=format&fit=crop" // Temporary placeholder until we setup Cloudinary
  },
  {
    title: "3D Motion & VFX Reel",
    description: "High-fidelity 3D animations, geometry node setups, and visual effects rendered for technical marketing.",
    tags: ["Blender", "DaVinci Resolve", "Motion Graphics"],
    type: "video",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ" // Temporary placeholder
  }
];

const runSeed = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB...');

    // Clear existing projects to avoid duplicates if you run this multiple times
    await Project.deleteMany({});
    console.log('🗑️ Cleared old projects...');

    // Insert the new projects
    await Project.insertMany(seedProjects);
    console.log('🌱 Successfully seeded the database with projects!');

    process.exit();
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
};

runSeed();