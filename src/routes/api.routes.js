import express from 'express';
import { createUser, getUser, updateUser, deleteUser } from '../controllers/api.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';

const router = express.Router();

router.post('/users', createUser);
router.get('/users/:id', authenticate, getUser);
router.put('/users/:id', authenticate, updateUser);
router.delete('/users/:id', authenticate, deleteUser);

export default router;