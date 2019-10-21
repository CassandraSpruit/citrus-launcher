const HtmlWebpackPlugin = require('html-webpack-plugin');
const TsConfigPathWebpackPlugin = require('tsconfig-paths-webpack-plugin');
const path = require('path');

const commonConfig = {
	devtool: 'inline-source-map',
	module: {
		rules: [
			{
				test: /\.ts$/,
				use: [{
					loader: 'ts-loader',
					options: {
						transpileOnly: true,
						context: __dirname,
						configFile: 'tsconfig.json'
					}
				}],
				exclude: /node_modules/,
			},
			{
				test: /\.(scss|css)$/,

				use: [
					{
						loader: 'style-loader'
					},
					{
						loader: 'css-loader'
					},
					{
						loader: 'sass-loader'
					}
				]
			},
			{
				test: /\.html$/,
				use: [
					{
						loader: 'html-loader'
					}
				]
			},
			{ 
				test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/, 
				loader: "url-loader?limit=10000&mimetype=application/font-woff" 
			  },
			  { 
				test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/, 
				loader: "file-loader" 
			  },
		]
	},
	output: {
		filename: '[name].js'
	},
	mode: 'development',
	plugins: [
		new HtmlWebpackPlugin({
			title: 'Vivi Electron Boilerplate'
		})
	],
	resolve: {
		plugins: [
			new TsConfigPathWebpackPlugin({ configFile: path.join(__dirname, 'tsconfig.json') })
		],
		modules: [
			path.resolve(__dirname, 'src'),
			'node_modules',
		],
		extensions: ['.ts', '.js', '.json'],
		alias: {
			vivi_application: path.resolve(__dirname, 'src/app/')
		}
	}
};

module.exports = commonConfig;