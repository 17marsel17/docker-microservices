FROM node

WORKDIR /app

ARG NODE_ENV=production

COPY package*.json ./
RUN npm install
COPY logs ./logs
COPY src ./src

CMD ["npm", "run", "start"]