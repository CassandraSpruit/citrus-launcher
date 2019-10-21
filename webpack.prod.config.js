const path = require('path');
const commonConfig = require('./webpack.common.config');
const webpack = require('webpack');

const prodCommon = {

};

const rendererConfig = {
    ...commonConfig,
    ...prodCommon,
	entry: {
		app: './src/app/index.ts',
	},
	target: 'electron-renderer',
	node: {
		__dirname: true,
		__filename: true
	}
};

const mainConfig = {
    ...commonConfig,
    ...prodCommon,
	entry: {
		main: './src/shell-electron/index.ts'
	},
	target: 'electron-main',
	node: {
		__dirname: false
	}
};


module.exports = [mainConfig, rendererConfig];