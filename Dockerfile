FROM node:16.13.0-alpine AS builder

RUN apk add curl bash --no-cache
RUN curl -sfL https://install.goreleaser.com/github.com/tj/node-prune.sh | bash -s -- -b /usr/local/bin

WORKDIR /build
ADD . /build
RUN npm install --frozen-lockfile
RUN npm run build
RUN npm prune --production

#RUN /usr/local/bin/node-prune
RUN du -sh ./node_modules/* | sort -nr | grep '\dM.*'

FROM node:16.13.0-alpine

WORKDIR /app
COPY --from=builder /build/dist ./dist
COPY --from=builder /build/package.json .
COPY --from=builder /build/node_modules ./node_modules
ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

CMD ["npm","run", "start:prod"]