module.exports = {
  transpileDependencies: ['vuetify', 'vuex-module-decorators'],
  devServer: {
    proxy: {
      api: {
        target: 'http://localhost:3000',
        changeOrigin: true,
      },
    },
  },
};
