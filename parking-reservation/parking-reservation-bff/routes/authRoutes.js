const express = require('express');
const authRoute = express.Router();
const { parkingReservationAuthClient } = require('../controllers/client.js');
const { verifyToken } = require('../lib/utils.js');

const Redis = require('ioredis');
const redis = new Redis(6379, "redis-publisher");

// Define the Redis channel to subscribe to
const redisChannel = 'email-notifications';

authRoute.post('/register', (req, res) => {
  try {
    parkingReservationAuthClient.register(req.body, (error, response) => {
      if (!error) {
        // console.log('User Registered', response);
        res.status(200);
        res.json(response);
        redis.publish(redisChannel, JSON.stringify({ message: "Hey Pub/Sub stuff" }));
        return response;
      } else {
        // console.error('Failed to Register User :', error); 
        return error;
      }
    });
  } catch(err){
    res.status(401);
    res.json(err);
  }
});

authRoute.post('/forgot/password', (req, res) => {
  try {
    console.log(req.body);
    parkingReservationAuthClient.forgotPassword(req.body, (error, response) => {

      if (!error) {
        // console.log('User logged in successfully', response);
        res.status(200);
        res.json(response);
        return response;
      } else {
        // console.error('Failed to login user :', error);
        return error;
      }
    });
  } catch(err){
    res.status(401);
    res.json(err);
  }
});

authRoute.post('/reset/password', (req, res) => {
  try {
    // console.log(req);
    parkingReservationAuthClient.resetPassword({ url_token: req.query.token, user_email: req.query.email, new_password: req.body.new_password, confirm_password: req.body.confirm_password }, (error, response) => {
      if (!error) {
        // console.log('User logged in successfully', response);
        res.status(200);
        res.json(response);
        return response;
      } else {
        // console.error('Failed to login user :', error);
        return error;
      }
    });
  } catch(err){
    res.status(401);
    res.json(err);
  }
});

authRoute.post('/login', (req, res) => {
  try {
    parkingReservationAuthClient.login(req.body, (error, response) => {
      if (!error) {
        // console.log('User logged in successfully', response);
        res.status(200);
        res.json(response);
        return response;
      } else {
        // console.error('Failed to login user :', error);
        return error;
      }
    });
  } catch(err){
    res.status(401);
    res.json(err);
  }
});

authRoute.get('/user/:userId', verifyToken, (req, res) => {
  try {
    parkingReservationAuthClient.getUser({ user_id: req.params.userId }, (error, response) => {
      if (!error) {
        // console.log('Retrieved user info successfully', response);
        res.status(200);
        res.json(response);
        return response;
      } else {
        // console.error('Failed to get user info', error);
        return error;
      }
    });
  } catch(err){
    res.status(401);
    res.json(err);
  }
});

module.exports = authRoute;
