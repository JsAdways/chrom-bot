FROM node:22.0
COPY ./ /var/project
RUN apt-get update && apt-get install -y vim nano chromium
RUN apt-get install -y fonts-arphic-ukai fonts-arphic-uming fonts-ipafont-mincho fonts-ipafont-gothic fonts-unfonts-core
RUN npm i -g npm
RUN npm i -g pm2

EXPOSE 5000
ENV HOST=0.0.0.0
WORKDIR /var/project
CMD ["node", "./server.js"]
