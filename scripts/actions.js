var Actions = function() {

	// Require
	var prompt = require('prompt');
	var shelljs = require('shelljs');
	var colors = require('colors');
	var getUsage = require('command-line-usage');
	var configreader = require('./config_reader');
	var docker = require('./docker.js');
	var package = require('../package');

	var _pwd_root = shelljs.pwd().stdout;

	// BUILD
	var _build = function() {
		// Shell vars
		var _nginx = '';
		var _mysql = '';

		// Set prompt
		prompt.message = '';

		// Start the prompt 
		prompt.start({noHandleSIGINT: true});

		/*jshint multistr: true */
		var sections = [
			{
				raw: true,
				content: '----------------------------------------------------------------------------------\n\
\n\
Welcome to the Razuna Docker image setup. This script will ask you a few questions\n\
to configure the Docker image.\n\
\n\
Values in brackets, e.g. (production) are default values and you can just hit enter\n\
to accept the values.\n\
\n\
If you have any questions or encounter an error please log an issue at\n\
https://github.com/razuna/razuna_docker_1/\n\
\n\
Ok here we go...\n\
\n\
----------------------------------------------------------------------------------\n\
\n'
			}
		];
		var usage = getUsage(sections);
		console.log(usage.green);

		// Ask for production or dev 
		prompt.get([
			{
				description: 'Do you want to install Nginx (Web Server) in the same container as Razuna?',
				name: 'nginx',
				required: true,
				default: 'no',
				type: 'string'
			}, 
			{
				description: 'Do you want to install MySQL (Database) in the same container as Razuna?',
				name : 'mysql',
				required: true,
				default: 'no',
				type: 'string'
			}
			], 
			function (err, result) {
				// If user aborts
				if (!result) {
					console.log('Looks like you aborted. Exiting now...'.red); 
					return shelljs.exit(1);
				}
				// Setting vars
				_nginx = result.nginx;
				_mysql = result.mysql;
				// Setup
				_final(_nginx, _mysql);
		});
	};

	/////////////////////////////////////////////////////////////// Internal Functions ///////////////////////////////////////////////////////////////


	// Final
	var _final = function (_nginx, _mysql) {
		// Check for dev mode
		var _dev_mode = configreader.getSetting('default.json', 'dev_mode');
		var _dev_path_razuna = configreader.getSetting('default.json', 'dev_path_razuna');
		var _dev_path_razuna_search = configreader.getSetting('default.json', 'dev_path_razuna_search');
		if (_dev_mode && ( _dev_path_razuna === '' || _dev_path_razuna_search === '' )) {
			console.log('You are in Dev mode, but forgot to define the paths to your Razuna source code! This script will now abort...'.red);
			process.exit();
		}
		// Remove any existing container
		console.log('Stopping the Razuna Docker container.'.green);
		shelljs.exec('docker stop razuna_' + package.version);
		console.log('Removing the Razuna Docker container'.green);
		shelljs.exec('docker rm razuna_' + package.version);
		// Copy local key into the authorized_keys file
		console.log('Copying public ssh keys so you can sign in to the container (not recommended)'.green);
		shelljs.exec('cat ~/.ssh/id_rsa.pub >> ' + shelljs.pwd().stdout + '/image/authorized_keys');
		shelljs.exec('cat /root/.ssh/id_rsa.pub >> ' + shelljs.pwd().stdout + '/image/authorized_keys');
		// Create the DockerFile
		docker.createDockerFile(_nginx, _mysql, _dev_mode, function(error, content) {
			if (error) {
				console.log('There was an error writing the DockerFile. Error:', error.red); 
			}
			else {
				console.log('Sucessfully wrote the Dockerfile to disk. Building the container now. This might take some time.'.green);
				// Now build the container
				shelljs.cd('image');
				shelljs.exec('docker build -t nitai/razuna:' + package.version + ' .', function(code, stdout, stderr) {
					// On error
					if (stderr) {
						console.log('An error occured during the creating of the image. Error: ', stderr.red);
					}
					else {
						console.log('The Razuna Docker image has been successfully build. You can now start it up!'.green);
					}
					shelljs.cd('../');
				});
			}
		});
	};

	// Run
	var _run = function(config_file, nginx, mysql) {
		// Read config file
		var _config = configreader.getConfString(_pwd_root, config_file, nginx, mysql);
		// Remove any existing container
		shelljs.exec('docker rm razuna_' + package.version);
		// Exexute
		shelljs.exec('docker run --name=razuna_' + package.version + ' ' + _config + ' nitai/razuna:' + package.version, function(code, stdout, stderr) {
			if (stderr) {
				console.log('An error occured while trying to run the Razuna Docker container. Error: ', stderr.red);
			}
			else {
				console.log('The Razuna Docker container has been successfully started!'.green);
			}
		});
	};

	// Run
	var _start = function() {
		// Exexute
		shelljs.exec('docker start razuna_' + package.version, function(code, stdout, stderr) {
			if (stderr) {
				console.log('An error occured during the startup of the Razuna Docker container. Error: ', stderr.red);
			}
			else {
				console.log('The Razuna Docker container has been successfully started!'.green);
			}
		});
	};

	// Stop
	var _stop = function() {
		// Read config file
		shelljs.exec('docker stop razuna_' + package.version, function(code, stdout, stderr) {
			if (stderr) {
				console.log('An error occured while stopping. Error: ', stderr.red);
			}
			else {
				console.log('The Razuna Docker container has been successfully stoped!'.green);
			}
		});
	};

	// Destroy
	var _destroy = function() {
		// Read config file
		shelljs.exec('docker stop razuna_' + package.version + '&& docker rm razuna_' + package.version, function(code, stdout, stderr) {
			if (stderr) {
				console.log('An error occured while trying to destroy the Razuna Docker container. Error: ', stderr.red);
			}
			else {
				console.log('The Razuna Docker container has been successfully stopped and removed!'.green);
			}
		});
	};

	// Cleanup
	var _cleanup = function() {
		// Remove all containers and images
		shelljs.exec("docker ps -a -q | grep 'week' | awk '{print $1}' | xargs docker rm");
		shelljs.exec("docker images | grep '^<none>' | awk '{print $3}' | xargs docker rmi");
	};

	// Cleanup
	var _logs = function() {
		// Remove all containers and images
		shelljs.exec('docker logs razuna_' + package.version, function(code, stdout, stderr) {
			if (stderr) {
				console.log('An error occured while trying to read the logs of the Razuna Docker container. Error: ', stderr.red);
			}
			else {
				console.log('The Razuna Docker container has been successfully stopped and removed!'.green);
			}
		});
	};
 

	// exposed members
	return {
		build : _build,
		start : _start,
		stop : _stop,
		run : _run,
		destroy : _destroy,
		cleanup : _cleanup,
		logs : _logs
	};
	
}();
module.exports = Actions;
