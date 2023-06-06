
export default class PreLoadState extends Phaser.State {

    constructor(keyState) {
        super();
        this.keyState = keyState;
    }
    init(props) {
        console.log("启动 PreLoadState");
        this.game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
    }
    loadComplete() {
        console.log('加载完成');
        var game = this.game
        var len = Object.keys(puzzlePiecesData).length;
        var i = 0;
        // for (const key in puzzlePiecesData) {
        //     if (Object.hasOwnProperty.call(puzzlePiecesData, key)) {
        //         let item = puzzlePiecesData[key];
        //         item.bg.src = puzzle_img
        //     }
        // }
        for (const key in puzzlePiecesData) {
            if (Object.hasOwnProperty.call(puzzlePiecesData, key)) {
                var o = puzzlePiecesData[key];
                o.bg.src = puzzle_img
                o.block.src = assets_host + o.block.src;
                o.border.src = assets_host + o.border.src;
                o.ready = function () {
                    i++;
                    puzzlePieces.push({
                        name: key,
                        img: this.get(),
                    });

                    if (i == len - 1) {
                        setTimeout(function () {
                            game.state.start("piecesLoad");
                        }, 16)
                    }
                };
                var puzz = new makePuzzlePiece(puzzlePiecesData[key]);

            }
        }


    }
    preload() {
        var game = this.game;
        game.load.crossOrigin = 'anonymous';
        game.load.onLoadComplete.addOnce(this.loadComplete, this);
        //加载资源
        this.loadAssets();

        //处理加载资源的动画
        this.createDisplayObj();


    }

    create() {
        //根据keyState的值判断将要跳转的页面，为了方便开发测试，上线时这个值为空或者未定义，跳转到NavState页面

        // console.log(this.keyState);
        // if (this.keyState) {
        //     this.game.state.start(this.keyState);
        // } else {
        //     this.game.state.start("NavState");
        // }

    }



    loadAssets() {
        let game = this.game;
        game.load.onLoadComplete.addOnce(this.loadComplete, this);
        //加载其他页面用到的所有资源
        game.load.image('bg', puzzle_img);
        game.load.image('bgsongname', '/images/bgsongname.png');
        game.load.image('listhead', '/images/listhead.png');
        game.load.image('backw', '/images/backw.png');
        game.load.image('restart', '/images/restart.png');
        game.load.image('save', '/images/save.png');

        game.load.image('tanceng', '/images/tanceng.png');
        game.load.image('listen', '/images/listen.png');
        game.load.image('button', '/images/button.png');
        game.load.image('buttonlan', '/images/buttonlan.png');
        game.load.image('back', '/images/back.png');
        game.load.image('btnhui', '/images/btnhui.png');


        game.load.image("sheet0", "/images/sheet0.png");
        game.load.image("sheet1", "/images/sheet1.png");
        game.load.image("sheet2", "/images/sheet2.png");
        game.load.image("backBtn", "/images/back_btn.png");
        game.load.image("right", "/images/right.png");
        game.load.image("container_bg", "/images/container_bg.png");
        game.load.image("end", "/images/end.png");
        game.load.image("end_box", "/images/end_box.png");
        game.load.image("btn1", "/images/btn1.png");
        game.load.image("btn2", "/images/btn2.png");

        game.load.audio("bgm", "/audio/bgm.mp3");
        game.load.audio("success", "/audio/success.mp3");



        //处理加载失败的资源
        this.errorList = []
        game.load.onFileError.add((key, file) => {
            this.errorList.push(
                {
                    key: key,
                    errorMessage: file.errorMessage
                }
            )
        })


        game.load.onFileComplete.add((progress) => {
            //1.计算矩形宽度，2.重新画矩形遮罩，实现进度条的增加
            let length = progress / 100 * this.progressImg.width;
            this.maskGraphics.clear();
            this.maskGraphics.beginFill(0xffffff);
            this.maskGraphics.drawRect(-this.progressImg.width / 2, -this.progressImg.height / 2, length, this.progressImg.height);
            this.maskGraphics.endFill();

            if (progress == 100) {

                //模拟上报服务器
                if (this.errorList.length) {
                    console.log("失败的资源：" + JSON.stringify(this.errorList))
                }
            }
        })


    }

    createDisplayObj() {
        // let { windowWidth, windowHeight } = wx.getSystemInfoSync()
        const windowWidth = window.innerWidth,
            windowHeight = window.innerHeight;
        let game = this.game;
        //创建背景图片，背景图片宽高设置成屏幕可用宽高
        let bgpreloadImg = game.add.image(0, 0, "bgpreload");



        bgpreloadImg.width = windowWidth;
        bgpreloadImg.height = windowHeight;

        //加载动画，创建一个组，把所有元素放入这个组中
        let snailGroup = game.add.group();
        snailGroup.position.set(windowWidth / 2, windowHeight / 2);

        let progressImg = game.add.image(0, 0, 'progress', null, snailGroup);
        progressImg.anchor.set(0.5, 0.5);

        let progressScale = windowWidth * 0.7 / progressImg.width;
        progressImg.scale.set(progressScale, progressScale);

        //创建遮罩，遮罩是一个矩形
        let maskGraphics = game.add.graphics(0, 0, snailGroup);
        maskGraphics.beginFill(0xffffff);
        maskGraphics.drawRect(-progressImg.width / 2, -progressImg.height / 2, progressImg.width, progressImg.height);
        maskGraphics.endFill();
        this.maskGraphics = maskGraphics;

        //进度条的遮罩设置为maskGraphics，maskGraphics画出一个矩形
        progressImg.mask = maskGraphics;
        this.progressImg = progressImg;

        let snailImg = game.add.image(0, -progressImg.height / 2, "snail", null, snailGroup);
        snailImg.anchor.set(0.5, 1);
        snailImg.scale.set(progressScale, progressScale);


        let loadingImg = game.add.image(-15, progressImg.height / 2 + 10, "loading", null, snailGroup);
        loadingImg.anchor.set(0.5, 0);
        loadingImg.scale.set(progressScale, progressScale);

        //创建两个tween动画
        let snailImgTween = game.add.tween(snailImg).to({ y: -progressImg.height / 2 - 15 }, 800, "Linear", true, 0, -1, true);
        let loandingImgTween = game.add.tween(loadingImg).to({ x: 15 }, 800, "Linear", true, 0, -1, true);

        //开发者信息，包含一个图片和一段文字，把这两个放进一个组中
        let developInfoGroup = game.add.group();
        developInfoGroup.position.set(windowWidth / 2, windowHeight - 100);
        let logoImg = game.add.image(0, 0, "logo", null, developInfoGroup);
        logoImg.scale.set(0.08, 0.08)


        /*  把包含图片和文字的这个组，生成一个图片资源，并用这个资源创建一个图片对象，
         这样更利于去居中定位 */
        //（居中定位）扩展：可以通过developInfoGroup实际宽度和高度，然后设置developInfoGroup的坐标
        let delelopTexture = developInfoGroup.generateTexture();

        let developInfoGroupImg = game.add.image(windowWidth / 2, windowHeight - 2, delelopTexture);
        developInfoGroupImg.anchor.set(0.5, 1)
        developInfoGroup.destroy()

    }
}