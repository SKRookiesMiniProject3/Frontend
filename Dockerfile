# 빌드
FROM node:22 AS builder

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

# 배포
FROM nginx:latest

COPY nginx.conf /etc/nginx/nginx.conf


RUN mkdir -p /app/log/nginx/client && chown -R nginx:nginx /app/log && chmod -R 755 /app/log

RUN rm -f /etc/nginx/conf.d/default.conf

COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]