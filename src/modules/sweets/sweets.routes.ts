import { Router } from 'express';
import * as sweetsController from './sweets.controller';
import { authenticate, authorize } from '../../middleware/auth.middleware';

const router = Router();

router.get('/', sweetsController.getAllSweets);

// Protected Admin Routes
router.post(
    '/',
    authenticate,
    authorize(['ADMIN']),
    sweetsController.createSweet
);

router.put(
    '/:id',
    authenticate,
    authorize(['ADMIN']),
    sweetsController.updateSweet
);

router.delete(
    '/:id',
    authenticate,
    authorize(['ADMIN']),
    sweetsController.deleteSweet
);

export default router;
