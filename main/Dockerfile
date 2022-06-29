FROM node

WORKDIR /app

ARG NODE_ENV=production

COPY package*.json ./
RUN npm install
COPY load ./load
COPY views ./views
COPY logs ./logs
COPY src ./src

CMD ["npm", "run", "start"]