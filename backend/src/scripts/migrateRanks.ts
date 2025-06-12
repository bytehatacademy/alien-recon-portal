import mongoose from 'mongoose';
import User from '../models/User';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/alien-recon-lab')
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.error('MongoDB connection error:', err));

const migrateRanks = async () => {
  try {
    console.log('Starting rank migration...');
    
    // Get all users with old ranks
    const users = await User.find({
      rank: { 
        $nin: [
          'Recon Trainee',
          'Cipher Cadet',
          'Gamma Node',
          'Sigma-51',
          'Command Entity',
          'Delta Agent'
        ]
      }
    });

    console.log(`Found ${users.length} users with old ranks to migrate`);

    for (const user of users) {
      const oldRank = user.rank;
      // Recalculate rank based on mission count
      user.rank = user.calculateRank();
      await user.save();
      
      console.log(`Migrated user ${user._id}: ${oldRank} -> ${user.rank}`);
    }

    console.log('Rank migration completed successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error during rank migration:', error);
    process.exit(1);
  }
};

migrateRanks();
