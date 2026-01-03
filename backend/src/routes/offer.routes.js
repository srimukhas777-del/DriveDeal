import express from 'express';
import {
  createOffer,
  getOffersByCarId,
  getMyOffers,
  getSellerOffers,
  updateOfferStatus,
} from '../controllers/offer.controller.js';
import { authMiddleware } from '../middleware/auth.middleware.js';

const router = express.Router();

router.post('/', authMiddleware, createOffer);
router.get('/my-offers', authMiddleware, getMyOffers);
router.get('/seller-offers', authMiddleware, getSellerOffers);
router.get('/car/:carId', getOffersByCarId);
router.put('/:id', authMiddleware, updateOfferStatus);

export default router;
