var Actions = function() {

	// Require
	var prompt = require('prompt');
	var shelljs = require('shelljs');
	var colors = require('colors');
	var getUsage = require('command-line-usage');
	var docker = require('./docker.js');
	var package = require('../package');

	// BUILD
	var _build = function() {
		// Shell vars
		var _pwd = shelljs.pwd().stdout + '/shared/razuna';
		var _setup = '';
		var _nginx = '';
		var _mysql = '';
		var _path_code = '';
		var _path_razuna = '';

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
		]
		var usage = getUsage(sections)
		console.log(usage.green)

		// Ask for production or dev 
		prompt.get([
			{
				description: 'Which setup should do you want to run (production or development)?',
				name: 'setup',
				required: true,
				default: 'production',
				type: 'string'
			},
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
			},
			{
				description: 'Please provide the absolute path where Razuna should store its data?',
				name : 'path_razuna',
				required: true,
				default: _pwd,
				type: 'string'
			}
			], function (err, result) {
				// If user aborts
				if (!result) {
					console.log('Looks like you aborted. Exiting now...'.red); 
					return shelljs.exit(1);
				}
				// Setting vars
				_setup = result.setup;
				_nginx = result.nginx;
				_mysql = result.mysql;
				_path_razuna = result.path_razuna;
				// For prod
				if (result.setup !== 'production') {
					_setupDev(_setup, _nginx, _mysql, _path_razuna, _path_code);
				}
				else {
					_final(_setup, _nginx, _mysql, _path_razuna, _path_code);
				}
		});
	};


	// INTERNAL FUNCTIONS

	function _setupDev(_setup, _nginx, _mysql, _path_razuna, _path_code) {
		prompt.get([{
				description: 'Please provide the absolute path to your Razuna code respository?',
				name: 'path_code',
				required: true
			}], function (err, result) {
				_path_code = result.path_code;
				_final(_setup, _nginx, _mysql, _path_razuna, _path_code);
		});
	}


	// Log
	function _final(_setup, _nginx, _mysql, _path_razuna, _path_code) {
		console.log('_setup', _setup); 
		console.log('_nginx', _nginx); 
		console.log('_mysql', _mysql); 
		console.log('_path_razuna', _path_razuna); 
		console.log('_path_code', _path_code);
		// Create the DockerFile
		docker.createDockerFile(_nginx, _mysql, function(error, content) {
			if (error) {
				console.log('There was an error writing the DockerFile. Error:', error.red); 
			}
			else {
				console.log('Sucessfully wrote the Dockerfile to disk. Building the container now. This might take some time.'.green);
				// Now build the container
				shelljs.cd('image');
				shelljs.exec('docker build -t nitai/razuna:' + package.version + ' .', function(code, stdout, stderr) {
					console.log('Exit code:', code);
					console.log('Program output:', stdout);
					console.log('Program stderr:', stderr);
				});
			}
		});
	}

	// exposed members
	return {
		build : _build
	};
	
}();
module.exports = Actions;









