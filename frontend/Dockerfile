FROM dhi.io/node:24-alpine3.23-dev AS build

WORKDIR /app

COPY . .
RUN npm ci
RUN npm run build

FROM dhi.io/node:24-alpine3.23

WORKDIR /app

COPY --from=build /app/.next/standalone ./
COPY --from=build /app/public ./public
COPY --from=build /app/.next/static ./.next/static
COPY ./prod-loader.js ./loader.js

EXPOSE 3000
ENTRYPOINT [ "node", "loader.js" ]