
function puzzlePiece(option) {
    this.canvas = document.createElement('canvas');
    this.ctx = this.canvas.getContext("2d");
    this.option = option;
    this.bg = option.bg.src;
    this.init()

}

puzzlePiece.prototype = {
    constructor: puzzlePiece,
    init: function () {
        this.canvas.width = this.option.outer_width;
        this.canvas.height = this.option.outer_height;

        var _this = this;
        var ctx = this.ctx;
        var canvas = this.canvas;
        var option = this.option;
        var o_w = this.option.outer_width;
        var o_h = this.option.outer_height;
        var w = this.option.width;
        var h = this.option.height;
        var rows = this.option.rows;
        var cols = this.option.cols;
        var block_option = this.option.block;

        Promise.all([this._load(this.bg), this._load(block_option.src), this._load(this.option.border.src)]).then(function (arr) {
            var bg = arr[0];
            var block = arr[1];
            var border = arr[2];
            _this.border_img = border;

            // document.getElementById('content').appendChild(canvas)
            // ctx.drawImage(border, option.border.x * -1, option.border.y * -1);
            ctx.drawImage(block, option.block.x * -1, option.block.y * -1);
            ctx.globalCompositeOperation = "source-in";

            var offset_width_left = piece_gap_conf.l / (w * cols) * bg.width;
            var offset_width_right = piece_gap_conf.r / (w * cols) * bg.width;

            var offset_height_top = piece_gap_conf.t / (h * rows) * bg.height;
            var offset_height_bottom = piece_gap_conf.b / (h * rows) * bg.height;
            var sx, sy, sw, sh, dx, dy, dw, dh;
            sx = 1 * option.bg.x * w - offset_width_left * option.block.left;
            sy = 1 * option.bg.y * w - offset_height_top * option.block.top;
            // 计算块实际需要的宽度 、高度
            // 块的宽度 =  中心宽度 + 左偏移 + 右偏移
            // console.log(1 * option.bg.x * w, offset_width * option.block.left);
            // sx = 0


            sw = bg.width / cols + offset_width_left * block_option.left + offset_width_right * block_option.right;
            sh = bg.height / rows + offset_height_top * block_option.top + offset_height_bottom * block_option.bottom;
            dx = 0 == block_option.left ? (o_w - w) / 2 : 0;
            dy = 0 == block_option.top ? (o_h - h) / 2 : 0;
            dw = w + option.block.left * piece_gap_conf.l + option.block.right * piece_gap_conf.r;
            dh = h + option.block.top * piece_gap_conf.t + option.block.bottom * piece_gap_conf.b;
            // ctx.drawImage(bg, sx, sy, sw, sh, dx, dy, dw, dh);
            // console.log(sx, sy, sw, sh, dx, dy, dw, dh);

            var gird_width = bg.width / 3;

            // console.log(o_w, w);
            sw = o_w / w * gird_width;
            // sw = 1.5 * gird_width;
            sh = sw;
            // console.log(sh, gird_width);
            var sx = (option.bg.x * gird_width + gird_width / 2 - sw / 2);

            var sy = (option.bg.y * gird_width + gird_width / 2 - sw / 2);
            // console.log(sx, sy, sw, sh, d);
            // var div = document.createElement('div');

            dx = dy = 0
            if (sx < 0) {
                dx = -sx / (sw / o_w);
                sx = 0;
            }
            if (sy < 0) {
                dy = -sy / (sw / o_w);
                sy = 0;
            }
            // div.innerHTML = `<span> sx:${sx},<br> sy:${sy}<br> dx: ${dx},<br> dy: ${dy},<br> o_w, o_h</span>`
            // document.getElementById('content').appendChild(div)
            ctx.drawImage(bg, sx, sy, sw, sh, dx, dy, o_w, o_h);
            // ctx.drawImage(border, option.border.x * -1, option.border.y * -1);
            // ctx.drawImage(block, option.block.x * -1, option.block.y * -1);
            // ctx.globalCompositeOperation = "source-over";
            // ctx.drawImage(border, option.border.x * -1, option.border.y * -1);
            _this.ready();
        })
    },
    get: function () {

        var ctx = this.ctx;
        var canvas = this.canvas;
        var res = {
            img: this.canvas.toDataURL(),
            border: '',
        }
        var option = this.option;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.globalCompositeOperation = "source-over";
        ctx.drawImage(this.border_img, option.border.x * -1, option.border.y * -1);

        res.border = this.canvas.toDataURL();
        return res;
    },
    ready: function () {
        this.option.ready && this.option.ready.call(this);
    },
    _caches: [],
    _caches_IMGS: [],
    _load: function (loadSrc) {
        var _this = this;
        var index = -1;
        _this._caches.forEach(function (i, src) {
            if (loadSrc == src) {
                index = i;
            }
        })
        return new Promise(function (res, rej) {
            if (index != -1) {
                res(_this._caches_IMGS[index]);
            } else {
                var img = new Image();
                img.setAttribute('crossOrigin', 'anonymous');
                img.onload = function () {
                    _this._caches.push(loadSrc);
                    _this._caches_IMGS.push(img);
                    res(img);
                }

                img.src = loadSrc;

                if (img.complete) {
                    _this._caches.push(loadSrc);
                    _this._caches_IMGS.push(img);
                    res(img);
                }
            }
        })
    }
}


export default {
    create: puzzlePiece
}