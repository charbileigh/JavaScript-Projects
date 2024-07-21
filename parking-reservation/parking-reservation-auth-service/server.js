const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const { register, forgotPassword, resetPassword, login, getUser } = require('./service/parkingReservationAuth.js');

// gRPC setup
const authProtoPath = './parking-reservation-protos/parking_reservation_auth.proto';
const packageDefinition = protoLoader.loadSync(authProtoPath, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});
const authPackage = grpc.loadPackageDefinition(packageDefinition).auth;
const grpcServer = new grpc.Server();

// Define gRPC service methods
grpcServer.addService(authPackage.AuthService.service, {
  register: register,
  forgotPassword: forgotPassword,
  resetPassword: resetPassword,
  login: login,
  getUser: getUser,
});

// Start gRPC server
grpcServer.bindAsync('0.0.0.0:50052', grpc.ServerCredentials.createInsecure(), () => {
  console.log('gRPC server is running on port 50052');
  grpcServer.start();
});
