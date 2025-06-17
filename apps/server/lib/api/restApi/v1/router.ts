import express from 'express';
import controllers from './controllers';

const router = express.Router();
const checkAccess = controllers.access.check;

router.get('/auth/log_in', controllers.auth.login);
router.post('/auth/callback', controllers.auth.cb);
router.post('/auth/refresh_token', controllers.auth.refresh);

router.get('/example', checkAccess, controllers.example.get);

export default router;
