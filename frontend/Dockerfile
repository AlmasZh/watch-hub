FROM dhi.io/node:24-alpine3.23-dev AS build

WORKDIR /app

COPY . .
RUN npm ci
RUN npm run build

FROM dhi.io/node:24-alpine3.23

WORKDIR /app

COPY --from=build --chown=node:node /app/.next/standalone ./
COPY --from=build --chown=node:node /app/public ./public
COPY --from=build --chown=node:node /app/.next/static ./.next/static
COPY --chown=node:node ./prod-loader.js ./loader.js

USER node

EXPOSE 3000
ENTRYPOINT [ "node", "loader.js" ]