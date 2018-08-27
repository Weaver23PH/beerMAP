var config = {
    entry: ['./index.js'],
    output: {
        filename: './out.js',
    },
    devServer: {
        inline: true,
        port: 8080
    },
   // mode:'production',
    watch:true,
    module: {
        rules: [
            {
                test: /\.js?$/,
                exclude: /node_modules/,
                loader: 'babel-loader',
                query: {
                    presets: ['es2015']
                }
            }
        ]
    }
};

module.exports = config;