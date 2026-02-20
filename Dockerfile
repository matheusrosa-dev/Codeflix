FROM node:22

USER node

WORKDIR /home/node/app

EXPOSE 3333

CMD ["tail", "-f", "/dev/null"]