Welcome to the Outh Game backend! This backend powers the multiplayer gaming platform, allowing users to register, log in, add friends, and start real-time duels in games like Checkers and Snakes & Ladders.

# 🚀 Features

User authentication (Signup, Login, JWT-based auth)

Friendship system (Send, accept, reject friend requests)

Real-time communication (WebSocket integration for game invites)

Game matchmaking and status tracking

MongoDB database connection for persistent data

# 📌 Tech Stack

Backend Framework: Node.js + Express

Database: MongoDB (via Mongoose)

Authentication: JWT (JSON Web Token)

WebSockets: Socket.io

Deployment: Netlify Serverless Functions

# 📂 Project Structure

backend/
│── netlify/functions/
│   ├── server.js          # Main server file
│   ├── authRoutes.js      # User authentication routes
│   ├── friendRoutes.js    # Friendship management routes
│   ├── gameRoutes.js      # Game session routes (TBD)
│   ├── socketServer.js    # WebSocket server for real-time updates
│   ├── middleware/
│   │   ├── authMiddleware.js  # Middleware to protect routes
│   ├── models/
│   │   ├── UserModel.js       # User schema (MongoDB)
│   │   ├── FriendshipModel.js # Friend request schema
│   │   ├── GameModel.js       # Game session schema (TBD)
│── .env                   # Environment variables (MongoDB URI, JWT Secret)
│── package.json           # Dependencies & scripts
│── netlify.toml           # Netlify build configuration

⚙️ Setup & Installation

1️⃣ Clone the repository

# git clone https://github.com/yourusername/outh-game-backend.git
# cd outh-game-backend

2️⃣ Install dependencies

# npm install

3️⃣ Configure environment variables

Create a .env file in the root directory and add:

MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
NODE_ENV=development

4️⃣ Run the server locally

# cd netlify/functions
# node serve.js

The server should start on http://localhost:5000.

🚀 Deployment on Netlify

The backend is deployed as serverless functions on Netlify.

Install Netlify CLI (if not already installed)

# npm install -g netlify-cli

Deploy to Netlify

netlify deploy --prod


Get list of friends

🔥 Future Features

Game session management

Leaderboard and ranking system

Chat messaging between players

More games!

📧 Need help? Contact me at danielkomoe78@gmail.com