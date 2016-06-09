var ConfigReader = function() {
	var fs = require('fs');
	var util = require('util');
	var path = require('path');

	var _pathtoconfig = path.join(path.dirname(fs.realpathSync(__filename)), '../configurations');
	var _config_settings_container = {};

	var _getSettings = function(config_file) {
		// return the config settings
		return _config_settings(config_file);
	};

	var _getSetting = function(config_file, setting_name) {
		return _config_settings(config_file)[setting_name];
	};

	// Read the passed configfile
	var _getConfString = function(pwd_root, config_file, nginx, mysql) {
		// Params
		var _ports = '';
		var _volumes = '';
		// Get configs
		var _config_volumes = _getSetting(config_file, 'volumes');
		var _config_ports = _getSetting(config_file, 'ports');
		var _config_memory = ' -m ' + _getSetting(config_file, 'memory');
		var _config_demonized = _getSetting(config_file, 'demonized') ? '-d ' : '';
		var _config_restart = _getSetting(config_file, 'restart-policy') ? '--restart=' + _getSetting(config_file, 'restart-policy') : '';
		var _config_dev = _getSetting(config_file, 'dev_mode') ? true : false;
		var _config_dev_path_razuna = _getSetting(config_file, 'dev_path_razuna') ? _getSetting(config_file, 'dev_path_razuna') : '';
		var _config_dev_path_razuna_search = _getSetting(config_file, 'dev_path_razuna_search') ? _getSetting(config_file, 'dev_path_razuna_search') : '';

		// If dev and no path given abort
		if (_config_dev && ( _config_dev_path_razuna === '' || _config_dev_path_razuna_search === '' )) {
			console.log('You are in Dev mode, but forgot to define the paths to your Razuna source code! This script will now abort...'.red);
			process.exit();
		}

		// Write out ports to string
		_ports = _loopPorts(_config_ports);
		// Write out volumes to string
		_volumes = _loopVolumes(_config_volumes, pwd_root);
		// Get config file for Nginx
		if (nginx) {
			// Set config file
			var _config_nginx = 'nginx.json';
			// Get configs
			var _config_nginx_volumes = _getSetting(_config_nginx, 'volumes');
			var _config_nginx_ports = _getSetting(_config_nginx, 'ports');
			// Write out ports to string
			_ports += _loopPorts(_config_nginx_ports);
			// Write out volumes to string
			_volumes += _loopVolumes(_config_nginx_volumes, pwd_root);
		}
		// Get config file for Mysql
		if (mysql) {
			// Set config file
			var _config_mysql = 'mysql.json';
			// Get configs
			var _config_mysql_volumes = _getSetting(_config_mysql, 'volumes');
			var _config_mysql_ports = _getSetting(_config_mysql, 'ports');
			// Write out ports to string
			_ports += _loopPorts(_config_mysql_ports);
			// Write out volumes to string
			_volumes += _loopVolumes(_config_mysql_volumes, pwd_root);
		}
		// Add everything together and return as string -d (demonized)
		return _config_demonized + _config_restart + _config_memory + _ports + _volumes;
	};

	/////////////////////////////////////////////////////////////// Internal Functions ///////////////////////////////////////////////////////////////

	var _config_settings = function(config_file) {
		var _config_settings_file_path = _pathtoconfig + '/' + config_file;
		var file_contents = fs.readFileSync(_config_settings_file_path, 'utf8');
		var _config = JSON.parse(file_contents);
		// return the config settings
		return _config;
	};

	// Loop over volumes
	var _loopVolumes = function(volumes, pwd_root) {
		// Params
		var _volumes = '';
		var _path_host = '';
		// Loop
		volumes.forEach( function(volume) {
			// Check if host is empty. If so, we store files in our shared directory
			if (!volume.host) {
				// Remove the path from container path
				_path_host = volume.container.replace('/opt/tomcat/webapps', pwd_root + '/shared');
				_path_host = volume.container.replace('/opt/tomcat/logs', pwd_root + '/shared/logs/tomcat');
				_path_host = volume.container.replace('/var/log/mysql', pwd_root + '/shared/logs/mysql');
				_path_host = volume.container.replace('/var/log/nginx', pwd_root + '/shared/logs/nginx');
				// Set volume path
				_volumes += ' -v ' + _path_host + ':' + volume.container;
			}
			else {
				// Set volume path
				_volumes += ' -v ' + volume.host + ':' + volume.container; 
			}
		});
		// Return
		return _volumes;
	};

	// Loop over ports
	var _loopPorts = function(ports) {
		// Params
		var _ports = '';
		// Loop
		ports.forEach( function(port) {
			_ports += ' -p ' + port.host + ':' + port.container; 
		});
		// Return
		return _ports;
	};
 
 

	// exposed members
	return {
		getSettings : _getSettings,
		getSetting : _getSetting,
		getConfString : _getConfString
	};
}();
module.exports = ConfigReader;
