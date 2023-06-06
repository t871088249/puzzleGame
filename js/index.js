
import BootState from './states/bootState.js'
import PreLoadState from './states/preLoadState.js'
import NavState from './states/navState.js'
import GameState from './states/gameState.js'
import piecesLoad from './states/piecesLoad.js'



import AudioManager from './libs/AudioManager.js';
import puzzlePiece from './libs/puzzlepiece.js'
import puzzles from './libs/block.js';
import PuzzlePiecesLayer from './libs/PuzzlePiecesLayer.js';


window.makePuzzlePiece = puzzlePiece.create;
window.puzzlePieces = [];
window.puzzlePiecesData = puzzles.list;
window.piece_gap_conf = {
    l: puzzles.l_m,
    t: puzzles.t_m,
    r: puzzles.r_m,
    b: puzzles.b_m
}
window.PuzzlePiecesLayer = PuzzlePiecesLayer





var WINDOW_WIDTH = window.innerWidth;
var WINDOW_HEIGHT = window.innerHeight;
var GameLayer = {}
var LAYER_RATE = 340 / 615;
if (WINDOW_WIDTH / WINDOW_HEIGHT > LAYER_RATE) {
    GameLayer.height = WINDOW_HEIGHT;
    GameLayer.width = GameLayer.height * LAYER_RATE
} else {
    GameLayer.width = WINDOW_WIDTH * 0.94;
    GameLayer.height = GameLayer.width / LAYER_RATE
}

GameLayer.DrawingBoard = {
    row: 3,
    col: 3,
    width: GameLayer.width * 0.91,
    height: GameLayer.height * 0.75,
    border: 3,
}
GameLayer.DrawingBoard.contentWidth = GameLayer.DrawingBoard.width - GameLayer.DrawingBoard.border * 2
GameLayer.DrawingBoard.gridWidth = GameLayer.DrawingBoard.contentWidth / GameLayer.DrawingBoard.col
GameLayer.CollectionBox = {

    width: 320 / 340 * GameLayer.width,
    height: 85 / 340 * GameLayer.width,
}
GameLayer.header = {
    width: GameLayer.width,
    height: 50 / 340 * GameLayer.width,
    title: puzzle_title
}

window.audioManager = new AudioManager()



window.GameLayer = GameLayer;


class Game extends Phaser.Game {
    constructor() {

        let windowWidth = window.innerWidth,
            windowHeight = window.innerHeight;
        //配置game的参数


        const conf = {
            width: window.innerWidth,
            height: window.innerHeight,
            render: Phaser.AUTO,
            resolution: window.devicePixelRatio,
            transparent: true
            // scale: {
            //     resolution: window.devicePixelRatio,
            // }
        };


        //调用父类构造方法
        super(conf);

        //把游戏中所有的场景（也叫页面），添加到游戏中，类似react、vue中的路由
        this.state.add('BootState', BootState)
        this.state.add('PreLoadState', new PreLoadState(""))
        this.state.add('NavState', NavState);
        this.state.add('GameState', GameState);
        this.state.add('piecesLoad', piecesLoad);

        //启动第一个页面
        this.state.start('BootState')
    }
}

//初始化phaser程序
new Game();

// customGame.state.add('Load', load);
// customGame.state.add('piecesLoad', piecesLoad);
// customGame.state.add('Play', Play);


// customGame.state.start('Load');
