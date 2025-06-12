import mongoose from 'mongoose';
import { mongoURI } from '../config/db';

async function updateSchema() {
  try {
    await mongoose.connect(mongoURI);
    console.log('Connected to MongoDB');

    // Get the MissionCompletion collection
    const db = mongoose.connection.db;
    const completions = db.collection('missioncompletions');

    // Drop indexes that might conflict
    await completions.dropIndexes();
    console.log('Dropped existing indexes');

    // Update the schema
    await completions.updateMany({}, {
      $set: {
        missionId: "recon-rumble" // Set a default value
      }
    });
    
    // Create new indexes
    await completions.createIndex({ userId: 1, missionId: 1 }, { unique: true });
    await completions.createIndex({ userId: 1, completedAt: -1 });
    await completions.createIndex({ missionId: 1, completedAt: -1 });

    console.log('Schema updated successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error updating schema:', error);
    process.exit(1);
  }
}

updateSchema();
