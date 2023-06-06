


export default class BootState extends Phaser.State {

    init() {
        console.log("启动 piecesLoad");
        this.game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
    }

    preload() {
        var game = this.game;
        this.game.stage.backgroundColor = "#a8d4bf";

        game.load.onLoadComplete.addOnce(this.loadComplete, this);

        puzzlePieces.forEach(item => {

            game.load.image(item.name, item.img.img);
            game.load.image(item.name + '_border', item.img.border);
        });


    }
    loadComplete() {
        this.game.state.start('NavState')
    }
    create() {
        //跳转到资源预加载页面
        // 
    }

}