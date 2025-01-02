### Base
FROM node:lts-alpine3.20
ENV PORT=$PORT

# Install necessary packages for Puppeteer
# Installs latest Chromium (100) package.
RUN apk add --no-cache \
    udev \
    ttf-freefont \
    chromium \
    dumb-init

ENTRYPOINT ["/usr/bin/dumb-init", "--"]

ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser

# Add user so we don't need --no-sandbox.
RUN addgroup -S pptruser && adduser -S -G pptruser pptruser \
    && mkdir -p /home/pptruser/Downloads /app \
    && chown -R pptruser:pptruser /home/pptruser \
    && chown -R pptruser:pptruser /app

USER pptruser
WORKDIR /home/pptruser

# ENV TZ=Europe/Paris

# Node dependencies / install
COPY package*.json ./
RUN npm ci --omit=dev

# Code transfer
COPY ./src ./src

CMD [ "node", "src/index.js" ]