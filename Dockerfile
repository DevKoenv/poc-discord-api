# use the official Bun image
# see all versions at https://hub.docker.com/r/oven/bun/tags
FROM oven/bun:alpine as base
WORKDIR /usr/src/app

# install libstdc++ package
RUN apk add --no-cache libstdc++

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
COPY --from=install /temp/dev/node_modules node_modules
COPY . .

# copy production dependencies and source code into final image
FROM base AS release
COPY --from=install /temp/prod/node_modules /usr/src/app/node_modules
COPY --from=prerelease /usr/src/app/src/ /usr/src/app/src/
COPY --from=prerelease /usr/src/app/package.json /usr/src/app/package.json

# Ensure the container runs as a non-root user
USER bun

# Set NODE_ENV to production
ENV NODE_ENV=production

# Expose the port your app runs on
EXPOSE 8080/tcp

# Serve the app
ENTRYPOINT [ "sh", "-c", "bun run --bun /usr/src/app/src/index.ts" ]