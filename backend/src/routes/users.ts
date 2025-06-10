
import express, { Response } from 'express';
import { param, query, validationResult } from 'express-validator';
import User from '../models/User';
import Activity from '../models/Activity';
import MissionCompletion from '../models/MissionCompletion';
import { authMiddleware, AuthRequest, adminMiddleware } from '../middleware/auth';

const router = express.Router();

// @route   GET /api/users/profile
// @desc    Get user profile with activities
// @access  Private
router.get('/profile', authMiddleware, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: 'User not found'
      });
      return;
    }

    // Get user with populated completed missions
    const user = await User.findById(req.user._id)
      .populate('completedMissions', 'title points difficulty category')
      .populate('skills.skillId', 'name description category icon color')
      .select('-password');

    // Get recent activities
    const activities = await Activity.find({ userId: req.user._id })
      .sort({ createdAt: -1 })
      .limit(10);

    // Get mission completion stats
    const completionStats = await MissionCompletion.aggregate([
      { $match: { userId: req.user._id } },
      {
        $group: {
          _id: null,
          totalAttempts: { $sum: '$attempts' },
          totalHintsUsed: { $sum: '$hintsUsed' },
          totalTimeSpent: { $sum: '$timeSpent' },
          averageAttempts: { $avg: '$attempts' }
        }
      }
    ]);

    res.json({
      success: true,
      data: {
        user,
        activities,
        stats: completionStats[0] || {
          totalAttempts: 0,
          totalHintsUsed: 0,
          totalTimeSpent: 0,
          averageAttempts: 0
        }
      }
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching profile'
    });
  }
});

// @route   GET /api/users/leaderboard
// @desc    Get leaderboard
// @access  Private
router.get('/leaderboard', [
  authMiddleware,
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer')
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

    const limit = parseInt(req.query.limit as string) || 50;
    const page = parseInt(req.query.page as string) || 1;
    const skip = (page - 1) * limit;

    // Get top users by score
    const users = await User.find({ isActive: true })
      .select('name rank score completedMissions avatar')
      .sort({ score: -1 })
      .skip(skip)
      .limit(limit);

    // Get total count for pagination
    const totalUsers = await User.countDocuments({ isActive: true });

    // Find current user's position
    let userPosition = 0;
    if (req.user) {
      const usersAbove = await User.countDocuments({
        isActive: true,
        score: { $gt: req.user.score }
      });
      userPosition = usersAbove + 1;
    }

    // Add position to each user
    const leaderboard = users.map((user, index) => ({
      ...user.toObject(),
      position: skip + index + 1,
      totalMissions: user.completedMissions.length
    }));

    res.json({
      success: true,
      data: {
        leaderboard,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(totalUsers / limit),
          totalUsers,
          hasNext: page * limit < totalUsers,
          hasPrev: page > 1
        },
        userPosition
      }
    });
  } catch (error) {
    console.error('Get leaderboard error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching leaderboard'
    });
  }
});

// @route   GET /api/users/activities
// @desc    Get user activities
// @access  Private
router.get('/activities', [
  authMiddleware,
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('type').optional().isIn(['mission_completed', 'rank_promoted', 'hint_used', 'login', 'skill_improved']).withMessage('Invalid activity type')
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

    const limit = parseInt(req.query.limit as string) || 20;
    const page = parseInt(req.query.page as string) || 1;
    const skip = (page - 1) * limit;
    const type = req.query.type as string;

    const filter: any = { userId: req.user._id };
    if (type) {
      filter.type = type;
    }

    const activities = await Activity.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const totalActivities = await Activity.countDocuments(filter);

    res.json({
      success: true,
      data: {
        activities,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(totalActivities / limit),
          totalActivities,
          hasNext: page * limit < totalActivities,
          hasPrev: page > 1
        }
      }
    });
  } catch (error) {
    console.error('Get activities error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching activities'
    });
  }
});

// @route   GET /api/users/:id
// @desc    Get user by ID (Admin only)
// @access  Private/Admin
router.get('/:id', [
  authMiddleware,
  adminMiddleware,
  param('id').isMongoId().withMessage('Invalid user ID')
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

    const user = await User.findById(req.params.id)
      .populate('completedMissions', 'title points difficulty category')
      .select('-password');

    if (!user) {
      res.status(404).json({
        success: false,
        message: 'User not found'
      });
      return;
    }

    res.json({
      success: true,
      data: { user }
    });
  } catch (error) {
    console.error('Get user by ID error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching user'
    });
  }
});

// @route   GET /api/users
// @desc    Get all users (Admin only)
// @access  Private/Admin
router.get('/', [
  authMiddleware,
  adminMiddleware,
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('search').optional().isLength({ min: 1 }).withMessage('Search term must not be empty')
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

    const limit = parseInt(req.query.limit as string) || 50;
    const page = parseInt(req.query.page as string) || 1;
    const skip = (page - 1) * limit;
    const search = req.query.search as string;

    const filter: any = {};
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }

    const users = await User.find(filter)
      .select('-password')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const totalUsers = await User.countDocuments(filter);

    res.json({
      success: true,
      data: {
        users,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(totalUsers / limit),
          totalUsers,
          hasNext: page * limit < totalUsers,
          hasPrev: page > 1
        }
      }
    });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching users'
    });
  }
});

export default router;
