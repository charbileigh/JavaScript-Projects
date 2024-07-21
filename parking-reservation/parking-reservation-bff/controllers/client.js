const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');

// Parking Reservation Service Client Connection
const parkingProtoPath = './parking-reservation-protos/parking_reservation.proto';
const parkingPackageDefinition = protoLoader.loadSync(parkingProtoPath, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});
const parkingPackage = grpc.loadPackageDefinition(parkingPackageDefinition).parking;

const parkingReservationClient = new parkingPackage.ParkingReservationService(
  'parking-reservation-service-backend:50051',
  grpc.credentials.createInsecure()
);


// Parking Reservation Auth Service Client Connection
const authProtoPath = './parking-reservation-protos/parking_reservation_auth.proto';
const authPackageDefinition = protoLoader.loadSync(authProtoPath, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});
const authPackage = grpc.loadPackageDefinition(authPackageDefinition).auth;

const parkingReservationAuthClient = new authPackage.AuthService(
  'parking-reservation-auth-service-backend:50052',
  grpc.credentials.createInsecure()
);


module.exports = {
  parkingReservationClient,
  parkingReservationAuthClient
};
