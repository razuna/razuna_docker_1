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

	/////////////////////////////////////////////////////////////// Internal Functions ///////////////////////////////////////////////////////////////

	var _config_settings = function(config_file) {
		var _config_settings_file_path = _pathtoconfig + '/' + config_file;
		var file_contents = fs.readFileSync(_config_settings_file_path, 'utf8');
		var _config = JSON.parse(file_contents);
		// return the config settings
		return _config;
	};

	// Read the passed configfile
	// Need to separate upon each configuration
	var _getConfString = function(config_file) {
		// Params
		var _ports = '';
		var _volumes = '';
		// Get configs
		var _config_volumes = _getSetting(config_file, 'volumes');
		var _config_ports = _getSetting(config_file, 'ports');
		var _config_memory = ' -m ' + _getSetting(config_file, 'memory');
		var _config_demonized = _getSetting(config_file, 'demonized') ? '-d ' : '';
		// Write out ports to string
		_config_ports.forEach( function(port) {
			_ports += ' -p ' + port.host + ':' + port.container; 
		});
		// Write out volumes to string
		_config_volumes.forEach( function(volume) {
			_volumes += ' -v ' + volume.host + ':' + volume.container; 
		});
		console.log('_ports', _ports); 
		console.log('_volumes', _volumes); 
		console.log('_config_memory', _config_memory);
		// Add everything together and return as string -d (demonized)
		return _config_demonized + _config_memory + _ports + _volumes;
	};
 

	// exposed members
	return {
		getSettings : _getSettings,
		getSetting : _getSetting,
		getConfString : _getConfString
	};
}();
module.exports = ConfigReader;
