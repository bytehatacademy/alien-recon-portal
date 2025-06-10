
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
        completedId => completedId.toString() === mission._id.toString()
      );
      
      let isUnlocked = true;
      if (mission.unlockRequirement) {
        isUnlocked = completedMissions.some(
          completedId => completedId.toString() === mission.unlockRequirement?.toString()
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
  authMiddleware,
  param('id').isMongoId().withMessage('Invalid mission ID')
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
      isUnlocked = req.user.completedMissions.some(
        completedId => completedId.toString() === mission.unlockRequirement?.toString()
      );
    }

    if (!isUnlocked) {
      res.status(403).json({
        success: false,
        message: 'Mission is locked. Complete previous missions to unlock.'
      });
      return;
    }

    const isCompleted = req.user.completedMissions.some(
      completedId => completedId.toString() === mission._id.toString()
    );

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
// @desc    Submit flag for mission
// @access  Private
router.post('/:id/submit', [
  authMiddleware,
  param('id').isMongoId().withMessage('Invalid mission ID'),
  body('flag')
    .trim()
    .notEmpty()
    .withMessage('Flag is required')
    .matches(/^ARLab\{.*\}$/)
    .withMessage('Flag must follow ARLab{} format')
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

    if (!req.user) {
      res.status(401).json({
        success: false,
        message: 'User not found'
      });
      return;
    }

    const { flag } = req.body;
    const missionId = req.params.id;

    // Get mission with flag
    const mission = await Mission.findById(missionId);
    if (!mission || !mission.isActive) {
      res.status(404).json({
        success: false,
        message: 'Mission not found'
      });
      return;
    }

    // Check if already completed
    const existingCompletion = await MissionCompletion.findOne({
      userId: req.user._id,
      missionId: mission._id
    });

    if (existingCompletion) {
      res.status(400).json({
        success: false,
        message: 'Mission already completed'
      });
      return;
    }

    // Check if mission is unlocked
    let isUnlocked = true;
    if (mission.unlockRequirement) {
      isUnlocked = req.user.completedMissions.some(
        completedId => completedId.toString() === mission.unlockRequirement?.toString()
      );
    }

    if (!isUnlocked) {
      res.status(403).json({
        success: false,
        message: 'Mission is locked'
      });
      return;
    }

    // Validate flag
    if (flag.trim() !== mission.flag) {
      res.status(400).json({
        success: false,
        message: 'Incorrect flag'
      });
      return;
    }

    // Create mission completion record
    const completion = new MissionCompletion({
      userId: req.user._id,
      missionId: mission._id,
      flagSubmitted: flag,
      pointsEarned: mission.points,
      ipAddress: req.ip,
      userAgent: req.get('User-Agent')
    });

    await completion.save();

    // Update user
    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      {
        $push: { completedMissions: mission._id },
        $inc: { score: mission.points }
      },
      { new: true }
    );

    // Create activity log
    await Activity.create({
      userId: req.user._id,
      type: 'mission_completed',
      title: `Completed: ${mission.title}`,
      description: `Successfully completed ${mission.title}`,
      points: mission.points,
      metadata: {
        missionId: mission._id,
        difficulty: mission.difficulty,
        category: mission.category
      }
    });

    // Check for rank promotion
    if (updatedUser) {
      const oldRank = req.user.rank;
      const newRank = updatedUser.rank;
      
      if (oldRank !== newRank) {
        await Activity.create({
          userId: req.user._id,
          type: 'rank_promoted',
          title: `Rank promoted to ${newRank}`,
          description: `Promoted from ${oldRank} to ${newRank}`,
          metadata: {
            oldRank,
            newRank,
            totalScore: updatedUser.score
          }
        });
      }
    }

    res.json({
      success: true,
      message: 'Mission completed successfully!',
      data: {
        pointsEarned: mission.points,
        newScore: updatedUser?.score,
        newRank: updatedUser?.rank,
        completion
      }
    });
  } catch (error) {
    console.error('Submit flag error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while submitting flag'
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

export default router;
