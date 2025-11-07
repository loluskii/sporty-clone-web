FROM node:18-alpine AS builder

WORKDIR /app

# Accept all VITE_ environment variables as build arguments
ARG VITE_BASE_URL
ARG VITE_SITE_URL
ARG VITE_NEW_BASE_API
ARG VITE_ENCRYPT_SECRET_KEY
ARG VITE_APP_KEY
ARG VITE_CLIENT_ID
ARG VITE_CURRENCY
ARG VITE_WTH_PERC
ARG VITE_EXCISE_DUTY
ARG VITE_FAST_ADD_AMOUNTS
ARG VITE_TIMEZONE
ARG VITE_MaxCombinationsByGrouping
ARG VITE_MaxCouponCombinations
ARG VITE_MinBonusOdd
ARG VITE_MinGroupingsBetStake
ARG VITE_MaxGroupingsBetStake
ARG VITE_MinBetStake
ARG VITE_StakeInnerMod0Combination
ARG VITE_XPRESS_LAUNCH_URL
ARG VITE_XPRESS_PRIVATE_KEY
ARG VITE_XPRESS_PUBLIC_KEY
ARG VITE_MQTT_URI
ARG VITE_FEED_TOGGLE

COPY package*.json ./
RUN rm -rf node_modules package-lock.json && \
    npm install && \
    npm install @rollup/rollup-linux-x64-musl --save-optional

COPY . .
RUN npm run build

FROM nginx:alpine

COPY --from=builder /app/dist /usr/share/nginx/html

RUN echo 'server { \
    listen 3009; \
    root /usr/share/nginx/html; \
    index index.html; \
    location / { \
        try_files $uri $uri/ /index.html; \
    } \
}' > /etc/nginx/conf.d/default.conf

EXPOSE 3009

CMD ["nginx", "-g", "daemon off;"]