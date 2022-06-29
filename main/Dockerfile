FROM node

WORKDIR /app

ARG NODE_ENV=production

COPY package*.json ./
RUN npm install
COPY views ./views
COPY src ./src

CMD ["npm", "run", "start"]