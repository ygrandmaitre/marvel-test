# Stage 1 - the build process
FROM node:10.16 as build-deps

ARG REACT_APP_API_URL
ARG REACT_APP_API_TOKEN

ENV REACT_APP_API_URL=${REACT_APP_API_URL}
ENV REACT_APP_API_TOKEN=${REACT_APP_API_TOKEN}

WORKDIR /usr/src/app
COPY package.json yarn.lock ./
RUN yarn
COPY . ./
RUN yarn build

# Stage 2 - the production environment
FROM nginx:1.16-alpine
COPY --from=build-deps /usr/src/app/build /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
