# travelook.vn start
```
clone file ./server.js để cấu hình port, localhost | 0.0.0.0 tùy môi trường
chạy các lệnh sau:
npm i
npm run [build-sbx | build-prod]
start pm2 với file vừa clone từ server.js
DEPLOY DOCKER
1. Build Image: "docker build --build-arg ENV_BUILD=[prod|sbx|dev] -t [name image]  ." Không có ENV_BUILD mặc đinh prod
   VD: docker build --build-arg ENV_BUILD=sbx -t paymebo .
2. Run docker: "docker run -e NODE_PORT=[port] --name [name container] -p [port docker]:[port]  -d [name image]"
   VD: docker run -e NODE_PORT=5000 --name paymebo5000 -p 5000:5000  -d paymebo
