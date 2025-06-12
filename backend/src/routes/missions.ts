import express, { Response } from 'express';
import { body, param, validationResult } from 'express-validator';
import Mission from '../models/Mission';
import User from '../models/User';
import MissionCompletion from '../models/MissionCompletion';
import Activity from '../models/Activity';
import { authMiddleware, AuthRequest, adminMiddleware } from '../middleware/auth';

const router = express.Router();

// @route   GET /api/missions
// @desc    Get all active missions for user
// @access  Private
router.get('/', authMiddleware, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: 'User not found'
      });
      return;
    }

    // Get all active missions ordered by order field
    const missions = await Mission.find({ isActive: true })
      .sort({ order: 1 })
      .select('-flag'); // Don't send the flag to frontend

    // Get user's completed missions
    const completedMissions = req.user.completedMissions;

    // Add completion status and unlock status to each mission
    const missionsWithStatus = missions.map(mission => {
      const isCompleted = completedMissions.some(
        completedId => completedId === mission._id
      );
      
      let isUnlocked = true;
      if (mission.unlockRequirement) {
        isUnlocked = completedMissions.some(
          completedId => completedId === mission.unlockRequirement
        );
      }

      return {
        ...mission.toObject(),
        isCompleted,
        isUnlocked,
        status: isCompleted ? 'completed' : isUnlocked ? 'available' : 'locked'
      };
    });

    res.json({
      success: true,
      data: {
        missions: missionsWithStatus,
        totalMissions: missions.length,
        completedCount: completedMissions.length
      }
    });
  } catch (error) {
    console.error('Get missions error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching missions'
    });
  }
});

// @route   GET /api/missions/:id
// @desc    Get single mission details
// @access  Private
router.get('/:id', [
  authMiddleware
], async (req: AuthRequest, res: Response): Promise<void> => {
  try {

    if (!req.user) {
      res.status(401).json({
        success: false,
        message: 'User not found'
      });
      return;
    }

    const mission = await Mission.findById(req.params.id).select('-flag');
    if (!mission || !mission.isActive) {
      res.status(404).json({
        success: false,
        message: 'Mission not found'
      });
      return;
    }

    // Check if mission is unlocked
    let isUnlocked = true;
    if (mission.unlockRequirement) {
      isUnlocked = req.user.completedMissions.includes(mission.unlockRequirement);
    }

    if (!isUnlocked) {
      res.status(403).json({
        success: false,
        message: 'Mission is locked. Complete previous missions to unlock.'
      });
      return;
    }

    const isCompleted = req.user.completedMissions.includes(mission._id);

    res.json({
      success: true,
      data: {
        mission: {
          ...mission.toObject(),
          isCompleted,
          isUnlocked,
          status: isCompleted ? 'completed' : 'available'
        }
      }
    });
  } catch (error) {
    console.error('Get mission error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching mission'
    });
  }
});

// @route   POST /api/missions/:id/submit
// @desc    Submit a flag for a mission
// @access  Private
router.post('/:id/submit', authMiddleware, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: 'Unauthorized'
      });
      return;
    }

    const submittedFlag = req.body.flag.trim();
    if (!submittedFlag) {
      res.status(400).json({
        success: false,
        message: 'Flag is required'
      });
      return;
    }

    const mission = await Mission.findById(req.params.id);
    if (!mission) {
      res.status(404).json({
        success: false,
        message: 'Mission not found'
      });
      return;
    }

    // Check if mission was already completed
    const isAlreadyCompleted = req.user.completedMissions.includes(mission._id);
    if (isAlreadyCompleted) {
      res.status(400).json({
        success: false,
        message: 'Mission already completed'
      });
      return;
    }

    const isCorrect = submittedFlag === mission.flag;

    // Record the attempt
    await Activity.create({
      userId: req.user._id,
      type: 'flag_submission',
      title: `Flag Submission - ${mission.title}`,
      description: isCorrect ? 'Successfully completed the mission!' : 'Incorrect flag submission',
      points: isCorrect ? mission.points : 0,
      metadata: { 
        missionId: mission._id,
        submittedFlag,
        correct: isCorrect
      }
    });

    if (!isCorrect) {
      res.status(400).json({
        success: false,
        message: 'Incorrect flag. Keep trying!'
      });
      return;
    }

    // Record completion
    await MissionCompletion.create({
      userId: req.user._id,
      missionId: mission._id,
      flagSubmitted: submittedFlag,
      pointsEarned: mission.points,
      attempts: 1,
      hintsUsed: 0,
      timeSpent: 0,
      completedAt: new Date(),
      userAgent: req.headers['user-agent'],
      ipAddress: req.ip
    });      // Update user's score and completed missions
    const user = await User.findById(req.user._id);
    if (!user) {
      throw new Error('User not found');
    }

    // Store starting rank
    let oldRank = user.rank;

    // Add the mission to completed missions
    if (!user.completedMissions.includes(mission._id)) {
      // Store old rank before making changes
      const oldRank = user.rank;
      
      user.completedMissions.push(mission._id);
      user.score += mission.points;
      
      // Save user to trigger rank calculation
      await user.save();
      
      // If rank changed, create a rank promotion activity
      if (oldRank !== user.rank) {
        await Activity.create({
          userId: user._id,
          type: 'rank_promoted',
          title: 'Rank Promotion',
          description: `Promoted from ${oldRank} to ${user.rank}!`,
          points: 0,
          metadata: {
            oldRank,
            newRank: user.rank,
            promotionMission: mission._id
          }
        });
      }
    }

    const updatedUser = user;

    // Record mission completion activity
    await Activity.create({
      userId: req.user._id,
      type: 'mission_completed',
      title: `Mission Completed - ${mission.title}`,
      description: `Successfully completed the ${mission.title} mission and earned ${mission.points} points!`,
      points: mission.points,
      metadata: { 
        missionId: mission._id,
        points: mission.points
      }
    });

    res.json({
      success: true,
      message: 'Mission completed successfully!',
      data: {
        pointsEarned: mission.points,
        newScore: updatedUser?.score || 0,
        oldRank: oldRank,
        newRank: user.rank
      }
    });
  } catch (error) {
    console.error('Error submitting flag:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   POST /api/missions
// @desc    Create new mission (Admin only)
// @access  Private/Admin
router.post('/', [
  authMiddleware,
  adminMiddleware,
  body('title').trim().notEmpty().withMessage('Title is required'),
  body('description').trim().notEmpty().withMessage('Description is required'),
  body('difficulty').isIn(['Beginner', 'Intermediate', 'Advanced', 'Expert']).withMessage('Invalid difficulty'),
  body('points').isInt({ min: 1, max: 1000 }).withMessage('Points must be between 1 and 1000'),
  body('category').trim().notEmpty().withMessage('Category is required'),
  body('flag').matches(/^ARLab\{.*\}$/).withMessage('Flag must follow ARLab{} format'),
  body('order').isInt({ min: 1 }).withMessage('Order must be a positive integer')
], async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({
        success: false,
        message: 'Validation errors',
        errors: errors.array()
      });
      return;
    }

    const mission = new Mission(req.body);
    await mission.save();

    res.status(201).json({
      success: true,
      message: 'Mission created successfully',
      data: { mission }
    });
  } catch (error) {
    console.error('Create mission error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while creating mission'
    });
  }
});

// @route   GET /api/missions/:id/completion
// @desc    Get mission completion details
// @access  Private
router.get('/:id/completion', authMiddleware, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: 'Unauthorized'
      });
      return;
    }

    const missionCompletion = await MissionCompletion.findOne({
      userId: req.user._id,
      missionId: req.params.id
    });

    if (!missionCompletion) {
      res.status(404).json({
        success: false,
        message: 'Mission completion not found'
      });
      return;
    }

    res.json({
      success: true,
      data: {
        flagSubmitted: missionCompletion.flagSubmitted,
        completedAt: missionCompletion.completedAt,
        pointsEarned: missionCompletion.pointsEarned
      }
    });
  } catch (error) {
    console.error('Get mission completion error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching mission completion'
    });
  }
});

// @route   POST /api/missions/:id/flag
// @desc    Submit a flag for a mission
// @access  Private
router.post('/:id/flag', authMiddleware, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: 'Unauthorized'
      });
      return;
    }

    const { flag } = req.body;
    const mission = await Mission.findById(req.params.id);

    if (!mission) {
      res.status(404).json({
        success: false,
        message: 'Mission not found'
      });
      return;
    }

    // Check if mission is already completed
    const isCompleted = req.user.completedMissions.includes(mission._id);
    if (isCompleted) {
      res.status(400).json({
        success: false,
        message: 'Mission already completed'
      });
      return;
    }

    // Save the flag submission whether correct or not
    await MissionCompletion.findOneAndUpdate(
      { userId: req.user._id, missionId: mission._id },
      { 
        flagSubmitted: flag,
        completedAt: new Date(),
        pointsEarned: mission.points
      },
      { upsert: true, new: true }
    );

    if (flag === mission.flag) {
      // Update user's completed missions and score
      await User.findByIdAndUpdate(
        req.user._id,
        {
          $addToSet: { completedMissions: mission._id },
          $inc: { score: mission.points }
        }
      );

      res.json({
        success: true,
        message: 'Flag correct! Mission completed.',
        data: {
          pointsEarned: mission.points
        }
      });
    } else {
      res.status(400).json({
        success: false,
        message: 'Incorrect flag. Keep trying!'
      });
    }
  } catch (error) {
    console.error('Flag submission error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while submitting flag'
    });
  }
});

export default router;
