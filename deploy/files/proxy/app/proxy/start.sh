#!/bin/sh

cp -nr /etc/nginx/conf.d.template/* /etc/nginx/conf.d/
echo "template files are copied to /etc/nginx/conf.d"

nginx -g "daemon off;"
