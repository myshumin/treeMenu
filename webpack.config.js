module.exports = {

	// 入口
	entry: './src/js/app.js',

	// 输出
	output: {
		path: './dist/js',
		filename: 'build.js',
	},

	module: {
		loaders: [{
			test: /\.js?$/,
			exclude: /node_modules/,
			loader: 'babel',

			query: {
				presets: ['es2015']
			}
		}]
	}
};