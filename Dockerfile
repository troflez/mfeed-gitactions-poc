FROM node:latest AS build

WORKDIR /usr/local/app
COPY ./src/MFeed /usr/local/app/
ENV NODE_OPTIONS=--openssl-legacy-provider
RUN npm config set registry http://registry.npmjs.org/
RUN npm install
RUN npm run build

FROM nginxinc/nginx-unprivileged

WORKDIR /usr/share/nginx/html
COPY --from=build /usr/local/app/dist/ /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 8080

ENTRYPOINT ["nginx", "-g", "daemon off;"]
