module.exports = {
  devServer: {
    host: '0.0.0.0',
    port: 8085,
    https: true,
    hot: true,
    disableHostCheck: true
  },
  transpileDependencies: [
    'vuetify'
  ]
}
