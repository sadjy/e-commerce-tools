import * as express from 'express';
import {
  getIdentity,
  createIdentityy,
  verifyIdentityy,
  signIdentityy,
  createVerifiablePresentationn,
  verifyVerifiablePresentationn
} from '../services/identity-context-service';

const router = express.Router();

router.get('/get-identity', getIdentity);
router.get('/create-identity', createIdentityy);
router.post('/sign-identity', signIdentityy);
router.post('/verify-identity', verifyIdentityy);
router.post('/create-verifiable-presentation', createVerifiablePresentationn);
router.post('/verify-verifiable-presentation', verifyVerifiablePresentationn);

export default router;
