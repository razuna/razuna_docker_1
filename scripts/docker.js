var DockerFile = function() {

	// Require   
	var Builder = require("node-dockerfile");
	var dockerFile = new Builder();

	// Function
	var _createDockerFile = function(nginx, mysql, callback) {
		// Initial 
		myFile = dockerFile
			.comment("START")
			.from("ubuntu:16.04")
			.maintainer('Nitai Aventaggiato "https://twitter.com/thenitai"')
			.newLine()
			.comment("ADD MULTIVERSE")
			.run('echo "deb http://archive.ubuntu.com/ubuntu/ xenial multiverse" >> /etc/apt/sources.list')
			.run('echo "deb-src http://archive.ubuntu.com/ubuntu/ xenial multiverse" >> /etc/apt/sources.list')
			.run('echo "deb http://archive.ubuntu.com/ubuntu/ xenial-updates multiverse" >> /etc/apt/sources.list')
			.run('echo "deb-src http://archive.ubuntu.com/ubuntu/ xenial-updates multiverse" >> /etc/apt/sources.list')
			.newLine()
			.comment("UPDATE")
			.run("apt-get update")
			.newLine()
			.comment("SET ENV NONINTERACTIVE")
			.env("DEBIAN_FRONTEND", "noninteractive")
			.newLine()
			.comment("INSTALL")
			.run("apt-get install -y software-properties-common python-software-properties apt-utils")
			.newLine()
			.comment("GIT")
			.run("apt-get install -y git")
			.newLine()
			.comment("MEMCACHED")
			.run("apt-get -y install memcached");

		// MySQL
		if (mysql === 'yes') {
			myFile = dockerFile
				.newLine()
				.comment("MySQL")
				.run("apt-get -y install mysql-server")
				.newLine()
				.comment("MySQL Configuration")
				.run("echo mysql-server mysql-server/root_password password razuna | /usr/bin/debconf-set-selections")
				.run("echo mysql-server mysql-server/root_password_again password razuna | /usr/bin/debconf-set-selections");
		}

		// Nginx
		if (mysql === 'yes') {
			myFile = dockerFile
				.newLine()
				.comment("NGINX")
				.run([
					"add-apt-repository -y ppa:nginx/stable",
					"apt-get update",
					"apt-get install -y nginx",
					"rm -rf /var/lib/apt/lists/*",
					"chown -R www-data:www-data /var/lib/nginx"
				])
				.run('echo "\\ndaemon off;" >> /etc/nginx/nginx.conf')
				.expose(80)
				.expose(443);
		}

		myFile = dockerFile
			.newLine()
			.comment("IMAGEMAGICK")
			.run("apt-get update")
			.run("apt-get -y install imagemagick")
			.newLine()
			.comment("DCRAW / UFRAW")
			.run([
				"apt-get -y install dcraw",
				"apt-get -y install ufraw"
			])
			.newLine()
			.comment("MP4BOX")
			.run("apt-get -y install gpac")
			.newLine()
			.comment("SSH")
			.add("install-ssh", "/tmp/install-ssh")
			.run("/tmp/install-ssh")
			.env("NOTVISIBLE", "in users profile")
			.newLine()
			.comment("JAVA")
			.add("install-java", "/tmp/install-java")
			.run("/tmp/install-java")
			.newLine()
			.comment("FFMPEG")
			.add("install-ffmpeg", "/tmp/install-ffmpeg")
			.run("/tmp/install-ffmpeg")
			.newLine()
			.comment("EXIFTOOL")
			.add("install-exiftool", "/tmp/install-exiftool")
			.run("/tmp/install-exiftool")
			.newLine()
			.comment("GHOSTSCRIPT")
			.add("install-ghostscript", "/tmp/install-ghostscript")
			.run("/tmp/install-ghostscript")
			.newLine()
			.comment("TOMCAT")
			.add("install-tomcat", "/tmp/install-tomcat")
			.run("/tmp/install-tomcat")
			.newLine()
			.comment("RAZUNA")
			.add("install-razuna", "/tmp/install-razuna")
			.run("/tmp/install-razuna")
			.newLine()
			.comment("COPY FILES AROUND")
			.copy("setenv.sh", "/opt/tomcat/bin/setenv.sh")
			.copy("permgen.sh", "/opt/tomcat/bin/permgen.sh")
			.copy("tomcat", "/etc/init.d/tomcat")
			.copy("razuna-server.xml", "/opt/tomcat/bin/razuna-server.xml")
			.copy("start.sh", "/opt/start.sh")
			.newLine()
			.comment("SET TOMCAT TO START ON REBOOT")
			.run("update-rc.d tomcat defaults")
			.newLine()
			.comment("SET PERMISSIONS")
			.run([
				"chmod +x /opt/tomcat/bin/setenv.sh",
				"chmod +x /opt/tomcat/bin/permgen.sh",
				"chmod +x /etc/init.d/tomcat",
				"chmod +x /opt/start.sh"
			])
			.newLine()
			.comment("CLEAN UP TASKS")
			.run([
				"apt-get -y autoclean && apt-get -y autoremove",
				"rm -r /tmp/*",
				"rm /opt/*.gz",
				"rm /opt/*.tgz"
			])
			.newLine()
			.comment("START SERVICES")
			.expose(8080)
			.expose(22)
			.cmd("/opt/start.sh");

		// Callback for write
		// .write takes 3 arguments: 'location', 'replaceExisting' and the callback above. 
		var cb = function(err, content) {
			callback();	
		};
		
		// Finally write the file
		myFile.write("./image", true, cb);
	};

	// exposed members
	return {
		createDockerFile : _createDockerFile
	};
}();
module.exports = DockerFile;
