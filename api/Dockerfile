FROM node:18.18.0

WORKDIR /usr/src/api

COPY package*.json ./
RUN npm install

COPY . .

CMD ["npm", "start"]
