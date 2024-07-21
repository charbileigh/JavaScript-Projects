FROM parking-reservation-dynamic-protos AS proto_build
FROM node:16

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
COPY --from=proto_build . ./

EXPOSE 50052

CMD ["node", "server.js"]
