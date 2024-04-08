FROM node:20-alpine

WORKDIR /
COPY package*.json  ./

RUN npm install

FROM node:20-alpine

WORKDIR /

COPY --from=dep /node_modules /node_modules

COPY . .

CMD ["npm", "start"]

