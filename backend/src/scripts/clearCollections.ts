import mongoose from 'mongoose';

const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/alien-recon-lab';

async function clearMissionCompletions() {
  try {
    await mongoose.connect(mongoURI);
    console.log('Connected to MongoDB');

    // Drop the MissionCompletion collection
    if (mongoose.connection.db) {
      await mongoose.connection.db.dropCollection('missioncompletions').catch(() => {
        console.log('Collection does not exist, continuing...');
      });
      console.log('Cleared mission completions');

      // Drop the activities collection too since it might have references
      await mongoose.connection.db.dropCollection('activities').catch(() => {
        console.log('Activities collection does not exist, continuing...');
      });
      console.log('Cleared activities');
    }

    console.log('Successfully cleared collections');
    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('Error clearing collections:', error);
    process.exit(1);
  }
}

clearMissionCompletions();
