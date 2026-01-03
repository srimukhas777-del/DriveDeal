# Car Marketplace - Backend

A Node.js and Express-based backend API for the Car Marketplace application. Built with MongoDB for data persistence and Cloudinary for image hosting.

## Features

- User authentication with JWT
- Car listing management (CRUD operations)
- Car image upload to Cloudinary
- Offer management system
- Search and filter cars
- User authorization and access control
- RESTful API architecture

## Tech Stack

- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB ODM
- **JWT** - Authentication
- **Bcryptjs** - Password hashing
- **Cloudinary** - Image hosting
- **Multer** - File upload handling

## Project Structure

```
src/
├── config/          # Configuration files
├── controllers/     # Route controllers
├── middleware/      # Custom middleware
├── models/          # Mongoose schemas
├── routes/          # API routes
├── utils/           # Utility functions
├── app.js           # Express app setup
└── index.js         # Entry point
```

## Installation

1. Clone the repository
2. Install dependencies:
```bash
npm install
```

3. Create `.env` file with required environment variables:
```
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
PORT=5000
NODE_ENV=development
```

4. Start the server:
```bash
npm run dev
```

The API will run on `http://localhost:5000`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (protected)

### Cars
- `GET /api/cars` - Get all cars
- `GET /api/cars/:id` - Get car by ID
- `GET /api/cars/search` - Search cars
- `POST /api/cars` - Create car (protected)
- `PUT /api/cars/:id` - Update car (protected)
- `DELETE /api/cars/:id` - Delete car (protected)

### Offers
- `POST /api/offers` - Create offer (protected)
- `GET /api/offers/car/:carId` - Get offers for a car
- `GET /api/offers/my-offers` - Get my offers (protected)
- `PUT /api/offers/:id` - Update offer status (protected)

## Environment Variables

Required environment variables in `.env`:
- `MONGODB_URI` - MongoDB connection string
- `JWT_SECRET` - Secret key for JWT signing
- `CLOUDINARY_CLOUD_NAME` - Cloudinary account name
- `CLOUDINARY_API_KEY` - Cloudinary API key
- `CLOUDINARY_API_SECRET` - Cloudinary API secret
- `PORT` - Server port (default: 5000)
- `NODE_ENV` - Environment type (development/production)

## License

MIT
