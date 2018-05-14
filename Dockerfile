FROM node:latest

RUN mkdir -p /home/service
WORKDIR /home/service

COPY . /home/service

EXPOSE 3000

RUN npm install --production

CMD ["npm", "start"]