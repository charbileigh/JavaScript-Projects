const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = 3000;
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');

const authRoute = require('./routes/authRoutes');
const vehicleRoute = require('./routes/vehicleRoutes');
const parkingSpaceRoute = require('./routes/parkingReservationRoutes');
const parkingReservation = require('./routes/parkingReservationRoutes');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use('/api/auth', authRoute);
app.use('/api/vehicle', vehicleRoute);
app.use('/api/parking-space', parkingSpaceRoute);
app.use('/api/parking', parkingReservation);

app.use('/api/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
});
