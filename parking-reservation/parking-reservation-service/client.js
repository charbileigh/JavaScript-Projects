// const grpc = require('grpc');
const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');

const parkingProtoPath = '../parking-reservation-protos/parking_reservation.proto';
const packageDefinition = protoLoader.loadSync(parkingProtoPath, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});
const parkingPackage = grpc.loadPackageDefinition(packageDefinition).parking;

const client = new parkingPackage.ParkingReservationService(
  'localhost:50051',
  grpc.credentials.createInsecure()
);


const parkingSpaceListRequest = {};

client.getParkingSpaceList(parkingSpaceListRequest, (error, response) => {
  if (!error) {
    console.log('Parking Space List fetched:', response);
  } else {
    console.error('Failed to fetch Parking List:', error);
  }
});
