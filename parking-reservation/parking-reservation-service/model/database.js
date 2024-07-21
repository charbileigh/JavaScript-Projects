const mysql = require('mysql2');

// Database configuration
const connection = mysql.createConnection({
  host: "mysql-parking-service-db",
  user: "root",
  password: "password",
  database: "parkingreservationDB",
});

// Create the Parking table
connection.connect((err) => {
  if (err) throw err;
  connection.query(`
  CREATE TABLE IF NOT EXISTS ParkingSpace (
    parking_space_id INT PRIMARY KEY AUTO_INCREMENT,
    parking_space_type VARCHAR(255) NOT NULL,
    building_name TEXT NOT NULL,
    address TEXT NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    is_available BOOLEAN
  )`, (err, result, fields) => {
    if (err) throw err;
  });
});

// Create the Vehicle table
connection.connect((err) => {
  if (err) throw err;
  connection.query(`
  CREATE TABLE IF NOT EXISTS Vehicle (
    vehicle_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    vehicle_name VARCHAR(255) NOT NULL,
    vehicle_license_plate VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
  )`, (err, result, fields) => {
    if (err) throw err;
  });
});

// Create the ParkingReservation table
connection.connect((err) => {
  if (err) throw err;
  connection.query(`
  CREATE TABLE IF NOT EXISTS ParkingReservation (
    parking_reservation_id INT PRIMARY KEY AUTO_INCREMENT,
    parking_space_id INT NOT NULL,
    user_id INT NOT NULL,
    vehicle_id INT NOT NULL,
    status VARCHAR(255) NOT NULL,
    duration VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
  )`, (err, result, fields) => {
    if (err) throw err;
  });
});

module.exports = {
  connection
};
