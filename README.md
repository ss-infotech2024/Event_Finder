# Event Finder

Event Finder is a full-stack web application that allows users to discover, create, and manage events.

## Features

- User authentication (register, login, logout)
- Browse events by categories
- Search and filter events
- View event details
- Create, edit, and delete events
- Image upload for events
- Trending and recommended events

## Technology Stack

### Frontend

- React
- React Router
- Axios for API requests
- Context API for state management
- Custom CSS for styling

### Backend

- Node.js
- Express.js
- MongoDB with Mongoose
- JSON Web Tokens (JWT) for authentication
- bcrypt for password hashing

## Project Structure

```
event-finder/           # Frontend React application
  ├── public/
  ├── src/
  │   ├── components/   # Reusable UI components
  │   ├── context/      # Context providers
  │   ├── pages/        # Page components
  │   ├── services/     # API service functions
  │   ├── styles/       # CSS files
  │   ├── utils/        # Utility functions
  │   └── App.js        # Main application component
  └── package.json

server-side/            # Backend Node.js application
  ├── controllers/      # Request handlers
  ├── middleware/       # Custom middleware
  ├── models/           # MongoDB schemas
  ├── routes/           # API route definitions
  └── server.js         # Entry point
```

## Setup Instructions

### Prerequisites

- Node.js (v14 or higher)
- MongoDB

### Installation

1. Clone the repository:

   ```
   git clone https://github.com/SyedTanseer/Event-Finder.git
   cd Event-Finder
   ```

2. Install backend dependencies:

   ```
   cd server-side
   npm install
   ```

3. Install frontend dependencies:

   ```
   cd ../event-finder
   npm install
   ```

4. Create a `.env` file in the server-side directory:
   ```
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/event-finder
   JWT_SECRET=your_jwt_secret
   ```

### Running the Application

1. Start the backend server:

   ```
   cd server-side
   npm start
   ```

2. Start the frontend development server:

   ```
   cd ../event-finder
   npm start
   ```

3. Open your browser and navigate to `https://event-finder-backend-4qye.onrender.com`

## API Endpoints

### Authentication

- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login a user
- `GET /api/auth/user` - Get authenticated user data

### Events

- `GET /api/events` - Get all events (with optional filters)
- `GET /api/events/trending` - Get trending events
- `GET /api/events/recommended` - Get recommended events
- `GET /api/events/:id` - Get a single event by ID
- `POST /api/events` - Create a new event
- `PUT /api/events/:id` - Update an event
- `DELETE /api/events/:id` - Delete an event

## License

This project is licensed under the MIT License.
