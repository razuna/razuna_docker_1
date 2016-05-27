# Razuna v1.x Docker Image

This is the offical Docker image for Razuna v1 (Docker image for Razuna v2 is here)[https://github.com/razuna/razuna_docker_2]. With this script you can quickly get Razuna up and running with Docker.

### About

- [Docker](https://docker.com/) is an open source project to pack, ship and run any Linux application in a lighter weight, faster container than a traditional virtual machine.

- Docker makes it much easier to deploy [Razuna](https://github.com/razuna/razuna) on your servers and keep it updated.

- The base image configures Razuna with the recommended settings.

- For now we install everything in a single container by default. However, the script will provide options for you to setup Razuna in a multi-container environment.

- Instead of building our own image, we choose to take the standard Ubuntu image (16.04 LTS) and install and configure Ubuntu and all its thrid-party libraries for Razuna.

### How to install

Simply run the build.sh script as root! The script will prompt you for some configuration options.

