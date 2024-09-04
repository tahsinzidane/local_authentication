# local_authentication
just collecting some backend complex code 

## Local Authentication System with Passport.js

This repository contains a backend implementation of a local authentication system using Passport.js, integrated with Express.js, EJS, and MongoDB via Mongoose. The project showcases a comprehensive approach to handling user authentication, including features such as user registration, login, session management, and secure password storage with bcrypt.

### Key Features
 - Express.js Integration: Utilizes Express.js to manage server-side routing and middleware.

 - Passport.js Authentication: Implements local strategy for user authentication, including handling of login and registration flows.

  - MongoDB with Mongoose: Stores user data securely in MongoDB, with Mongoose providing an elegant MongoDB object modeling for Node.js.
  
  - EJS Templating: Renders dynamic content with EJS, providing a seamless user experience

 - Secure Password Handling: Passwords are hashed using bcrypt to ensure security.

 -  Session Management: Maintains user sessions with Passport.js and Express-session for a persistent login state.

 ## how to use
 ### Prerequisites

 - node js (v14 or hiher)
 - mongodb (locally or using a cloud service like MongoDB Atlas)

 ### Setup Instructions

- clone repo:
````
git clone https://github.com/your-username/local_authentication.git
cd local_authentication
````
- Install Dependencies:
````
npm install
````
- Environment Variables:
````
PORT=3000
MONGO_URI=mongodb://localhost:27017/authDB
SESSION_SECRET=your_secret_key_here
`````
- `PORT` : port of the server
- `MONGO_URI`:  Secret key for signing session cookies.

- Run the Application:
````
npm start
````
The server should now be running on
`http://localhost:3000`

### Project Structure
````
local_authentication/
├── views/
│   ├── index.ejs      # Home and registration page
│   └── login.ejs      # Login page
├── routes/
│   ├── index.js       # Main route definitions
│   └── admin.js       # Example of additional routes
├── models/
│   └── users.js       # Mongoose user schema and model
├── middleware/
│   └── auth.js        # Authentication middleware
├── app.js             # Express app setup
├── package.json       # Project metadata and dependencies
└── .env               # Environment variables
`````
### Adding Routes
 - Creating Middleware for Authentication
 ````
 // middleware/auth.js

function isAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next(); // User is authenticated, proceed
  } else {
    res.redirect('/login'); // Redirect to login if not authenticated
  }
}

module.exports = isAuthenticated;
````
 - Applying Middleware Globally
 In your app.js, use the middleware globally to protect all routes:

````
const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');
const expressSession = require('express-session');
const path = require('path');
const isAuthenticated = require('./middleware/auth'); // Import the middleware

const app = express();

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.urlencoded({ extended: false }));
app.use(expressSession({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

// Apply the authentication middleware globally
app.use(isAuthenticated);

// Define routes
app.use('/', require('./routes/index')); // Main routes
app.use('/admin', require('./routes/admin')); // Example of additional routes

app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});
````
### Adding More Routes
To add more routes:
 - Create a new router module in the routes/ directory.
 - Define routes in the new module.
 - Integrate the new module in `app.js` using `app.use()`.

Example of creating a new route module
`routes/admin.js`
````
const express = require('express');
const router = express.Router();

// Define new routes
router.get('/dashboard', (req, res) => {
  res.send('Admin Dashboard');
});

router.get('/settings', (req, res) => {
  res.send('Admin Settings');
});

module.exports = router;
````
## Conclusion
This setup provides a solid foundation for a secure and modular local authentication system. Feel free to extend it with more routes and features as needed. Happy coding!