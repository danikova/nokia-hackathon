
#!/bin/bash

# Get the current date
DATE=$(date +%Y%m%d)

# Build the Docker image
docker build -t hackathon:$DATE .

