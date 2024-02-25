#!/bin/bash
set -e

/app/api migrate
/app/api serve --http="127.0.0.1:8090" &

nginx -g "daemon off;"
