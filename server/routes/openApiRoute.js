import express from 'express';
import { generateImage } from '../controllers/openAPIController.js';

const router = express.Router();

router.route("/").post(generateImage);

export default router;