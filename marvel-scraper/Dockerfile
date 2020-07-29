FROM node:10.16.3

ARG BUILD_ENV=production
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install --$BUILD_ENV

ADD . .

CMD ["npm", "start"]
