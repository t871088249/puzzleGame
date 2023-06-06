
var PuzzlePiecesLayer = function (game, len) {

    this.len = len;
    this.currentScrollBox = null;
    this.body;
    this.gameHeight = 0;
    // this.pieces = pieces;
    this.width = GameLayer.CollectionBox.width - 20;
    this.height = GameLayer.CollectionBox.height - 20
    this.spriteWidth = 60;
    this.spriteHeight = 60;
    this.currentScrollBox = null;
    this.targetTween;
    this.game = game;
    this.init();
}
PuzzlePiecesLayer.prototype = {
    constructor: PuzzlePiecesLayer,
    init: function () {
        // const list = this.game.add.group(editContent);
        this.editGroup = this.game.add.group();
        this.curTarget = null;
        this.createEditContent()
    },
    createEditContent: function () {
        const editContent = this.game.add.graphics(10, 10);
        editContent.drawRect(0, 0, this.width, this.height);
        this.editGroup.add(editContent);
        this.editGroup.setAll("inputEnabled", true);

        this.list = this.game.add.group(editContent);
        this.game.physics.arcade.enable([this.list], Phaser.Physics.ARCADE);
        const mask = this.game.add.graphics((window.innerWidth - this.width) / 2, 0);
        mask.beginFill(0x333333);
        mask.drawRect(0, 0, this.width, this.game.world.height);
        this.list.mask = mask
        this.createEditListDetail(30, 60, this.height, 1);
        this.addScrollHandler();

    },

    /**
     *
     * @param {*} scaleRate    图像显示的缩放

     * @param {*} verticalW     图像显示区域的横向间距
     * @param {*} horizentalH   图像显示区域的纵向间距
     * @param {*} startX        整块图像区域的x偏移量
     * @param {*} startY        整块图像区域的y偏移量
     * @param {*} groupleft     左侧tab的宽度
     * @param {*} groupWidth    整块区域的宽度
     * @param {*} specialSize   特殊元素的缩放尺寸，由于元素的尺寸缩放标准不一，因此需要设置特殊元素的缩放尺寸
     * @param {*} verticalNum   列项数量
     *
     *   eggSpriteSheet , 0.5 , eggContent , 123 , 145 , 48 , 50 , 60 , 50 , 0 , 750 , specialSize , 4);
     */
    createEditListDetail: function (verticalW, startX, groupHeight, verticalNum) {
        // var number = this.pieces.length
        var spriteWidth = this.spriteWidth;
        var spriteHeight = this.spriteHeight;
        // const hv = number % verticalNum == 0 ? number : number + (verticalNum - (number % verticalNum));

        const box = this.game.add.graphics(0, 0, this.list);
        box.beginFill(0x5aa6f2);
        // box.beginFill(0xff8a00);
        box.drawRect(0, 0, startX + (spriteWidth + verticalW) * parseInt(this.len / verticalNum) + verticalW, groupHeight);
        box.name = "box";
        box.wrapData = [];
        this.box = box;
        this.game.physics.arcade.enable([box], Phaser.Physics.ARCADE);
    },
    addList(list) {
        console.log(list.length);
        let len = list.length;


        for (let i = len - 1; i >= 0; i--) {
            this.add(list[i]);
        }

    },
    add(item, index) {
        let startX = 60;
        let verticalW = 30;
        var spriteWidth = this.spriteWidth;
        var spriteHeight = this.spriteHeight;
        let groupHeight = this.height;
        let i = index;
        const box = this.list.getByName("box");
        if (i == undefined) {
            i = box.children.length;
        }

        let x = startX + (spriteWidth + verticalW) * i + spriteWidth / 2;
        let y = groupHeight / 2;
        item.scale.set(1);
        let realScaleRate = spriteWidth / item.width;
        item.inputEnabled = true;
        item.input.enableDrag(false);
        item.anchor.setTo(0.5, 0.5);
        item.x = x;
        item.y = y;
        item.scale.set(realScaleRate);

        item.children[0].alpha = 1;
        this.game.physics.arcade.enable([item], Phaser.Physics.ARCADE);
        item.realScaleRate = realScaleRate;
        let wrapData = {
            minX: x - spriteWidth / 2,
            maxX: x + spriteWidth / 2,
            minY: y - spriteHeight / 2,
            maxY: y + spriteHeight / 2,
        };
        if (index == undefined) {
            box.addChild(item);
            box.wrapData.push(wrapData);
        } else {
            var d = box.wrapData[box.wrapData.length - 1];
            if (!d) {
                d = {};
                d.maxX = 30;
            }
            x = d.maxX + verticalW + spriteWidth / 2;
            wrapData = {
                minX: x - spriteWidth / 2,
                maxX: x + spriteWidth / 2,
                minY: y - spriteHeight / 2,
                maxY: y + spriteHeight / 2,
            };
            box.wrapData.push(wrapData);
            if (index >= box.wrapData.length) {
                index = box.wrapData.length - 1;
            }
            var info = box.wrapData[index];
            this.game.add.tween(item).to({ y: this.height / 2, x: info.minX + spriteWidth / 2 }, 300, "Linear", true);
            box.addChildAt(item, index);
            box.children.forEach((item, i) => {
                if (i >= index) {
                    this.game.add.tween(item).to({ x: box.wrapData[i].minX + this.spriteWidth / 2, alpha: 1, angle: 0 }, 100, Phaser.Easing.Linear.None, true, 0, 0);
                }
            });

        }

    },
    addScrollHandler: function () {
        let isDrag = false; //判断是否滑动的标识
        let startX, endX, startTime, endTime;
        const box = this.list.getByName("box");

        box.inputEnabled = true;
        box.input.enableDrag();
        box.input.allowHorizontalDrag = true; //禁止横向滑动
        // box.input.allowVerticalDrag = false; //允许纵向滑动
        box.ignoreChildInput = true; //忽略子元素事件
        box.input.dragDistanceThreshold = 10; //滑动阈值
        //允许滑动到底部的最高值

        let maxBoxX = 0;
        //给父元素添加物理引擎
        this.game.physics.arcade.enable(box);

        var curTarget = null;
        var drag_item_flag = false;
        var target_top;
        var target_left;
        var init_left = box.x;
        var scale_max_flag = true;
        var startY;
        var idx;

        function dragStart(sprite, pointer, s_x, s_y) {
            console.log("start");
            isDrag = true;
            startX = s_x;
            startY = s_y;
            startTime = +new Date();
            curTarget = null;

            init_left = box.x;
            this.editGroup.parent.bringToTop(this.editGroup)

            const curX = pointer.position.x - sprite.previousPosition.x;
            const curY = pointer.position.y - sprite.previousPosition.y;
            idx = sprite.wrapData.findIndex((val, index, arr) => {
                return curX >= val.minX && curX <= val.maxX && curY >= val.minY && curY <= val.maxY;
            });

            var maxX = box.wrapData[box.wrapData.length - 1] ? box.wrapData[box.wrapData.length - 1].maxX : 0;

            if (maxX < this.width) {
                maxBoxX = 0
            } else {
                maxBoxX = this.width - maxX - 30;

            }

            box.y = 0;

            if (idx != -1) {
                curTarget = sprite.children[idx];
                target_top = curTarget.y;
                target_left = curTarget.x;

            }

            if (this.currentScrollBox) {
                //如果当前有其他正在滑动的元素，取消滑动
                this.currentScrollBox.body.velocity.x = 0;
                this.currentScrollBox = null;
                return false;
            }

        }

        function dragUpdate(sprite, pointer, x, y) {
            console.log('update');
            //滑到顶部，禁止继续往下滑
            if (box.x > 100) {
                box.x = 100;
            } else if (box.x < maxBoxX - 100) {
                //滑到底部，禁止继续往上滑
                box.x = maxBoxX - 100;
            }
            box.y = 0
            endX = x;

            if (curTarget) {
                curTarget.y = target_top + y;

                if (drag_item_flag) {
                    curTarget.x = target_left + x - startX;
                    box.x = init_left;
                    if (scale_max_flag) {
                        scale_max_flag = false;
                        this.game.add.tween(curTarget.scale).to({ x: curTarget._in_scale, y: curTarget._in_scale }, 300, "Linear", true);
                    }
                }
                if (y < 0 && Math.atan2(Math.abs(startY - y), Math.abs(startX - x)) > 0.25 && !drag_item_flag) {
                    drag_item_flag = true;
                    init_left = box.x;
                    target_left = curTarget.x;
                }
            }

            endTime = +new Date();
        }

        function DragStop() {
            isDrag = false;
            console.log("stop");
            drag_item_flag = false;
            //指定可以点击滑动的区域
            step_arr.push(new Date().getTime())
            box.hitArea = new Phaser.Rectangle(-box.x, 0, box.width + box.x, box.height);
            if (curTarget) {
                var _this = this;
                var targetTween = this.game.add.tween(curTarget).to({ y: this.height / 2, x: box.wrapData[idx].minX + this.spriteWidth / 2 }, 300, "Linear", true);
                var scaleTween = this.game.add.tween(curTarget.scale).to({ x: curTarget.realScaleRate, y: curTarget.realScaleRate }, 300, "Linear", true);
                if (curTarget.y < 0) {
                    curTarget.children[0].alpha = 0;
                    this.game.physics.arcade.overlap(curTarget, this.game.world.game.state.callbackContext.board, function (item, board) {

                        // console.log(item.x + box.x, );
                        item.x = item.x + box.x - board.x
                        item.y = item.y + board.height
                        var position = _this.game.state.callbackContext.getSpriteGird(item);
                        board.children[0].add(item);

                        item.input.enableDrag(false, true, true, 100);
                        targetTween.stop();
                        // scaleTween.stop();
                        scaleTween.resume()
                        _this.remove(idx);
                        var tween = _this.game.add.tween(item.scale).to({ x: item._in_scale, y: item._in_scale }, 300, "Linear", true);
                        var tween = _this.game.state.callbackContext.moveToGird(item, position.col, position.row);
                        tween.onComplete.add(function () {
                            _this.game.state.callbackContext.checkLinks(item);
                            var links = _this.game.state.callbackContext.getLinks(item);
                            if (position.col == item.info.x && position.row == item.info.y && links.length >= 2) {
                                //  位置正确
                                item.inputEnabled = false;
                                links.forEach(item => {
                                    item.inputEnabled = false;
                                })
                            }
                            if (links.length > 0) {
                                _this.game.state.callbackContext.piecesReSort()
                            } else {
                                item.bringToTop()
                            }
                        })
                        var maxX = box.wrapData[box.wrapData.length - 1] ? box.wrapData[box.wrapData.length - 1].maxX : 0
                        maxBoxX = -(maxX - _this.width) - 30;
                        if (Math.abs(maxBoxX) < _this.width) {
                            maxBoxX = -30
                        }

                        // box.x -= _this.spriteWidth;

                    })
                }


                curTarget = null;
                idx = -1;
                scale_max_flag = true;
            }
            //向下滑动到极限，给极限到最值位置动画
            if (box.x > 0) {
                box.hitArea = new Phaser.Rectangle(0, 0, box.width, box.height);
                this.game.add.tween(box).to({ x: 0 }, 100, Phaser.Easing.Linear.None, true, 0, 0);
                return;
            }
            //向右滑动到极限，给极限到最值位置动画

            if (box.x < maxBoxX) {
                box.hitArea = new Phaser.Rectangle(-maxBoxX, 0, box.width - maxBoxX, box.height);
                this.game.add.tween(box).to({ x: maxBoxX }, 100, Phaser.Easing.Linear.None, true, 0, 0);
                return;
            }

            //模拟滑动停止父元素仍滑动到停止的惯性
            //根据用户的滑动距离和滑动事件计算元素的惯性滑动速度
            const velocity = (Math.abs(Math.abs(endX) - Math.abs(startX)) / (endTime - startTime)) * 40;
            //scrollFlag标识父元素是向上滑动还是向下滑动

            if (endX > startX) {
                // 向下
                box.body.velocity.x = velocity;
                box.scrollFlag = "right";
            } else if (endX < startX) {
                //向上
                box.body.velocity.x = -velocity;
                box.scrollFlag = "left";
            }
            this.currentScrollBox = box;
        }

        box.events.onDragStart.add(dragStart, this);
        box.events.onDragUpdate.add(dragUpdate, this)
        box.events.onDragStop.add(DragStop, this)


    },
    remove: function (idx) {
        const box = this.list.getByName("box");
        var c_data = box.wrapData[idx];
        box.wrapData.pop();
        box.children.forEach((item, i) => {
            if (i >= idx) {
                this.game.add.tween(item).to({ x: box.wrapData[i].minX + this.spriteWidth / 2 }, 100, Phaser.Easing.Linear.None, true, 0, 0);
            }
        });


    },

    dealScrollObject: function () {
        if (this.currentScrollBox && this.currentScrollBox.body.velocity.x !== 0) {
            var currentScrollBox = this.currentScrollBox;
            const height = currentScrollBox.height,
                width = currentScrollBox.width;

            const maxBoxX = -(width - this.width);
            if (currentScrollBox.x > 0) {
                currentScrollBox.hitArea = new Phaser.Rectangle(0, 0, width, height);
                this.game.add.tween(currentScrollBox).to({ x: 0 }, 100, Phaser.Easing.Linear.None, true, 0, 0);
                currentScrollBox.body.velocity.x = 0;
                return;
            }
            if (currentScrollBox.x < maxBoxX) {
                currentScrollBox.hitArea = new Phaser.Rectangle(-maxBoxX, 0, width - maxBoxX, height);
                this.game.add.tween(currentScrollBox).to({ x: maxBoxX }, 100, Phaser.Easing.Linear.None, true, 0, 0);
                currentScrollBox.body.velocity.x = 0;
                return;
            }
            currentScrollBox.hitArea = new Phaser.Rectangle(-currentScrollBox.x, 0, width + currentScrollBox.x, height);
            if (currentScrollBox.scrollFlag == "left") {
                currentScrollBox.body.velocity.x += 1.5;
                if (currentScrollBox.body.velocity.x >= 0) {
                    currentScrollBox.body.velocity.x = 0;
                }
            } else if (currentScrollBox.scrollFlag == "right") {
                currentScrollBox.body.velocity.x -= 1.5;
                if (currentScrollBox.body.velocity.x <= 0) {
                    currentScrollBox.body.velocity.x = 0;
                }
            }
        }
    }
}

export default PuzzlePiecesLayer;