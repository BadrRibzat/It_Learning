// routes/progressRoutes.ts
import { Router } from 'express';
import { requireAuth } from '../middleware/auth';
import { 
  getProgress, 
  getRing, 
  submitCard, 
  getFailed, 
  resetProgress,
  getChecklist
} from '../controllers/progressController';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Progress
 *   description: User progress tracking and management
 */

/**
 * @swagger
 * /api/progress/:
 *   get:
 *     summary: Get full user progress document
 *     tags: [Progress]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User progress retrieved
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 progress:
 *                   $ref: '#/components/schemas/UserProgress'
 *                 message:
 *                   type: string
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 */
router.get('/', requireAuth, getProgress);

/**
 * @swagger
 * /api/progress/ring/{stackId}:
 *   get:
 *     summary: Get progress ring data (completed vs total) for a stack
 *     tags: [Progress]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: stackId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Ring data retrieved
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 completed:
 *                   type: number
 *                 total:
 *                   type: number
 *                 label:
 *                   type: string
 *                 message:
 *                   type: string
 *       404:
 *         description: Stack not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 */
router.get('/ring/:stackId', requireAuth, getRing);

/**
 * @swagger
 * /api/progress/submit:
 *   post:
 *     summary: Submit flashcard answer and update progress
 *     tags: [Progress]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - stackId
 *               - cardId
 *               - correct
 *               - answer
 *             properties:
 *               stackId:
 *                 type: string
 *               cardId:
 *                 type: string
 *               correct:
 *                 type: boolean
 *               answer:
 *                 type: string
 *     responses:
 *       200:
 *         description: Submission saved
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 stacks:
 *                   $ref: '#/components/schemas/StackProgress'
 *                 message:
 *                   type: string
 *       404:
 *         description: Stack not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 */
router.post('/submit', requireAuth, submitCard);

/**
 * @swagger
 * /api/progress/failed/{stackId}:
 *   get:
 *     summary: Get list of failed cards for a stack
 *     tags: [Progress]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: stackId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Failed cards retrieved
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 failed:
 *                   type: array
 *                   items:
 *                     type: string
 *                 lastSubmitted:
 *                   type: object
 *                 message:
 *                   type: string
 *       404:
 *         description: Stack not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 */
router.get('/failed/:stackId', requireAuth, getFailed);

/**
 * @swagger
 * /api/progress/reset/{stackId}:
 *   post:
 *     summary: Reset progress for a stack (or 'all')
 *     tags: [Progress]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: stackId
 *         required: true
 *         schema:
 *           type: string
 *         description: Stack ID or 'all' to reset everything
 *     responses:
 *       200:
 *         description: Progress reset successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       404:
 *         description: Stack not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 */
router.post('/reset/:stackId', requireAuth, resetProgress);

/**
 * @swagger
 * /api/progress/checklist/{stackId}:
 *   get:
 *     summary: Get boolean checklist of passed cards for a stack
 *     tags: [Progress]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: stackId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Checklist retrieved
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 passed:
 *                   type: array
 *                   items:
 *                     type: boolean
 *                 message:
 *                   type: string
 *       404:
 *         description: No progress found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 passed:
 *                   type: array
 *                   items:
 *                     type: boolean
 *                 message:
 *                   type: string
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 */
router.get('/checklist/:stackId', requireAuth, getChecklist);

export default router;
