# AI Model Inventory Manager

A comprehensive web application for managing an inventory of AI models, built with React, Express, MongoDB, and Firebase authentication.

**Live Site:** [https://a10-r1d9h2dzs-nafim1122s-projects.vercel.app](https://a10-r1d9h2dzs-nafim1122s-projects.vercel.app)

## Features

- **User Authentication**: Secure login and registration with Firebase, including Google sign-in option and password validation
- **Model Management**: Full CRUD operations for AI model entries with details like name, framework, use case, dataset, and image uploads
- **Real-time Updates**: Live purchase counter updates using Server-Sent Events for immediate UI feedback
- **Advanced Filtering & Search**: Filter models by framework and search by name with MongoDB regex for efficient data retrieval
- **Responsive Design**: Mobile-first design that works seamlessly across all devices with consistent styling
- **Theme Toggle**: Dark/light mode toggle with persistent user preference stored in localStorage
- **Rating System**: User ratings for models (1-5 stars) with calculated average ratings stored in MongoDB
- **Private Routes**: Protected routes with Firebase Admin SDK verification and no redirect issues on page reload

## Tech Stack

- **Frontend**: React 18, Vite, React Router, Axios, Firebase Auth
- **Backend**: Node.js, Express.js, MongoDB, Firebase Admin SDK
- **Deployment**: Vercel (client), Render/Railway (server)
- **Styling**: CSS with responsive design principles and theme support

## Getting Started

1. Clone the repository
2. Install dependencies for both client and server
3. Set up environment variables for Firebase and MongoDB
4. Run the development servers
5. Access the application at localhost:5173 (client) and localhost:4000 (server)

## Project Structure

```text
├── client/          # React frontend
├── server/          # Express backend
├── README.md        # Project documentation
└── vercel.json      # Deployment configuration
```

## Contributing

This project demonstrates modern full-stack development practices with secure authentication, real-time features, and scalable architecture.
