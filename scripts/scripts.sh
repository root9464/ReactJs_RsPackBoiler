#!/bin/bash

DOCKERFILE_PATH="../Dockerfile"
IMAGE_NAME="test"
CONTAINER_NAME="test_container"

ping() {
    echo "pong"
}

rebuild_front() {
    docker stop $CONTAINER_NAME &&
    docker rm $CONTAINER_NAME &&
    docker rmi $IMAGE_NAME &&
    docker build -f $DOCKERFILE_PATH .. -t $IMAGE_NAME &&
    docker run --name $CONTAINER_NAME -p 8080:8080 -d $IMAGE_NAME
}

first_build() {
    docker build -f $DOCKERFILE_PATH .. -t $IMAGE_NAME &&
    docker run --name $CONTAINER_NAME -p 8080:8080 -d $IMAGE_NAME
}

delete_build(){
    docker stop $CONTAINER_NAME &&
    docker rm $CONTAINER_NAME &&
    docker rmi $IMAGE_NAME
}

logs_build() {
    docker logs $CONTAINER_NAME
}

if [ $# -eq 1 ]; then
    "$1"
fi