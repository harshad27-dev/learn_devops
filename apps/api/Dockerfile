FROM node:20-alpine

WORKDIR /app

COPY package.json  package-lock.json ./
COPY apps/api/package.json ./apps/api/  

RUN npm ci --workspace=@todo/api --include-workspace-root

COPY apps/api ./apps/api

EXPOSE 4100

CMD ["npm", "run", "start", "--workspace=@todo/api"]