



export default class GameState extends Phaser.State {

    init(props) {
        console.log("启动 GameState");
        //开启arcade物理引擎        
        this.game.physics.startSystem(Phaser.Physics.ARCADE);

        audioManager.play('bgm')
        this.pieces = [];
        this.complete = false;
        this.stage.smoothed = false

    }
    checkLinks(piece) {
        let gridWidth = GameLayer.DrawingBoard.gridWidth;

        var list = this.board.children[0].children;

        list.forEach(item => {
            list.forEach(aitem => {
                if (aitem != item) {
                    if (item.info.y == aitem.info.y) {
                        if ((item.info.x == aitem.info.x + 1 && Math.floor(item.x) == Math.floor(aitem.x + gridWidth) && item.y == aitem.y) ||
                            (item.info.x == aitem.info.x - 1 && Math.floor(item.x) == Math.floor(aitem.x - gridWidth) && item.y == aitem.y)) {
                            if (!item.links.includes(aitem)) {
                                item.links.push(aitem)
                                aitem.links.push(item);

                                var tween = this.game.add.tween(item.children[0]).to({ alpha: 1 }, 300, "Linear", true);
                                var tween = this.game.add.tween(aitem.children[0]).to({ alpha: 1 }, 300, "Linear", true);
                                tween.onComplete.add(function () {
                                    var tween = this.game.add.tween(item.children[0]).to({ alpha: 0 }, 300, "Linear", true);
                                    var tween = this.game.add.tween(aitem.children[0]).to({ alpha: 0 }, 300, "Linear", true);
                                }, this)
                            }
                        }
                    }
                    if (item.info.x == aitem.info.x) {
                        if ((item.info.y == aitem.info.y + 1 && Math.floor(item.y) == Math.floor(aitem.y + gridWidth) && item.x == aitem.x) ||
                            (item.info.y == aitem.info.y - 1 && Math.floor(item.y) == Math.floor(aitem.y - gridWidth) && item.x == aitem.x)) {
                            if (!item.links.includes(aitem)) {
                                item.links.push(aitem)
                                aitem.links.push(item);
                                var tween = this.game.add.tween(item.children[0]).to({ alpha: 1 }, 300, "Linear", true);
                                var tween = this.game.add.tween(aitem.children[0]).to({ alpha: 1 }, 300, "Linear", true);
                                tween.onComplete.add(function () {
                                    var tween = this.game.add.tween(item.children[0]).to({ alpha: 0 }, 300, "Linear", true);
                                    var tween = this.game.add.tween(aitem.children[0]).to({ alpha: 0 }, 300, "Linear", true);
                                }, this)
                            }
                        }
                    }
                }
            })

        })
    }
    getSpriteGird(item, x, y) {
        let gridWidth = GameLayer.DrawingBoard.gridWidth;
        var _x = x != undefined ? x : item.x;
        var _y = y != undefined ? y : item.y;
        let col = Math.floor(_x / gridWidth);
        let row = Math.floor(_y / gridWidth);

        if (item.links.length == 0) {
            if (col >= GameLayer.DrawingBoard.col) {
                col = GameLayer.DrawingBoard.col - 1;
            }
            if (row >= GameLayer.DrawingBoard.row) {
                row = GameLayer.DrawingBoard.row - 1;
            }
            if (col < 0) {
                col = 0;
            }
            if (row < 0) {
                row = 0
            }
        } else {
            var links = this.getLinks(item);
            var left_col = item.info.x;
            var right_col = item.info.x;
            var bottom_row = item.info.y;
            var top_row = item.info.y;

            links.forEach(item => {
                var info = item.info;
                right_col = right_col < info.x ? info.x : right_col;
                left_col = left_col > info.x ? info.x : left_col;

                bottom_row = bottom_row < info.y ? info.y : bottom_row
                top_row = top_row > info.y ? info.y : top_row
            })

            var right_offset = right_col - item.info.x;
            var left_offset = item.info.x - left_col;
            var top_offset = item.info.y - top_row;
            var bottom_offset = bottom_row - item.info.y;

            if (col + right_offset > GameLayer.DrawingBoard.col - 1) {
                col = GameLayer.DrawingBoard.col - 1 - right_offset
            }
            if (col - left_offset < 0) {
                col = left_offset
            }
            if (row + bottom_offset > GameLayer.DrawingBoard.row - 1) {
                row = GameLayer.DrawingBoard.row - 1 - bottom_offset
            }
            if (row - top_offset < 0) {
                row = top_offset
            }
        }
        return { row, col }
    }
    moveToGird(item, col, row) {
        let gridWidth = GameLayer.DrawingBoard.gridWidth;
        return this.game.add.tween(item).to({ y: row * gridWidth + gridWidth / 2, x: col * gridWidth + gridWidth / 2 }, 100, "Linear", true);
    }
    createLayer() {
        var layer = this.game.add.graphics((this.world.width - GameLayer.width) / 2, (this.world.height - GameLayer.height) / 2);
        layer.beginFill(0xffffff, 1);
        layer.drawRoundedRect(0, 0, GameLayer.width, GameLayer.height, 10);
        layer.endFill();
        var border = 4;
        var layer_content = this.game.add.graphics(border, border)
        layer_content.beginFill(0x6bb8fe, 1);
        layer_content.drawRoundedRect(0, 0, layer.width - 2 * border, layer.height - 2 * border, 10)
        layer_content.endFill();
        layer.addChild(layer_content)
        this.layer_content = layer_content;

        this.show_group = this.game.add.group(this.layer)
        this.layer = layer;
        this.createLayerHeader();
        this.createBoard();
        this.createPuzzlePiecesLayer();
        this.createPieces();
    }
    createLayerHeader() {
        var text1 = this.game.add.text(0, 0, GameLayer.header.title, { font: "20px Arial Black", fill: "#fff" });
        text1.stroke = "#02377c";
        text1.strokeThickness = 2;
        //  Apply the shadow to the Stroke only
        text1.anchor.setTo(0.5, 0.5);
        text1.x = GameLayer.header.width / 2;
        text1.y = GameLayer.header.height / 2;
        text1.setShadow(1, 1, "#333333", 2, true, false);

        var btn = this.game.add.sprite(0, 0, 'backBtn');
        var music_btn = this.game.add.sprite(0, 0, 'listen')
        btn.anchor.setTo(0.5, 0.5);
        music_btn.anchor.setTo(0.5, 0.5);

        // btn.addChild(btn1)
        btn.y = GameLayer.header.height / 2;
        btn.x = this.layer.x + 20;
        music_btn.x = this.layer.width - 40;
        music_btn.y = GameLayer.header.height / 2;


        btn.scale.set(GameLayer.header.height * 0.6 / btn.width)
        music_btn.scale.set(GameLayer.header.height * 0.6 / music_btn.width)

        btn.inputEnabled = true;
        music_btn.inputEnabled = true;
        window.onbeforeunload = function (e) {
            e = e || window.event;

            if (e) {
                e.returnValue = '游戏尚未完成，确定要退出吗';
            }

            return "游戏尚未完成，确定要退出吗";
        }
        btn.events.onInputUp.add(function () {
            var message_obj = new general_dialog(
                "游戏尚未完成，确定要退出吗",
                function () {
                    window.history.back();
                    message_obj.close();
                },
                function () {
                    message_obj.close();
                }
            );
        }, this)
        music_btn.tint = 0x1ba196
        music_btn.events.onInputUp.add(function () {
            if (audioManager.status == true) {
                music_btn.tint = 0xf3f3f3
                audioManager.set_all_pause()
            } else {
                music_btn.tint = 0x1ba196
                audioManager.resume_music()
            }

        }, this)
        this.layer.addChild(btn)
        this.layer.addChild(music_btn)
        this.layer.addChild(text1)
    }
    createBoard() {
        var l = (GameLayer.width - GameLayer.DrawingBoard.width) / 2;
        var t = GameLayer.header.height
        var content = this.game.add.graphics(l, t);
        content.beginFill(0x62aff2, 1);
        var border = GameLayer.DrawingBoard.border
        content.drawRect(0, 0, GameLayer.DrawingBoard.width, GameLayer.DrawingBoard.height);

        var realContent = this.game.add.graphics(l + border + (this.world.width - GameLayer.width) / 2, t + border + (this.world.height - GameLayer.height) / 2);
        var mask = this.game.add.graphics(l + border + (this.world.width - GameLayer.width) / 2, t + border + (this.world.height - GameLayer.height) / 2);


        realContent.beginFill(0x1f3a55, 1);
        mask.beginFill(0x1f3a55, 1);
        realContent.inputEnabled = true;
        realContent.drawRect(0, 0, GameLayer.DrawingBoard.width - border * 2, GameLayer.DrawingBoard.height - border * 2);
        mask.drawRect(0, 0, GameLayer.DrawingBoard.width - border * 2, GameLayer.DrawingBoard.height - border * 2);

        realContent.mask = mask;
        content.addChild(realContent)
        this.layer.addChild(content);
        this.board = realContent;
        this.show_group.add(this.board)
        this.game.physics.arcade.enable([this.board], Phaser.Physics.ARCADE);
    }
    showEnd() {
        end_time = new Date().getTime()
        var _this = this;
        var game = this.game;
        
        var content = game.add.graphics(0, 0);
        content.beginFill(0x000000, 0.3);
        content.drawRect(0, 0, window.innerWidth, window.innerHeight);
        var box = game.add.sprite(_this.world.width * 0.2 / 2, _this.world.height * 0.3, 'end_box');
        var end = game.add.sprite(0, 0, 'end');
        var btn1 = game.add.sprite(0, 0, 'btn1');
        var btn2 = game.add.sprite(0, 0, 'btn2');
        audioManager.play('success')
        end.anchor.set(0.5);
        // box.anchor.set(0.5)
        box.scale.set(_this.world.width * 0.8 / box.width)

        end.x = box.width / 2;
        end.y = 0
        btn1.anchor.set(0.5);
        btn2.anchor.set(0.5);
        // box.addChild(btn2)
        btn2.scale.set(_this.world.width * 0.3 / btn2.width)
        btn2.y = box.y + box.height + 40;
        btn2.x = box.x + box.width - btn2.width / 2 - 20;
        btn1.scale.set(_this.world.width * 0.3 / btn1.width)
        btn1.y = box.y + box.height + 40;
        btn1.x = box.x + btn1.width / 2 + 20;

        end.scale.set(_this.world.width * 0.4 / end.width)
        end.y = box.y;
        end.x = box.x + box.width / 2;
        var text1 = game.add.text(0, 0, "分享", { font: "60px Arial Black", fill: "#fff" });
        text1.stroke = "#02377c";
        text1.strokeThickness = 2;
        //  Apply the shadow to the Stroke only
        text1.anchor.setTo(0.5, 0.5);
        text1.x = 0;
        text1.y = 0;
        text1.setShadow(2, 2, "#333333", 2, true, false);
        btn1.addChild(text1);
        var text2 = game.add.text(0, 0, "再玩一次", { font: "60px Arial Black", fill: "#fff" });
        text2.stroke = "#02377c";
        text2.strokeThickness = 2;
        //  Apply the shadow to the Stroke only
        text2.anchor.setTo(0.5, 0.5);
        text2.x = 0;
        text2.y = 0;
        text2.setShadow(2, 2, "#333333", 2, true, false);

        function get_time_string(time) {
            var h = Math.floor(time / 3600);
            var m = time % 3600;
            var s = m % 60;
            if (time > 3600) {
                return `${h}小时${Math.floor(m / 60)}分${Math.floor(s)}秒`
            }
            if (time > 60) {
                return `${Math.floor(m / 60)}分${Math.floor(s)}秒`
            }
            return `${Math.floor(s)}秒`
        }
        var text3 = game.add.text(0, 0, `你的成绩：${get_time_string(end_time - start_time)}`, { font: "20px Arial Black", fill: "#fff" });
        text3.stroke = "#02377c";
        text3.strokeThickness = 2;
        //  Apply the shadow to the Stroke only
        text3.anchor.setTo(0.5, 0.5);

        text3.setShadow(2, 2, "#333333", 2, true, false);

        // box.addChild(text3)

        text3.x = _this.world.width / 2;
        text3.y = box.height / 2 + box.y;

        content.addChild(btn1)
        content.addChild(btn2)
        content.addChild(box)
        content.addChild(text3)
        content.addChild(end)
        btn2.addChild(text2);
        btn1.inputEnabled = true;
        btn2.inputEnabled = true;
        _this.tipLayer = content;
        btn2.events.onInputUp.add(function () {
            this.replay()
        }, _this)
        btn1.events.onInputUp.add(function () {
            this.showShare()
        }, _this)

    }
    create() {
        this.createLayer();
    }
    replay() {
        // alert('再玩一次')
        var tween = this.game.add.tween(this.tipLayer).to({ alpha: 0 }, 300, "Linear", true);
        this.complete = false;
        start_time = new Date().getTime()
        step_arr = [];
        this.pieces.forEach(piece => {
            piece.links = []
        })
        var arr = this.pieces.sort((a, b) => {
            return Math.random() - Math.random()
        })
        this.PiecesLayer.addList(arr)
        tween.onComplete.add(function () {
            this.tipLayer.kill();

        }, this)

    }
    showShare() {
        window.show_share && window.show_share()
    }
    getLinks(sprite) {
        var res = [];
        function get_next(s) {
            s.links.forEach(item => {
                if (!res.includes(item) && item != sprite) {
                    res.push(item)
                    return get_next(item)
                }
            });
            return res;
        }
        return get_next(sprite)
    }


    piecesReSort() {
        var pieces = this.board.children[0].children;
        var sort_object = {}
        pieces.forEach(item => {
            let _links = this.getLinks(item);
            var l = _links.length;
            if (!item.inputEnabled) {
                l = pieces.length;
            }
            if (!sort_object[l]) {
                sort_object[l] = [];
            }
            sort_object[l].push(item);
        })

        var arr = [];
        for (const key in sort_object) {
            if (Object.hasOwnProperty.call(sort_object, key)) {
                arr.push({
                    sort: key,
                    list: sort_object[key]
                })
            }
        }
        arr = arr.sort((a, b) => b.sort - a.sort);

        arr.forEach(item => {
            let arr = item.list;
            arr = arr.sort((a, b) => a._touch_time - b._touch_time);
            arr.forEach(item => {
                item.bringToTop();
            })
        })
    }
    createPieces() {
        var tween;
        var gridWidth = GameLayer.DrawingBoard.gridWidth
        var pieceGroup = this.game.add.group();
        var t = new Date().getTime();
        puzzlePieces.forEach(puzzlePiece => {

            var info = { x: puzzlePiecesData[puzzlePiece.name].bg.x, y: puzzlePiecesData[puzzlePiece.name].bg.y };

            var x = info.x * gridWidth + gridWidth / 2;
            var y = info.y * gridWidth + gridWidth / 2;;

            var piece = pieceGroup.create(x, y, puzzlePiece.name);
            // var border = pieceGroup.create(0, 0, puzzlePiece.name);
            var border = pieceGroup.create(0, 0, puzzlePiece.name + '_border');
            border.anchor.setTo(0.5, 0.5);
            piece.addChild(border);


            piece.inputEnabled = true;
            // piece.input.enableDrag(false, true, true, 100);
            piece.anchor.setTo(0.5, 0.5);
            piece._in_scale = gridWidth / puzzlePiecesData[puzzlePiece.name].width;

            piece.scale.set(piece._in_scale)
            piece.lock = false;
            piece.info = info;
            piece.links = [];

            piece._touch_time = t;
            let links = [];
            piece.events.onDragStart.add(function (sprite, pointer, x, y) {
                links = this.getLinks(sprite);

                console.log('piece-start -- ');
                var s_info = sprite.info;
                piece.bringToTop()

                this.show_group.bringToTop(this.board);
                var mask = this.board.mask;
                mask.alpha = 0;
                this.board.mask = null;
                var t = new Date().getTime();
                piece._touch_time = t;

                links.forEach(item => {
                    item._touch_time = t;
                    item.bringToTop()
                })
                piece.events.onDragUpdate.add(function (sprite, pointer, x, y) {
                    console.log('piece-update -- ');
                    links.forEach(item => {
                        if (item != sprite) {
                            var info = item.info;
                            item.x = sprite.x - (s_info.x - info.x) * gridWidth
                            item.y = sprite.y - (s_info.y - info.y) * gridWidth
                        }
                    })
                }, this)

                piece.events.onDragStop.add(function (sprite) {
                    mask.alpha = 1;
                    this.board.mask = mask;
                    console.log('piece-stop -- ');
                    piece.events.onDragUpdate.removeAll()
                    piece.events.onDragStop.removeAll()
                    tween && tween.stop();
                    let position = this.getSpriteGird(piece);
                    step_arr.push(new Date().getTime())
                    tween = this.moveToGird(piece, position.col, position.row);
                    if (links.length > 0) {
                        this.piecesReSort()
                    } else {
                        sprite.bringToTop()
                    }
                    if (sprite.links.length == 0) {
                        var _this = this;
                        this.game.physics.arcade.overlap(sprite, this.PiecesLayer.box, function (item, board) {
                            var x = sprite.x - _this.PiecesLayer.box.x;
                            var i = Math.ceil((x - 70) / 110);
                            _this.PiecesLayer.add(sprite, i);
                        })
                    }
                    links.forEach(item => {
                        let position = this.getSpriteGird(item);
                        tween = this.moveToGird(item, position.col, position.row);
                    })
                    if (position.col == piece.info.x && position.row == piece.info.y && links.length >= 2) {
                        //  位置正确
                        piece.inputEnabled = false;
                        links.forEach(item => {
                            item.inputEnabled = false;
                        })
                    }
                    tween.onComplete.add(function () {
                        this.checkLinks(piece)
                    }, this)

                    // tween = this.game.add.tween(piece).to({ y: position.row * gridWidth + gridWidth / 2, x: position.col * gridWidth + gridWidth / 2 }, 300, "Linear", true);

                    // cat.inputEnabled = false; 可以禁止拖拽
                }, this);

            }, this)


            this.pieces.push(piece);

        })

        this.board.addChild(pieceGroup)

        this.pieces.forEach((item, i) => {
            this.game.add.tween(item).to({ y: this.board.height }, 1000, Phaser.Easing.Bounce.Out, true, 500 + 100 * i, 0);
            // Add another rotation tween to the same character.
            tween = this.game.add.tween(item).to({ angle: 80, alpha: 0 }, 1000, Phaser.Easing.Cubic.In, true, 500 + 100 * i, 0);

            tween.onComplete.add(function () {
                this.PiecesLayer.add(item, i)
            }, this)

        })
        // 

    }
    update() {
        if (this.PiecesLayer) {
            this.PiecesLayer.dealScrollObject();
        }
        if (this.board.children[0].children.length != 0 && !this.complete) {
            var links = this.getLinks(this.board.children[0].children[0]);
            // console.log('LINKS:' + links.length);
            if (links.length == GameLayer.DrawingBoard.col * GameLayer.DrawingBoard.row - 1) {
                this.complete = true;
                this.showEnd();
            }
        }
    }


    createPuzzlePiecesLayer() {

        var box = this.game.add.sprite((GameLayer.width - GameLayer.CollectionBox.width) / 2, GameLayer.height - 20 - GameLayer.CollectionBox.height, 'container_bg');
        var right = this.game.add.sprite(box.width, box.height / 2, 'right');
        var left = this.game.add.sprite(0, box.height / 2, "right");
        var shadowRight = this.game.add.sprite(box.width, box.height / 2, 'right')
        var shadowLeft = this.game.add.sprite(0, box.height / 2, 'right')

        shadowRight.anchor.set(0.5);
        shadowLeft.anchor.set(0.5);
        shadowRight.tint = 0x000000;
        shadowLeft.tint = 0x000000;
        shadowLeft.alpha = 0.6;
        shadowRight.alpha = 0.6;

        right.anchor.set(0.5);
        left.anchor.set(0.5);
        left.angle = 180
        shadowLeft.angle = 180

        shadowRight.y += 2;
        shadowLeft.y += 2;
        shadowRight.x += 2;
        shadowLeft.x += 2;

        var scale = GameLayer.CollectionBox.height * 0.3 / right.width;

        right.scale.set(scale)
        shadowRight.scale.set(scale)
        shadowLeft.scale.set(scale)

        left.scale.set(scale)
        this.PiecesLayer = new PuzzlePiecesLayer(this.game, 9);

        box.width = GameLayer.CollectionBox.width;
        box.height = GameLayer.CollectionBox.height;

        this.PiecesLayer.editGroup.y = GameLayer.height - 20 - GameLayer.CollectionBox.height + (this.world.height - GameLayer.height) / 2;


        box.addChild(shadowLeft)
        box.addChild(left)
        box.addChild(shadowRight)
        box.addChild(right)

        this.show_group.add(this.layer.addChild(this.PiecesLayer.editGroup))
        this.layer.addChild(box)

    }





}