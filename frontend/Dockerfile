# frontend/Dockerfile
FROM node:22

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
COPY .env.production .env

RUN npm run build -- --mode production

RUN npm install -g serve

EXPOSE 3000

CMD ["serve", "-s", "dist"]
