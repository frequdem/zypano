module.exports = {
    //页面入口文件配置
    entry: {
        index : './js/index.js'
    },
    //入口文件输出配置
    output: {
        path: './built',
        filename: '[name].min.js'
    }
};