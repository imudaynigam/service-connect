require('dotenv').config();

const express = require('express');

const bodyParser = require('body-parser');

const cors = require('cors');

const jwt = require('jsonwebtoken');

const bcrypt = require('bcrypt');

const { Pool } = require('pg');

const { OAuth2Client } = require('google-auth-library');



const app = express();

const PORT = 5000;



// PostgreSQL pool configuration

const pool = new Pool({

  connectionString: process.env.DATABASE_URL || "postgresql://neondb_owner:cA1xPhVH8Lya@ep-red-boat-a5eey0rm.us-east-2.aws.neon.tech/neondb?sslmode=require",

  ssl: {

    rejectUnauthorized: false,

  },

});



// Google OAuth2 Client

const CLIENT_ID = process.env.CLIENT_ID || "915802858311-qetukeo74igokkehcue8rmc7am8vrbq9.apps.googleusercontent.com";

const client = new OAuth2Client(CLIENT_ID);



// JWT secret key

const SECRET_KEY = process.env.SECRET_KEY || 'your_jwt_secret_key';



// Middleware

app.use(cors());

app.use(bodyParser.json());



// Test database connection

pool.connect((err) => {

  if (err) {

    console.error('Database connection error:', err);

  } else {

    console.log('Connected to PostgreSQL database');

  }

});





// Regular Login Endpoint

app.post('/api/login', async (req, res) => {

  const { email, password } = req.body;



  try {

    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);

    if (result.rows.length === 0) {

      return res.status(401).json({ message: 'Invalid email or password' });

    }



    const user = result.rows[0];

    const isPasswordMatch = await bcrypt.compare(password, user.password_hash);



    if (!isPasswordMatch) {

      return res.status(401).json({ message: 'Invalid email or password' });

    }



    const token = jwt.sign({ id: user.id, email: user.email }, SECRET_KEY, { expiresIn: '1h' });

    res.json({ token });

  } catch (err) {

    console.error('Login error:', err);

    res.status(500).json({ message: 'Internal server error' });

  }

});



// Google login endpoint

app.post('/api/google-login', async (req, res) => {

  const { token: idToken } = req.body;



  try {

    const ticket = await client.verifyIdToken({

      idToken,

      audience: CLIENT_ID,

    });



    const payload = ticket.getPayload();

    const email = payload.email;



    // Check if user exists in the database

    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);

    let user = result.rows[0];



    if (!user) {

      // If user doesn't exist, create a new user with a placeholder password_hash

      const insertResult = await pool.query(

        'INSERT INTO users (email, password_hash) VALUES ($1, $2) RETURNING id',

        [email, 'GOOGLE_LOGIN']

      );

      user = insertResult.rows[0];

    }



    // Generate a JWT token for the user

    const jwtToken = jwt.sign({ id: user.id, email: user.email }, SECRET_KEY, { expiresIn: '1h' });

    res.json({ token: jwtToken });

  } catch (err) {

    console.error('Google login error:', err);

    res.status(500).json({ message: 'Internal server error' });

  }

});



// Start the server

app.listen(PORT, () => {

  console.log(`Server running on http://localhost:${PORT}`);


});