// routes/flashcardRoutes.ts
import { Router } from 'express';
import { getStacks, getStackCards, validateAnswer } from '../controllers/flashcardController';
import { requireAuth } from '../middleware/auth';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Flashcards
 *   description: Flashcard stack and validation operations
 */

/**
 * @swagger
 * /api/flashcards/stacks:
 *   get:
 *     summary: Get list of all flashcard stacks (lightweight)
 *     tags: [Flashcards]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of stacks retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 stacks:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                       name:
 *                         type: string
 *                       description:
 *                         type: string
 *                       totalCardCount:
 *                         type: number
 *                 ui:
 *                   type: object
 *                 message:
 *                   type: string
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 */
router.get('/stacks', requireAuth, getStacks);

/**
 * @swagger
 * /api/flashcards/stacks/{stackId}:
 *   get:
 *     summary: Get full flashcard stack by ID
 *     tags: [Flashcards]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: stackId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the stack to retrieve
 *     responses:
 *       200:
 *         description: Stack retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 name:
 *                   type: string
 *                 flashcards:
 *                   type: array
 *                   items:
 *                     type: object
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
router.get('/stacks/:stackId', requireAuth, getStackCards);

/**
 * @swagger
 * /api/flashcards/validate:
 *   post:
 *     summary: Validate user's answer for a flashcard
 *     tags: [Flashcards]
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
 *               - input
 *             properties:
 *               stackId:
 *                 type: string
 *               cardId:
 *                 type: string
 *               input:
 *                 type: string
 *     responses:
 *       200:
 *         description: Answer validated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 correct:
 *                   type: boolean
 *                 message:
 *                   type: string
 *       404:
 *         description: Stack or card not found
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
router.post('/validate', requireAuth, validateAnswer);

export default router;
