FROM node:20 AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM nginx:alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf
RUN mkdir -p /usr/share/nginx/html/masjid
COPY --from=build /app/dist /usr/share/nginx/html/masjid

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
