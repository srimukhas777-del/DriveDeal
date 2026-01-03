# Car Marketplace - Frontend

A modern React-based frontend for the Car Marketplace application built with Vite, React Router, and Tailwind CSS.

## Features

- Browse and search for cars
- User authentication (Login/Register)
- Add new cars for sale
- View detailed car information
- Responsive design with Tailwind CSS
- Protected routes for authenticated users
- Real-time API integration

## Tech Stack

- **React 18** - UI library
- **Vite** - Build tool and dev server
- **React Router v6** - Client-side routing
- **Axios** - HTTP client
- **Tailwind CSS** - Utility-first CSS framework

## Project Structure

```
src/
├── api/              # API integration
├── assets/           # Static assets
├── components/       # Reusable components
├── context/          # React Context providers
├── hooks/            # Custom React hooks
├── layout/           # Layout components
├── pages/            # Page components
├── router/           # Router configuration
└── styles/           # Global styles
```

## Installation

1. Install dependencies:
```bash
npm install
```

2. Create `.env.local` file:
```
VITE_API_URL=http://localhost:5000/api
```

3. Start the development server:
```bash
npm run dev
```

The application will run on `http://localhost:3000`

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

## Environment Variables

- `VITE_API_URL` - Backend API URL (defaults to `http://localhost:5000/api`)

## License

MIT
