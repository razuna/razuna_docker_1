# START
FROM ubuntu:16.04
MAINTAINER Nitai Aventaggiato "https://twitter.com/thenitai"
 
# ADD MULTIVERSE
RUN echo "deb http://archive.ubuntu.com/ubuntu/ xenial multiverse" >> /etc/apt/sources.list
RUN echo "deb-src http://archive.ubuntu.com/ubuntu/ xenial multiverse" >> /etc/apt/sources.list
RUN echo "deb http://archive.ubuntu.com/ubuntu/ xenial-updates multiverse" >> /etc/apt/sources.list
RUN echo "deb-src http://archive.ubuntu.com/ubuntu/ xenial-updates multiverse" >> /etc/apt/sources.list
 
# UPDATE
RUN apt-get update
 
# SET ENV NONINTERACTIVE
ENV DEBIAN_FRONTEND noninteractive
 
# INSTALL
RUN apt-get install -y software-properties-common python-software-properties apt-utils
 
# GIT
RUN apt-get install -y git
 
# MEMCACHED
RUN apt-get -y install memcached
 
# IMAGEMAGICK
RUN apt-get update
RUN apt-get -y install imagemagick
 
# DCRAW / UFRAW
RUN apt-get -y install dcraw \
 && apt-get -y install ufraw
 
# MP4BOX
RUN apt-get -y install gpac
 
# SSH
ADD ["install-ssh","/tmp/install-ssh"]
RUN /tmp/install-ssh
ENV NOTVISIBLE in users profile
 
# JAVA
ADD ["install-java","/tmp/install-java"]
RUN /tmp/install-java
 
# FFMPEG
ADD ["install-ffmpeg","/tmp/install-ffmpeg"]
RUN /tmp/install-ffmpeg
 
# EXIFTOOL
ADD ["install-exiftool","/tmp/install-exiftool"]
RUN /tmp/install-exiftool
 
# GHOSTSCRIPT
ADD ["install-ghostscript","/tmp/install-ghostscript"]
RUN /tmp/install-ghostscript
 
# TOMCAT
ADD ["install-tomcat","/tmp/install-tomcat"]
RUN /tmp/install-tomcat
 
# RAZUNA
ADD ["install-razuna","/tmp/install-razuna"]
RUN /tmp/install-razuna
 
# COPY FILES AROUND
COPY setenv.sh /opt/tomcat/bin/setenv.sh
COPY permgen.sh /opt/tomcat/bin/permgen.sh
COPY tomcat /etc/init.d/tomcat
COPY razuna-server.xml /opt/tomcat/bin/razuna-server.xml
COPY start.sh /opt/start.sh
 
# SET TOMCAT TO START ON REBOOT
RUN update-rc.d tomcat defaults
 
# SET PERMISSIONS
RUN chmod +x /opt/tomcat/bin/setenv.sh \
 && chmod +x /opt/tomcat/bin/permgen.sh \
 && chmod +x /etc/init.d/tomcat \
 && chmod +x /opt/start.sh
 
# CLEAN UP TASKS
RUN apt-get -y autoclean && apt-get -y autoremove \
 && rm -r /tmp/* \
 && rm /opt/*.gz \
 && rm /opt/*.tgz
 
# START SERVICES
EXPOSE 8080
EXPOSE 22
CMD /opt/start.sh
