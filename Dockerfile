FROM node:14-alpine as dependencies
WORKDIR /my-project
COPY package-lock.json ./
COPY package.json ./
RUN npm install -g npm@^8.9.0
RUN npm install --force

FROM node:14-alpine as builder
WORKDIR /my-project
COPY . .
COPY --from=dependencies /my-project/node_modules ./node_modules
RUN NODE_ENV=sandbox npm run build-sbx
RUN NODE_ENV=production npm run build-prod
RUN rm -rf production/cache
RUN rm -rf sandbox/cache

FROM node:14-alpine as runner
WORKDIR /my-project
ENV NODE_ENV=production
COPY --from=builder /my-project ./

CMD ["node", "server.js"]
