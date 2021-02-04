import * as express from 'express';
import { getIdentity, createIdentityy, verifyIdentityy, signIdentityy } from '../services/identity-context-service';

const router = express.Router();

router.get('/get-identity', getIdentity);
router.get('/create-identity', createIdentityy);
router.post('/sign-identity', signIdentityy);
router.get('/verify-identity', verifyIdentityy);

export default router;
