const BrowserSyncPlugin = require('browser-sync-webpack-plugin')
const dev = process.env.NODE_ENV === 'dev'
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const path = require('path')

exports.PATH = {
  src: path.join(__dirname, 'src'),
  dist: path.join(__dirname, 'dist'),
  fonts: path.join(__dirname, 'static/fonts'),
  alias: {
    shaders: path.join(__dirname, 'src/shaders'),
    components: path.join(__dirname, 'src/components'),
    styl: path.join(__dirname, 'src/styl'),
    lib: path.join(__dirname, 'src/lib')
  }
}

exports.devServer = ({host, port} = {}) => ({
  plugins: [
    new BrowserSyncPlugin({
      // browse to http://localhost:3000/ during development, 
      // ./public directory is being served 
      host: 'localhost',
      port: 3000,
      server: { baseDir: ['dist'] }
    })]
})

const devParameters = {
  sourceMap: true,
  minimize: false
}

const ProdParameters = {
  sourceMap: false,
  minimize: true
}

const commonCssLoaders = [
  {
    loader: 'css-loader',
    options: {
      importLoaders: 1,
      minimize: dev ? devParameters.minimize : ProdParameters.minimize
    }
  },
  {
    loader: 'postcss-loader',
    options: {
      sourceMap: dev ? devParameters.sourceMap : ProdParameters.sourceMap,
      plugins: () => [
        require('autoprefixer')({
          browsers: ['last 2 versions']
        })
      ]
    }
  }
]

exports.loadCSS = ({ include, exclude } = {}) => ({
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [...commonCssLoaders]
      },
      {
        test: /\.styl$/,
        use: ['style-loader', ...commonCssLoaders, 'stylus-loader']
      }
    ]
  }
})

exports.extractCSS = () => ({
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: [...commonCssLoaders]
        })
      },
      {
        test: /\.styl$/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: [...commonCssLoaders, 'stylus-loader']
        })
      }
    ]
  }
})

exports.loadShaders = () => ({
  module: {
    rules: [
      {
        test: /\.(glsl|fs|vs|frag|vert)$/,
        loader: 'webpack-glsl-loader'
      }
    ]
  }
})

exports.loadImages = ({include, exclude, options, dev} = {}) => ({
  module: {
    rules: [
      {
        test: /\.(png|jpg|svg)$/,
        include,
        exclude,
        use: {
          loader: 'file-loader',
          options: {
            name: '[path][name].[ext]'
          }
        }
      }
    ]
  }
})

exports.loadFonts = ({include, exclude, options} = {}) => ({
  module: {
    rules: [
      {
        test: /\.(ttf|eot|woff|woff2)$/,
        include: path.join(__dirname, 'static/fonts'),
        exclude,
        loader: 'file-loader?name=[name].[ext]&outputPath=fonts/&publicPath=../'
        // loader: 'file-loader',
        // options: {
        //   name: '[path][name].[ext]',
        //   outputPath: 'static/fonts/',
        //   publicPath: '../'
        // }
      }
    ]
  }
})
