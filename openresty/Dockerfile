FROM openresty/openresty:alpine-fat

RUN opm get SkyLothar/lua-resty-jwt

COPY ./nginx/nginx.conf /usr/local/openresty/nginx/conf/nginx.conf