const path = require( 'path' );
const webpack = require( 'webpack' );

module.exports = {
	context: path.resolve( __dirname, './src' ),
	entry: {
  		devServer: 'webpack-dev-server/client?http://0.0.0.0:3000',
		hot: 'webpack/hot/only-dev-server', // "only" prevents reload on syntax errors
		nodes: './index.tsx'
	},
	module: {
		rules: [
			{
				test: /\.ts[x]?$/,
				enforce: 'pre',
				use: [
					{
						loader: 'tslint-loader',
					}
				]
			},
			{
				test: /\.ts[x]?$/,
				use: [
					{
						loader: 'awesome-typescript-loader',
					}
				],
			},
		],
	},
	resolve: {
		extensions: [
			'.ts',
			'.tsx',
			'.js',
			'.jsx'
		],
		modules: [
			path.resolve(__dirname, './src'),
			'node_modules'
		]
	},
	output: {
		path: path.resolve(__dirname, './dist'),
		filename: '[name].bundle.js',
		publicPath: '/'
	},
	plugins: [
		new webpack.HotModuleReplacementPlugin(),
	    new webpack.LoaderOptionsPlugin({
	        options: {
	            tslint: {
	                emitErrors: true,
	                failOnHint: true,
	                exclude: /(node_modules)/
	            }
	        }
		}),
		new webpack.DefinePlugin({
			'process.env': {
				NODE_ENV: JSON.stringify('development'),
			},
		}),
	],
	devServer: {
		contentBase: path.resolve( __dirname, './dist' ),
		inline: true,
		hot: true,
		stats: 'errors-only',
		historyApiFallback: true,
		port: 3000
	}
};