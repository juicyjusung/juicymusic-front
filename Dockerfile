# build stage
FROM node:lts-alpine as build-stage
ENV VUE_APP_API_BASE_URL http://ec2-15-164-98-92.ap-northeast-2.compute.amazonaws.com:3000
WORKDIR /app
COPY package*.json ./
RUN npm install --silent
COPY . .
RUN npm run build

# production stage
FROM nginx:stable-alpine as production-stage
COPY --from=build-stage /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]

