import Offer from '../models/offer.model.js';
import { Car } from '../models/car.model.js';
import { successResponse, errorResponse } from '../utils/response.util.js';

export const createOffer = async (req, res) => {
  try {
    const { carId, offerPrice } = req.body;

    // Validate input
    if (!carId || !offerPrice) {
      return errorResponse(res, 400, 'Please provide all required fields');
    }

    const offer = await Offer.create({
      car: carId,
      buyer: req.userId,
      offerPrice,
    });

    await offer.populate(['car', 'buyer']);

    return successResponse(res, 201, offer, 'Offer created successfully');
  } catch (error) {
    return errorResponse(res, 500, error.message);
  }
};

export const getOffersByCarId = async (req, res) => {
  try {
    const offers = await Offer.find({ car: req.params.carId })
      .populate('buyer', 'name email')
      .sort({ createdAt: -1 });

    return successResponse(res, 200, offers, 'Offers fetched successfully');
  } catch (error) {
    return errorResponse(res, 500, error.message);
  }
};

export const getMyOffers = async (req, res) => {
  try {
    const offers = await Offer.find({ buyer: req.userId })
      .populate({
        path: 'car',
        populate: {
          path: 'seller',
          select: 'name email phone'
        }
      })
      .sort({ createdAt: -1 });

    return successResponse(res, 200, { offers }, 'Offers fetched successfully');
  } catch (error) {
    return errorResponse(res, 500, error.message);
  }
};

export const getSellerOffers = async (req, res) => {
  try {
    // Get all cars of the seller
    const sellerCars = await Car.find({ seller: req.userId });
    const carIds = sellerCars.map(car => car._id);

    // Get all offers for seller's cars
    const offers = await Offer.find({ car: { $in: carIds } })
      .populate('car')
      .populate('buyer', 'name email')
      .sort({ createdAt: -1 });

    return successResponse(res, 200, { offers }, 'Offers fetched successfully');
  } catch (error) {
    return errorResponse(res, 500, error.message);
  }
};

export const updateOfferStatus = async (req, res) => {
  try {
    const { status } = req.body;

    // Validate status
    if (!['pending', 'accepted', 'rejected'].includes(status)) {
      return errorResponse(res, 400, 'Invalid status');
    }

    const offer = await Offer.findById(req.params.id).populate('car');

    if (!offer) {
      return errorResponse(res, 404, 'Offer not found');
    }

    // Check if user is car seller
    if (offer.car.seller.toString() !== req.userId) {
      return errorResponse(res, 403, 'Not authorized to update this offer');
    }

    offer.status = status;
    await offer.save();

    return successResponse(res, 200, offer, 'Offer status updated successfully');
  } catch (error) {
    return errorResponse(res, 500, error.message);
  }
};
