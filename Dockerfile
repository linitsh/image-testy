# use the official Bun image
# see all versions at https://hub.docker.com/r/oven/bun/tags
FROM oven/bun:1 AS base
WORKDIR /usr/src/app

# install dependencies into temp directory
# this will cache them and speed up future builds
FROM base AS install
RUN mkdir -p /temp/dev
COPY package.json bun.lockb /temp/dev/
RUN cd /temp/dev && bun install --frozen-lockfile

# install with --production (exclude devDependencies)
RUN mkdir -p /temp/prod
COPY package.json bun.lockb /temp/prod/
RUN cd /temp/prod && bun install --frozen-lockfile --production

# copy node_modules from temp directory
# then copy all (non-ignored) project files into the image
FROM base AS prerelease
COPY --from=install /temp/prod/node_modules node_modules
COPY . .

# [optional] tests & build
ENV NODE_ENV=production
RUN bun test
RUN bun run build

# copy production dependencies and source code into final image
FROM base AS release
#COPY --from=install /temp/prod/node_modules node_modules
WORKDIR /application
RUN apt-get update && apt-get install -y curl nano mc 
RUN sh -c "$(curl --location https://taskfile.dev/install.sh)" -- -d -b /bin
COPY --from=prerelease /usr/src/app/app .
COPY --from=prerelease /usr/src/app/config.yaml .
COPY --from=prerelease /usr/src/app/index.html .

# run the app
# USER bun
EXPOSE 3000/tcp
ENTRYPOINT [ "./app" ]
CMD [ "" ]