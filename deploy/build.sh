#!/bin/bash

generate_tag() {
  tag="hackathon-$(date +%Y%m%d)"
  echo "$tag"
}

tag=$(generate_tag)
full_tag="hackathon:${tag}"

echo "Building image with tag: ${full_tag}"

docker build -t "${full_tag}" -f ./Dockerfile ..
