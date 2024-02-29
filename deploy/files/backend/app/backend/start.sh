#!/bin/bash

./backendBin migrate
./backendBin serve --http="127.0.0.1:8090"
