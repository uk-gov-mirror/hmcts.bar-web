FROM node:8.12.0

RUN mkdir -p /usr/bar/src/app
WORKDIR /usr/bar/src/app

COPY ./start.js /usr/bar/src/app/
COPY ./server.js /usr/bar/src/app/
COPY ./package-deploy.json  /usr/bar/src/app/package.json
COPY ./dist  /usr/bar/src/app/dist
COPY ./express  /usr/bar/src/app/express
COPY ./yarn.lock /usr/bar/src/app
COPY ./app-insights.js /usr/bar/src/app/
COPY ./config /usr/bar/src/app/config
COPY ./data /usr/bar/src/app/data
COPY ./dev-certificates /usr/bar/src/app/dev-certificates

RUN yarn install --production

RUN pwd
RUN ls -ltr

HEALTHCHECK --interval=10s --timeout=10s --retries=10 CMD http_proxy= curl -k --silent --fail https://localhost:3000/health

EXPOSE 3000
CMD [ "yarn", "start" ]
