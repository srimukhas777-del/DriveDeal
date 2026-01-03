# Car Marketplace - Complete Setup & Integration Guide

## Project Overview
A full-stack car marketplace application with React frontend and Node.js/Express backend, featuring:
- ✅ User authentication (Register/Login with JWT)
- ✅ Car listing CRUD operations
- ✅ Image uploads (Cloudinary)
- ✅ Offer system for buyers
- ✅ Seller dashboard
- ✅ Search functionality

---

## Backend Setup (Node.js/Express)

### Current Status
- ✅ Server running on port 5000
- ✅ MongoDB connection configured
- ✅ All API routes implemented
- ✅ Authentication middleware in place

### To Start Backend:
```bash
cd backend
npm run dev  # Uses nodemon for auto-reload
```

### Backend Files Structure:
```
backend/src/
├── config/
│   ├── db.js           # MongoDB connection
│   └── cloudinary.js   # Image upload config
├── controllers/
│   ├── auth.controller.js    # Auth endpoints
│   ├── car.controller.js     # Car CRUD
│   └── offer.controller.js   # Offer endpoints
├── middleware/
│   ├── auth.middleware.js    # JWT verification
│   └── upload.middleware.js  # Multer config
├── models/
│   ├── user.model.js   # User schema
│   ├── car.model.js    # Car schema
│   └── offer.model.js  # Offer schema
├── routes/
│   ├── auth.routes.js  # POST /auth/register, /auth/login, GET /auth/profile
│   ├── car.routes.js   # CRUD routes for cars
│   └── offer.routes.js # Offer endpoints
└── app.js
```

### API Endpoints

#### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user (returns JWT token)
- `GET /api/auth/profile` - Get logged-in user profile (Protected)

#### Cars
- `GET /api/cars` - Get all available cars
- `GET /api/cars/:id` - Get car details
- `POST /api/cars` - Create new car listing (Protected, multipart/form-data)
- `PUT /api/cars/:id` - Update car (Protected)
- `DELETE /api/cars/:id` - Delete car (Protected)
- `GET /api/cars/user/mine` - Get seller's cars (Protected)

#### Offers
- `POST /api/offers` - Make offer on a car (Protected)
- `GET /api/offers/car/:carId` - Get offers for a car
- `GET /api/offers/my-offers` - Get buyer's offers (Protected)
- `PUT /api/offers/:id` - Accept/Reject offer (Protected)

### Environment Variables (.env)
```
PORT=5000
MONGO_URI=mongodb+srv://YOUR_USER:YOUR_PASSWORD@YOUR_CLUSTER.mongodb.net/?appName=YOUR_APP
JWT_SECRET=your-super-secret-key
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

---

## Frontend Setup (React + Vite)

### Current Status
- ✅ All pages created and integrated
- ✅ API layer configured with auth interceptors
- ✅ Authentication context implemented
- ✅ All components styled with Tailwind CSS

### To Start Frontend:
```bash
cd frontend
npm run dev  # Runs on http://localhost:3000
```

### Frontend Files Structure:
```
frontend/src/
├── pages/
│   ├── HomePage.jsx           # Browse all cars
│   ├── LoginPage.jsx          # User login
│   ├── RegisterPage.jsx       # User registration
│   ├── CarDetailPage.jsx      # View car & make offer
│   ├── AddCarPage.jsx         # Seller: List new car (sell-car route)
│   ├── MyMyCarsPage.jsx       # Seller: Manage listings (/my-cars)
│   ├── EditCarPage.jsx        # Seller: Edit car listing
│   └── SearchPage.jsx         # Shows buyer's offers (/my-offers)
├── components/
│   ├── Navbar.jsx             # Navigation with search
│   ├── CarCard.jsx            # Car listing card
│   ├── Loader.jsx             # Loading spinner
│   └── Footer.jsx             # Footer component
├── hooks/
│   └── useAuth.jsx            # Custom auth hook
├── context/
│   └── AuthContext.jsx        # Global auth state
├── api/
│   ├── axios.config.js        # HTTP client with interceptors
│   └── car.api.js             # API endpoints (carAPI, authAPI, offerAPI)
├── layout/
│   └── MainLayout.jsx         # Main app layout
├── router/
│   └── index.jsx              # Route configuration (ProtectedRoute)
└── App.jsx
```

### Frontend Routes

| Route | Component | Protection | Purpose |
|-------|-----------|-----------|---------|
| `/` | HomePage | Public | Browse all cars |
| `/login` | LoginPage | Public | User login |
| `/register` | RegisterPage | Public | User registration |
| `/car/:id` | CarDetailPage | Public | View car details & make offer |
| `/search` | SearchPage | Public | Search cars (query param) |
| `/sell-car` | AddCarPage | Protected | List new car for sale |
| `/my-cars` | MyMyCarsPage | Protected | Seller dashboard - manage listings |
| `/edit-car/:id` | EditCarPage | Protected | Edit existing car listing |
| `/my-offers` | SearchPage (MyOffers) | Protected | View buyer's offers on cars |

### API Layer Integration
```javascript
// car.api.js exports:
carAPI.getAllCars()           // GET /cars
carAPI.getCarById(id)         // GET /cars/:id
carAPI.createCar(formData)    // POST /cars (multipart)
carAPI.updateCar(id, data)    // PUT /cars/:id
carAPI.deleteCar(id)          // DELETE /cars/:id
carAPI.getMyCars()            // GET /cars/user/mine

authAPI.register(userData)    // POST /auth/register
authAPI.login(credentials)    // POST /auth/login
authAPI.getProfile()          // GET /auth/profile

offerAPI.createOffer(carId, offerData)     // POST /offers
offerAPI.getOffersByCarId(carId)           // GET /offers/car/:carId
offerAPI.getMyOffers()                     // GET /offers/my-offers
offerAPI.updateOfferStatus(offerId, status) // PUT /offers/:id
```

### Environment Variables (.env.local)
```
VITE_API_URL=http://localhost:5000/api
```

---

## Features Implemented

### ✅ Authentication
- User registration with validation
- JWT-based login (7-day expiry)
- Automatic token refresh on protected routes
- Logout with token cleanup

### ✅ Car Management (Sellers)
- List cars with multiple images (up to 5)
- Edit car details and images
- Delete listings
- View seller dashboard with all listings
- Status tracking (Available/Sold/Pending)

### ✅ Car Browsing (Buyers)
- View all available cars with pagination
- View detailed car information
- Image gallery with navigation
- Seller information display
- Status badges with color coding

### ✅ Offer System (Buyers)
- Make offers on cars
- View all sent offers
- See offer status (pending/accepted/rejected)
- Track offer prices vs car prices

### ✅ Search & Navigation
- Search cars by brand/model
- Navigation bar with auth-based menu
- Protected routes for authenticated users
- Automatic redirect to login for restricted pages

### ✅ UI/UX
- Responsive Tailwind CSS design
- Loading states for async operations
- Error handling with user-friendly messages
- Image upload with preview and removal
- Form validation

---

## Quick Start - Complete Flow

### 1. Start Backend
```bash
cd backend
npm install
npm run dev
```
Backend will run at http://localhost:5000

### 2. Start Frontend  
```bash
cd frontend
npm install
npm run dev
```
Frontend will run at http://localhost:3000

### 3. Test Registration
- Navigate to http://localhost:3000
- Click "Register"
- Fill in name, email, password
- Password must be at least 6 characters

### 4. Test Login
- Click "Login"
- Use credentials from registration

### 5. Test Seller Features
- Click "Sell Car"
- Fill form with car details
- Upload images (1-5 images)
- Submit to create listing

### 6. Test Buyer Features
- View cars on homepage
- Click on car to see details
- Make offer with custom price
- View offers in "My Offers"

---

## Troubleshooting

### Frontend Won't Connect to Backend
1. Check backend is running on port 5000
2. Verify `.env.local` has `VITE_API_URL=http://localhost:5000/api`
3. Check browser console for CORS errors
4. Ensure token is saved in localStorage after login

### MongoDB Connection Issues
1. Verify connection string in backend `.env`
2. Check internet connection if using MongoDB Atlas
3. Ensure cluster IP whitelist includes your machine

### Images Not Uploading
1. Verify Cloudinary credentials in backend `.env`
2. Check form uses `enctype="multipart/form-data"`
3. Ensure files are sent via FormData (not JSON)

### Routes Not Found
1. Clear browser cache and localStorage
2. Restart both frontend and backend
3. Check route names match exactly (case-sensitive)

---

## Database Schema Overview

### User Model
```javascript
{
  name: String (required),
  email: String (required, unique),
  password: String (hashed, required),
  createdAt: Date
}
```

### Car Model
```javascript
{
  title: String (required),
  brand: String (required),
  model: String (required),
  year: Number (required),
  price: Number (required),
  mileage: Number (required),
  fuelType: String (enum: Petrol/Diesel/CNG/Hybrid/Electric),
  transmission: String (enum: Manual/Automatic),
  description: String,
  images: [String] (up to 5 URLs),
  status: String (enum: Available/Sold/Pending),
  seller: ObjectId (ref: User),
  createdAt: Date
}
```

### Offer Model
```javascript
{
  car: ObjectId (ref: Car),
  buyer: ObjectId (ref: User),
  offerPrice: Number,
  status: String (enum: pending/accepted/rejected),
  createdAt: Date
}
```

---

## Next Steps for Production

1. **Environment Variables**: Use secure vault (AWS Secrets, HashiCorp Vault)
2. **CORS Configuration**: Update with production domain
3. **API Rate Limiting**: Implement rate limiting on backend
4. **Error Logging**: Add centralized error logging (Sentry, LogRocket)
5. **Database**: Switch to MongoDB Atlas with production credentials
6. **Deployment**: Deploy frontend to Vercel/Netlify, backend to Heroku/Railway
7. **SSL/HTTPS**: Enable HTTPS for all communications
8. **Testing**: Add unit and integration tests

---

## Support
For issues or questions, check the troubleshooting section or review the component implementations.

Happy selling! 🚗
