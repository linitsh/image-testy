FROM node:alpine

WORKDIR /app

COPY . .

RUN npm install

ENTRYPOINT ["node", "main.js"]
CMD [ "" ]

EXPOSE 3000