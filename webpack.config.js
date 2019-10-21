const commonConfig = require('./webpack.common.config');
const rendererConfig = {
	...commonConfig,
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
	entry: {
		main: './src/shell-electron/index.ts'
	},
	target: 'electron-main',
	node: {
		__dirname: true
	}
};


module.exports = [mainConfig, rendererConfig];