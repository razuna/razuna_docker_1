# Razuna v1.x Docker Image

## About

* This is the offical Docker image for Razuna v1 ([Docker image for Razuna v2 is here](https://github.com/razuna/razuna_docker_2)).

For now this configuration expects that Razuna is available on the host and then linked to the container on "run", docker run -v ....

We should change this so it will source Razuna from git directly and and make a config switch on startup for development or production. Also, make storage persistant.

