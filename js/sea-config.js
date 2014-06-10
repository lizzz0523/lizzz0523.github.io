seajs.config({
    // 别名配置
    alias: {
      'backbone': 'sea-modules/backbone/1.1.2/backbone-min',
      'underscore': 'sea-modules/underscore/1.6.0/underscore-min',
      'jquery': 'sea-modules/jquery/1.8.3/jquery.min'
    },

    // 路径配置
    paths: {
      'app': 'app-modules'
    },

    // 文件编码
    charset: 'utf-8'
});