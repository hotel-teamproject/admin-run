# 1단계: 빌드
FROM node:18-alpine AS build-stage
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
# 배포 도메인에 맞는 API URL 설정
ENV VITE_API_URL=http://kbutest.store/api
RUN npm run build

# 2단계: Nginx 실행
FROM nginx:1.25-alpine
COPY --from=build-stage /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]