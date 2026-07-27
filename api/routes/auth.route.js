import express from 'express';
import { test } from '../controllers/auth.controller';

const router = express.Router();

router.post('/signup' ,signup);

export default router;