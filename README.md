# Razuna v1.x Docker Image

This is the offical Docker image for Razuna v1 (Docker image for Razuna v2 is here)[https://github.com/razuna/razuna_docker_2]. With this script you can quickly get Razuna up and running with Docker.

### About

- [Docker](https://docker.com/) is an open source project to pack, ship and run any Linux application in a lighter weight, faster container than a traditional virtual machine.

- Docker makes it much easier to deploy [Razuna](https://github.com/razuna/razuna) on your servers and keep it updated.

- The base image configures Razuna with the recommended settings.

- For now we install everything in a single container by default. However, the script will provide options for you to setup Razuna in a multi-container environment.

- Instead of building our own image, we choose to take the standard Ubuntu image (16.04 LTS) and install and configure Ubuntu and all its thrid-party libraries for Razuna.

### Prerequisite

This script requires that you have node.js installed on your server. Please visit [Nodejs Website](https://nodejs.org/en/) to install it.

### How to install

Sign in to your server and navigate to this script directory. Then issue:

```
npm install
```

When all libraries are installed you can build your Razuna Docker images with:

```
./razuna-docker build
```

The script will prompt you for some inputs and then will build the Razuna Docker Image for you (depending on your server this can take up to 30 minutes).

Once the image is build you can run it with:

```
./razuna-docker run
```

This will run the Razuna Docker container and Razuna should shortly be available at [http://localhost:8080/razuna](http://localhost:8080/razuna).

The "razuna_docker" script comes with more options and a help. Simply type:

```
./razuna-docker help
```

### Configuration

By default all configurations are stored in .json files. You can find them in the "configuration" directory. The default.json file will be laoded by default if the "-c" argument is not used in the run command.

### Storage

Docker does not provide persitant storage, i.e. every time you start a container your data is gone. Of course, there is an option to provide persistant storage. By default all data is stored in the "shared" directory!

If you want to change where Razuna Docker stores its files you need to edit the configuration files and provide an absolute path to your directory. This path goes into the "host" parameter.

For example:

```
"volumes" : [
        {
            "host" : "/myabsolutepath/razuna/assets",
            "container" : "/opt/tomcat/webapps/razuna/assets"
        }
```

If you change the configuration you need to destroy the existing Razuna Docker container and create a new one with "run". This script offers you one command to destroy.

```
# Destroy
./razuna-docker destroy
# Run
./razuna-docker run
```

### Ports

By default, the container exposes the ports 8080 and 22. The run script will map port 2222 to port 22. You can use SSH to login to the container (see below).

If you run Nginx or MySQL in the same container then additonally the ports 80, 443 (Nginx) and port 3306 (MySQL) will be exposed.

Ports can be configured in the configuration files.

### Updating Razuna

You got two options to upgrade Razuna:

* Connect to the running container and issue the "git pull" commands in the Razuna directories, i.e. /opt/tomcat/webapps/razuna and /opt/tomcat/webapps/razuna-searchserver

* Build a new base image with:

```
./razuna-docker run
```

Note: This will stop and remove any existing container and build a new image thereby updating and installing all libraries at new and pull a new instance of Razuna. This is like setting up a new server! Rebuilding the images can, depending on your server, take up to 30 minutes!

### Connect to the Razuna Docker Container

The installation script automatically copies your public SSH key into the container and thus allows you to SSH into the container.

Of course there are other options and you are free to use them, e.g. nsenter, etc.

### Troubleshooting

If you run into any issues please post it on [here under the "Issue" section](https://github.com/razuna/razuna_docker_1/issues).

### License

MIT (please read included license file)
