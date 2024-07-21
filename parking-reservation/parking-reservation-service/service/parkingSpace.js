const grpc = require('@grpc/grpc-js');
const { connection } = require('../model/database.js');

async function getParkingSpace(call, callback){
  const { request: { parking_space_id } } = call;
  try {
    await connection.connect((err) => {
      if (err) throw err;
      const sqlQuery = "SELECT * FROM ParkingSpace WHERE ParkingSpace.parking_space_id = ?";
      const queryValues = [parking_space_id]
      connection.query(sqlQuery, queryValues, (err, result, fields) => {
        if (err) throw err;
        callback(null, { parking_space: result });
      });
    });
  } catch (error) {
    console.error('Error fetching parking space:', error);
    callback({ code: grpc.status.INTERNAL, details: 'Unable to fetch parking space' });
  }
};

async function getParkingSpaceList(call, callback){
  try {
    await connection.connect((err) => {
      if (err) throw err;
      const sqlQuery = "SELECT * FROM ParkingSpace";
      connection.query(sqlQuery, (err, result, fields) => {
        if (err) throw err;
        callback(null, { parking_space: result });
      });
    });
  } catch (error) {
    console.error('Error fetching parking list:', error);
    callback({ code: grpc.status.INTERNAL, details: 'Unable to fetch parking list' });
  }
};

async function addParkingSpace(call, callback){
  const { request: { parking_space_type, building_name, address, price, is_available } } = call;
  try {
    await connection.connect((err) => {
      if (err) throw err;
      const sqlQuery = "INSERT INTO ParkingSpace (parking_space_type, building_name, address, price, is_available) VALUES (?, ?, ?, ?, ?)";
      const queryValues = [parking_space_type, building_name, address, price, is_available];
      connection.query(sqlQuery, queryValues, (err, result, fields) => {
        if (err) throw err;        
        callback(null, { message : "Added Parking Space record successfully" });
      });
    });
  } catch (error) {
    console.error('Error adding Parking Space record:', error);
    callback({ code: grpc.status.INTERNAL, details: 'Unable to add Parking Space record' });
  }
};

async function editParkingSpace(call, callback){
  const { request: { parking_space_id, parking_space_type, building_name, address, price, is_available } } = call;
  try {
    await connection.connect((err) => {
      if (err) throw err;
      const sqlQuery = "UPDATE ParkingSpace SET ParkingSpace.parking_space_type = ?, ParkingSpace.building_name = ?, ParkingSpace.address = ?, ParkingSpace.price = ?, ParkingSpace.is_available = ?  WHERE ParkingSpace.parking_space_id = ?";
      const queryValues = [parking_space_type, building_name, address, price, is_available, parking_space_id];
      connection.query(sqlQuery, queryValues, (err, result, fields) => {
        if (err) throw err;        
        callback(null, { message : "Edited Parking Space record successfully" });
      });
    });
  } catch (error) {
    console.error('Error editing Parking Space record:', error);
    callback({ code: grpc.status.INTERNAL, details: 'Unable to edit Parking Space record' });
  }
};

async function removeParkingSpace(call, callback){
  const { request: { parking_space_id } } = call;
  try {
    await connection.connect((err) => {
      if (err) throw err;
      const sqlQuery = "DELETE FROM ParkingSpace WHERE ParkingSpace.parking_space_id = ?";
      const queryValues = [parking_space_id];
      connection.query(sqlQuery, queryValues, (err, result, fields) => {
        if (err) throw err;        
        callback(null, { message : "Deleted Parking Space record successfully" });
      });
    });
  } catch (error) {
    console.error('Error removing parking space record:', error);
    callback({ code: grpc.status.INTERNAL, details: 'Unable to remove parking space record' });
  }
};

module.exports = {
  getParkingSpace,
  getParkingSpaceList,
  addParkingSpace,
  editParkingSpace,
  removeParkingSpace
};
