FROM parking-reservation-dynamic-protos AS proto_build
FROM node:16

# Create app directory
WORKDIR /app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./

RUN npm install
# If you are building your code for production
# RUN npm ci --omit=dev

# Bundle app source
COPY . .
COPY --from=proto_build . ./

EXPOSE 50051
CMD [ "node", "server.js" ]
