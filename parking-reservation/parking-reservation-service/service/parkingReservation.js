const grpc = require('@grpc/grpc-js');
const { connection } = require('../model/database.js');

async function reserveParking(call, callback){
  const { request: { parking_space_id, user_id, vehicle_id, status, duration } } = call;
  try {
    await connection.connect((err) => {
      if (err) throw err;
      const sqlQuery = "INSERT INTO ParkingReservation (parking_space_id, user_id, vehicle_id, status, duration, created_at, updated_at) VALUES (?, ?, ?, ?, ?, NOW(), NOW())";
      const queryValues = [call.parking_space_id, call.user_id, call.vehicle_id, call.status, call.duration];
      connection.query(sqlQuery, queryValues, (err, result, fields) => {
        if (err) throw err;
        callback(null, { message : "Added Parking Reservation record successfully" });
      });
    });
  } catch (error) {
    console.error('Error Reservating Parking:', error);
    callback({ code: grpc.status.INTERNAL, details: 'Unable to reserve parking' });
  }
};

async function cancelParkingReservation(call, callback){
  const { request: { status, user_id, parking_space_id } } = call;
  try {
    await connection.connect((err) => {
      if (err) throw err;
      const sqlQuery = "UPDATE ParkingReservation SET ParkingReservation.status = ? WHERE ParkingReservation.user_id = ? AND ParkingReservation.parking_space_id = ?";
      const queryValues = [call.status, call.user_id, call.parking_space_id];
      connection.query(sqlQuery, queryValues, (err, result, fields) => {
        if (err) throw err;
        callback(null, { message : "Updated Parking Reservation record successfully" });
      });
    });
  } catch (error) {
    console.error('Error cancelling parking reservation:', error);
    callback({ code: grpc.status.INTERNAL, details: 'Unable to cancel parking reservation' });
  }
};

module.exports = {
  reserveParking,
  cancelParkingReservation
};
