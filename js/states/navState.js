
export default class NavState extends Phaser.State {

    init(props) {
        console.log("启动 NavState");
    }

    create() {
        this.createDisplayObj();
        var bgm = this.game.add.audio('bgm');
        var success = this.game.add.audio('success');
        bgm.loopFull();
        audioManager.register('bgm', bgm)
        audioManager.register('success', success, 1)
    }
    loadComplete() {
        console.log('加载完成');
    }

    //创建显示对象
    createDisplayObj() {
        var scale = this.game.resolution
        const windowWidth = window.innerWidth,
            windowHeight = window.innerHeight;
        let game = this.game;
        //创建背景图片，背景图片宽高设置成屏幕可用宽高

        let bgpreloadImg = game.add.image(windowWidth / 2, windowHeight / 2, "bg");
        var r = bgpreloadImg.width / bgpreloadImg.height;
        bgpreloadImg.anchor.set(0.5);
        if (r > windowWidth / windowHeight) {
            bgpreloadImg.height = windowHeight;
            bgpreloadImg.width = windowHeight * r;
        } else {
            bgpreloadImg.width = windowWidth;
            bgpreloadImg.height = windowWidth / r;
        }

        var btn = game.add.image(windowWidth / 2, windowHeight / 2, "buttonlan");

        btn.anchor.set(0.5);

        var r = btn.width / btn.height;
        btn.width = windowWidth * 0.5;
        btn.height = windowWidth * 0.5 / r
        //第一个文字按钮，并添加点击事件，跳转到GameState
        let playText = game.add.text(windowWidth / 2, windowHeight / 2, "开始游戏", {
            font: '22px',
            fill: "#fff",
            align: "center"
        });
        playText.anchor.set(0.5, 0.5);
        playText.inputEnabled = true;
        playText.events.onInputUp.add(() => {
            console.log("跳转游戏页面");
            this.game.state.start("GameState");
            start_time = new Date().getTime()
        });
        btn.inputEnabled = true;
        btn.events.onInputUp.add(() => {
            console.log("跳转游戏页面");
            this.game.state.start("GameState");
            start_time = new Date().getTime()
        });


    }
}