const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const { reserveParking, cancelParkingReservation } = require('./service/parkingReservation.js');
const { getParkingSpace, getParkingSpaceList, addParkingSpace, editParkingSpace, removeParkingSpace } = require('./service/parkingSpace.js');
const { getVehicle, addVehicle, editVehicle, removeVehicle } = require('./service/vehicle.js');

// gRPC setup
const parkingProtoPath = './parking-reservation-protos/parking_reservation.proto';
const packageDefinition = protoLoader.loadSync(parkingProtoPath, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});
const parkingPackage = grpc.loadPackageDefinition(packageDefinition).parking;
const grpcServer = new grpc.Server();

// Define gRPC service methods
grpcServer.addService(parkingPackage.ParkingReservationService.service, {
  getParkingSpace: getParkingSpace,
  getParkingSpaceList: getParkingSpaceList,
  addParkingSpace: addParkingSpace,
  editParkingSpace: editParkingSpace,
  removeParkingSpace: removeParkingSpace,
  getVehicle: getVehicle,
  addVehicle: addVehicle,
  editVehicle: editVehicle,
  removeVehicle: removeVehicle,
  reserveParking: reserveParking,
  cancelParkingReservation: cancelParkingReservation,
});

// Start gRPC server
grpcServer.bindAsync('0.0.0.0:50051', grpc.ServerCredentials.createInsecure(), () => {
  console.log('gRPC server is running on port 50051');
  grpcServer.start();
});
