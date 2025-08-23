import express from 'express';
import verifyAuth from '../middleware/verifyAuth.js';

const router = express.Router();

router.get('/', verifyAuth, (req, res) => {
  res.json({ 
    authenticated: true, 
    user: req.user 
  });
});

export default router;