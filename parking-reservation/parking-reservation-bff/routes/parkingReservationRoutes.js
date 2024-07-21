const express = require('express');
const parkingReservation = express.Router();
const { parkingReservationClient }= require('../controllers/client.js');
const { verifyToken } = require('../lib/utils.js');

parkingReservation.get('/list', verifyToken, (req, res) => {
  try {
    parkingReservationClient.getParkingSpaceList({}, (error, response) => {
      if (!error) {
        // console.log('Parking Space List fetched:', response);
        res.status(200);
        res.json(response);
        return response;
      } else {
        // console.error('Failed to fetch Parking List:', error);
        return error;
      }
    });
  } catch(err){
    res.status(401);
    res.json(err);
  }
});

parkingReservation.post('/reserve', verifyToken, (req, res) => {
  try {
    parkingReservationClient.reserveParking(req.body, (error, response) => {
      if (!error) {
        // console.log('Parking Space List fetched:', response);
        res.status(200);
        res.json(response);
        return response;
      } else {
        // console.error('Failed to fetch Parking List:', error);
        return error;
      }
    });
  } catch(err){
    res.status(401);
    res.json(err);
  }
});

parkingReservation.get('/cancel', verifyToken, (req, res) => {
  try {
    parkingReservationClient.cancelParkingReservation(req.body, (error, response) => {
      if (!error) {
        // console.log('Parking Space List fetched:', response);
        res.status(200);
        res.json(response);
        return response;
      } else {
        // console.error('Failed to fetch Parking List:', error);
        return error;
      }
    });
  } catch(err){
    res.status(401);
    res.json(err);
  }
});

module.exports = parkingReservation;
