FROM node:alpine
WORKDIR /usr/src
ENV NODE_ENV production
ENV PORT 3000
EXPOSE 3000
COPY . .
RUN npm i
CMD npm run start:prod
