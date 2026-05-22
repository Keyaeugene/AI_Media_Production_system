FROM node:20-alpine

WORKDIR /app

RUN npm install -g pnpm

COPY package.json /app/package.json
RUN pnpm install

COPY . /app

RUN pnpm build

CMD ["pnpm", "dev"]
