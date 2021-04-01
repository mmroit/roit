#!/bin/bash

docker run --name mongodb --rm -d \
       --network mongodb -p "27017:27017" \
       -v mongodb:/data/db \
       mongo