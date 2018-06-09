# Runner build
FROM node:8-alpine

WORKDIR /home/app/sn-curtain.com/

COPY . ./

RUN yarn install

EXPOSE 5000

CMD [ "yarn", "start" ]