export default class BootState extends Phaser.State {

    init() {
        console.log("启动 Boot");
        this.game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
    }

    preload() {
        var game = this.game;
        this.game.stage.backgroundColor = "#a8d4bf";
        game.load.crossOrigin = 'anonymous';
        game.load.onLoadComplete.addOnce(this.loadComplete, this);
        /*  
          设置资源的base地址，如果不设置或者设置为空（ game.load.baseURL =""）,
          资源会加载项目assets目录下的资源文件
          若设置则会去服务器加载资源
         */
        game.load.baseURL = assets_host;

        //加载preloadState页面需要的所有资源
        game.load.image('bgpreload', '/images/bgpreload.png');
        //加载动画图片
        game.load.image('loading', '/images/loading.png');
        game.load.image('progress', '/images/progress.png');
        game.load.image('snail', '/images/snail.png');


        //用于封装资源加载异常信息
        this.errorList = []

        //onFileError资源加载异常的回调
        game.load.onFileError.add((key, file) => {
            //把异常信息添加到errorList数组中
            this.errorList.push(
                {
                    key: key,
                    errorMessage: file.errorMessage
                }
            )
        })



    }
    loadComplete() {
        this.game.state.start("PreLoadState");
        if (this.errorList.length) {
            console.log("失败的资源：" + JSON.stringify(this.errorList))
        }
    }
    create() {
        //跳转到资源预加载页面
        // 
    }

}