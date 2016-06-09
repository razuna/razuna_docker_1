#!/bin/bash

# Check if bluedragon.xml files exists
raz_1="/opt/tomcat/webapps/razuna/WEB-INF/bluedragon/bluedragon.xml"
raz_2="/opt/tomcat/webapps/razuna-searchserver/WEB-INF/bluedragon/bluedragon.xml"
raz_1_path="/opt/tomcat/webapps/razuna"
raz_2_path="/opt/tomcat/webapps/razuna-searchserver"
the_file="WEB-INF/bluedragon/bluedragon.xml"
# Razuna
if [ -f $raz_1 ];
then
        echo "File here"
else
        echo "Creating config file for Razuna"
        cd $raz_1_path
        git checkout $the_file
fi
# Razuna Search Server
if [ -f $raz_2 ];
then
        echo "File here"
else
        echo "Creating config file for Razuna Search"
        cd $raz_2_path
        git checkout $the_file
fi

/etc/init.d/memcached restart
/etc/init.d/ssh restart
service tomcat restart
tail -F /opt/tomcat/logs/catalina.out
