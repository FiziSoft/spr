const { VantResolver, VantImports } = require('@vant/auto-import-resolver');
const AutoImport = require('unplugin-auto-import/webpack');
const Components = require('unplugin-vue-components/webpack');

const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true
})

module.exports = {
  configureWebpack: {
    plugins: [
        // when the unplugin-vue-components version is greater than or equal to 0.26.0:
      AutoImport.default({
        imports: [VantImports()],
        resolvers: [VantResolver()],
      }),
      Components.default({ resolvers: [VantResolver()] }),
    ],
  },
};