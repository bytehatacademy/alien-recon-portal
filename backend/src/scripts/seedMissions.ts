import mongoose from 'mongoose';
import Mission from '../models/Mission';

const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/alien-recon-lab';

const missions = [
  {
    _id: 'recon-rumble',
    title: 'Recon Rumble',
    description: 'Analyze intercepted alien communication patterns to identify infiltration methods.',
    category: 'OSINT',
    difficulty: 'Beginner',
    points: 100,
    estimatedTime: '30 min',
    briefing: 'Your mission is to analyze the provided evidence and extract the hidden flag.',
    fileUrl: '#',
    flag: 'ARLab{welcome_agent}',
    isActive: true,
    order: 1
  },
  {
    _id: 'packet-puzzle',
    title: 'Packet Puzzle',
    description: 'Examine network traffic to uncover hidden alien data transmissions.',
    category: 'Network Analysis',
    difficulty: 'Intermediate',
    points: 250,
    estimatedTime: '45 min',
    fileUrl: '#',
    flag: 'ARLab{packet_master}',
    isActive: true,
    order: 2,
    unlockRequirement: 'recon-rumble'
  },
  {
    _id: 'memory-maze',
    title: 'Memory Maze',
    description: 'Perform memory forensics on an infected system to find alien artifacts.',
    category: 'Digital Forensics',
    difficulty: 'Advanced',
    points: 400,
    estimatedTime: '60 min',
    fileUrl: '#',
    flag: 'ARLab{memory_hunter}',
    isActive: true,
    order: 3,
    unlockRequirement: 'packet-puzzle'
  },
  {
    _id: 'apt-archive',
    title: 'APT Archive',
    description: 'Investigate an advanced persistent threat with alien origins.',
    category: 'Threat Intelligence',
    difficulty: 'Expert',
    points: 500,
    estimatedTime: '90 min',
    fileUrl: '#',
    flag: 'ARLab{apt_master}',
    isActive: true,
    order: 4,
    unlockRequirement: 'memory-maze'
  },
  {
    _id: 'alien-osint',
    title: 'Alien OSINT',
    description: 'Use open source intelligence to track alien infiltration activities.',
    category: 'OSINT',
    difficulty: 'Intermediate',
    points: 300,
    estimatedTime: '45 min',
    fileUrl: '#',
    flag: 'ARLab{osint_hunter}',
    isActive: true,
    order: 5,
    unlockRequirement: 'apt-archive'
  }
];

async function seedMissions() {
  try {
    // Connect to MongoDB
    await mongoose.connect(mongoURI);
    console.log('Connected to MongoDB');

    // Clear existing missions
    await Mission.deleteMany({});
    console.log('Cleared existing missions');

    // Insert new missions
    await Mission.insertMany(missions);
    console.log('Missions seeded successfully');

    // Disconnect from MongoDB
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding missions:', error);
    process.exit(1);
  }
}

// Run the seed function
seedMissions();
