import { Router } from 'express';
import * as purchasesController from './purchases.controller';
import { authenticate } from '../../middleware/auth.middleware';

const router = Router();

// Endpoint structure based on requirements: POST /api/sweets/:id/purchase
// Note: Usually routing would be /api/purchases, but adhering to requested design /api/sweets/:id/purchase
// Since this is mounted at /api/sweets in app.ts, we need to handle the structure accordingly. 
// Wait, the plan said "POST /api/sweets/:id/purchase". 
// In app.ts, we mounted sweetsRoutes at /api/sweets. 
// So sweetRoutes handles / (GET), /:id (PUT/DELETE).
// It would be cleaner to add this purchase route to sweets.routes.ts OR create a new router.
// Given strict folder structure "modules/purchases", I should probably keep the implementation here 
// but mounting might need adjustment or I mount this router at /api/sweets too (merging) or handled explicitly.

// Let's check app.ts mounting again. 
// /api/sweets -> sweetsRoutes. 
// If I want /api/sweets/:id/purchase, I can add it to sweetsRoutes calling purchasesController
// OR I can mount purchasesRoutes at /api/sweets as well (Express allows multiple routers on same path).
// Let's stick to the module separation and export the router, then mount it.

router.post(
    '/:id/purchase',
    authenticate,
    purchasesController.purchaseSweet
);

export default router;
