FROM node:lts

RUN mkdir -p /WORK
COPY ./node-docker /WORK
COPY ./rsa /rsa
WORKDIR /WORK
RUN npm install

EXPOSE 5000

CMD ["npm", "start"]
