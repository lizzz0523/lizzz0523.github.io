seajs.config({
    // 预加载项
    preload : [
      'vendor/underscore-min',
      'vendor/jquery-1.8.3.min',
      'vendor/backbone-min'
    ],

    // 路径配置
    paths : {
      'app': 'app-modules'
    },

    // 文件编码
    charset: 'utf-8'
});