FROM node:18.18.0

WORKDIR /usr/src/client

COPY package*.json ./
RUN npm install

COPY . .

CMD ["npm", "start"]
