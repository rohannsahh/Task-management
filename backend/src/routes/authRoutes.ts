import express from 'express';
import { body } from 'express-validator';
import { register, login } from '../controllers/authController';
import { validateRequest } from '../middleware/validate';

const router = express.Router();

router.post('/register', [
  body('email').isEmail().withMessage('Please enter a valid email'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long'),
  validateRequest as express.RequestHandler
], register);

router.post('/login', [
  body('email').isEmail().withMessage('Please enter a valid email'),
  body('password').notEmpty().withMessage('Password is required'),
  validateRequest as express.RequestHandler
], login);

export default router;