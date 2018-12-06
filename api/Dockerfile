# ---- Base Node ----
FROM node:11-alpine AS base
LABEL maintainer="shane lee"
RUN apk --no-cache update \
&& apk --no-cache  add --virtual builds-deps build-base python \
&& mkdir -p /usr/src/app
WORKDIR /usr/src/app

# copy project file
COPY package.json /usr/src/app
COPY yarn.lock /usr/src/app


#
# ---- Dependencies ----
FROM base AS dependencies
# install node packages
RUN yarn --production  --frozen-lockfile
# copy production node_modules aside
RUN cp -R node_modules prod_node_modules
# install ALL node_modules, including 'devDependencies'
COPY . .

RUN yarn && yarn build

#
# ---- Release ----
FROM base AS release
# copy production node_modules
COPY --from=dependencies /usr/src/app/prod_node_modules ./node_modules
COPY --from=dependencies /usr/src/app/dist ./dist
# expose port and define CMD
ENV DATABASE=postgres
ENV DATABASE_USER=postgres
ENV DATABASE_PASSWORD=mysecretpassword
ENV SECRET=wr3r23fwfwefwekwself.2456342.dawqdq
ENV DB_HOST=some-postgres
ENV NODE_ENV production

EXPOSE 8000
CMD yarn serve
