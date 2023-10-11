FROM node:18

WORKDIR /usr/src/app

COPY . .

RUN npm install
RUN npm install typescript
RUN npm run build

EXPOSE 3001

CMD ["npm", "start"]