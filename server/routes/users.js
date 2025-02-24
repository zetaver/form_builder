import express from 'express';
import * as userController from '../controllers/users.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.use(protect);

router.put('/profile', userController.updateProfile);
router.put('/password', userController.updatePassword);

export default router;