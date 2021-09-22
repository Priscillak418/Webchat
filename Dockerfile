FROM node:14.7.0

WORKDIR /webchat

COPY package*.json .

RUN npm install

COPY . .

CMD node index.js