let x = 'black', //color
    y = 2; //thickness
let prevX = 0,
    prevY = 0,
    currX = 0,
    currY = 0,
    flag = false,
    dot_flag = false,
    w,
    h;

let index = [47, 86, 126, 167, 207, 246, 286];


let entire_canvas, entire_ctx, copy, rightside;

let example = ["../14new_002.png", "../14new_003.png", "../14new_004.png", "../14new_005.png"]

let can = [];
can.length = 7;


class canvasarea {
    constructor(name) {
        //console.log(name);
        this.canvas = document.getElementById(name);
        //console.log(this.canvas)
        this.entire = document.getElementById('entire').getContext('2d');

        this.ctx = this.canvas.getContext('2d');
        this.ctx.fillStyle = 'black';
        this.ctx.fillRect(30, 0, 80, 40);
        this.x = 'black';
        this.y = 2;
        this.w = this.canvas.width;
        this.h = this.canvas.height;
        //console.log(this.lock);


        //this.lock.addEventListener('click', this.onclick)
        this.canvas.addEventListener('mousedown', this.mouseDown);
        this.canvas.addEventListener('mousemove', this.mouseMove);
        this.canvas.addEventListener('mouseup', this.mouseUp);

        this.canvas.addEventListener('touchstart', this.touchStart);
        this.canvas.addEventListener('touchmove', this.touchMove);
        this.canvas.addEventListener('touchend', this.touchEnd);
    }
    copy(e_x, e_y) {
        this.entire.drawImage(this.ctx.canvas, e_x, e_y);
    }
    mouseDown(e) {


        this.draw = true;
        this.ctx = this.getContext("2d");
        this.ctx.strokeStyle = x;
        this.ctx.lineWidth = y;

        var o = this;
        this.offsetX = this.offsetLeft;
        this.offsetY = this.offsetTop;

        while (o.offsetParent) {
            o = o.offsetParent;
            this.offsetX += o.offsetLeft;
            this.offsetY += o.offsetTop;
        }

        this.ctx.beginPath();
        this.ctx.moveTo(e.pageX - this.offsetX, e.pageY - this.offsetY);
    }
    touchStart(e) {


        this.draw = true;
        this.ctx = this.getContext("2d");
        this.touch = e.targetTouches[0];
        this.ctx.strokeStyle = x;
        this.ctx.lineWidth = y;

        var o = this;
        this.offsetX = this.offsetLeft;
        this.offsetY = this.offsetTop;

        while (o.offsetParent) {
            o = o.offsetParent;
            this.offsetX += o.offsetLeft;
            this.offsetY += o.offsetTop;
        }

        this.ctx.beginPath();
        this.ctx.moveTo(this.touch.pageX - this.offsetX, this.touch.pageY - this.offsetY);
        //this.ctx.fill();
        e.preventDefault();
    }
    mouseMove(e) {
        //console.log(e.pageY - this.offsetY)
        if ((e.pageX - this.offsetX >= 42) || (e.pageX - this.offsetX <= 0) || e.pageY - this.offsetY >= 32 || e.pageY - this.offsetY <= 0) {
            this.draw = false;
            return;
        }
        if (this.draw) {
            this.ctx.lineTo(e.pageX - this.offsetX, e.pageY - this.offsetY);
            this.ctx.stroke();
        }
    }
    touchMove(e) {

        this.touch = e.targetTouches[0];
        if ((this.touch.pageX - this.offsetX >= 42) || (this.touch.pageX - this.offsetX <= 0) || this.touch.pageY - this.offsetY >= 32 || this.touch.pageY - this.offsetY <= 0) {
            this.draw = false;
            return;
        }
        if (this.draw) {
            this.ctx.lineTo(this.touch.pageX - this.offsetX, this.touch.pageY - this.offsetY);
            this.ctx.stroke();
        }
        e.preventDefault();
    }
    touchEnd(e) {

        this.draw = false;
        e.preventDefault();
        this.cPush;
    }
    mouseUp(e) {

        this.draw = false;
        this.cPush;
    }
    reset(e) {
        this.ctx.fillStyle = 'white';
        this.ctx.fillRect(0, 0, 108, 40);

        console.log(this.ctx.getImageData(10, 10, 1, 1))
        this.ctx.fillStyle = 'black';
        this.ctx.fillRect(30, 0, 80, 40);
    }


}

function init() {
    copy = document.getElementById('cpy');
    rightside = document.getElementById("rightside")

    for (let h = 0; h < 7; h++) {
        let temp = "tutorial" + h;
        can[h] = new canvasarea(temp);
    }

    loadimage(0);
}

function loadimage(num) {
    entire_canvas = document.getElementById('entire');
    entire_ctx = entire_canvas.getContext('2d');

    entire_ctx.fillStyle = 'white';
    entire_ctx.fillRect(0, 0, 108, 420)
    var img1 = new Image();

    //drawing of the test image - img1
    img1.onload = function () {
        entire_ctx.drawImage(img1, 5, 0);

    };

    //img1.src = 'https://i.imgur.com/qYNtbZT.jpg';
    //img1.src = 'https://i.imgur.com/TJHC8U7.jpg';
    img1.src = example[num];
    img1.setAttribute("crossOrigin", 'Anonymous');
    if (!num) {
        copy.setAttribute('onclick', `cpy()`)

    }
    else {
        copy.setAttribute('onclick', `cantmodify()`);

    }
}



function set(col, wid) {
    x = col;
    y = wid;

}

function cpy() {

    for (let k = 0; k < 7; k++) {
        fill(can[k]);
        can[k].copy(45, index[k])
    }


}

function saveimage() {
    let img = canvas.toDataURL("image/png").replace("image/png", "image/octet-stream");
    cPushArray.push(img);
    window.location.href = img;
}

function rs() {
    for (let h = 0; h < 7; h++) {
        can[h].reset();
    }
}

function reset() {
    rs();
    loadimage(0);

}

function fill(c) {

    for (let u = 0; u < c.h; u++) { //y index
        for (let g = 0; g < c.w; g++) { //x index
            if (c.ctx.getImageData(g, u, 1, 1).data[3] && !c.ctx.getImageData(g, u, 1, 1).data[0]) {

                c.ctx.strokeStyle = 'black';
                c.ctx.lineWidth = 2;

                c.ctx.beginPath();
                c.ctx.moveTo(g, u);
                c.ctx.lineTo(c.w, u);
                c.ctx.stroke();
                break;
            }
        }
    }

}

async function data() {
    return new Promise((resolve, reject) => {

        //ctx.drawImage(this, 0, 0);
        let temp = entire_canvas.toDataURL('image/jpeg');

        console.log(temp);
        resolve(temp);
    })
}

function cantmodify() {
    alert('example cannot be modified');
}
/*
function torgb() {
    let mumi = document.getElementById('entire').getContext('2d');
    let t_h = 420,
        t_w = 108;

    let arr = [];
    for (let j = 0; j < t_h; j++) {
        let tem = [];
        for (let k = 0; k < t_w; k++) {
            let temp = mumi.getImageData(k, j, 1, 1).data;
            if ((temp[0] == 255) && (temp[1] == 255) && (temp[2] == 255)) {
                tem.push(0);
            } else {
                tem.push(1);
            }

        }
        arr.push(tem);
    }

    console.log(arr);
    return arr;
}
*/

function overlay() {
    var style = document.createElement('style');
    style.innerHTML = `
    #overlay {
        content: " ";
        z-index: 10;
        display: block;
        position: absolute;
        height: 120%;
        top: 0;
        left: 0;
        right: 0;
        background: rgba(0, 0, 0, 0.5);
    }
    #innercontent{
        left: 50%;
        position: absolute;
        top: 50%;
        transform: translate(-50%, -50%);
    }
    #spinner {
        width: 75px;
        height: 75px;
        display: inline-block;
        border-width: 2px;
        border-color: rgba(255, 255, 255, 0.05);
        border-top-color: #fff;
        animation: spin 1s infinite linear;
        border-radius: 100%;
        border-style: solid;
    }
    
    @keyframes spin {
      100% {
        transform: rotate(360deg);
      }
    }
    `;
    document.head.appendChild(style);
}

function makeRequest(method, url) {
    return new Promise(async (resolve, reject) => {
        var xhr = new XMLHttpRequest();
        xhr.open(method, url, true);
        xhr.timeout = 30000;
        xhr.onload = function () {
            if (this.status >= 200 && this.status < 300) {
                console.log('request sent')
                resolve(xhr.response);
            } else {
                reject({
                    status: this.status,
                    statusText: xhr.statusText
                });
            }
        };
        xhr.onerror = function () {
            reject({
                status: this.status,
                statusText: xhr.statusText
            });
        };
        let body = JSON.stringify({
            Kumiko: await data()
        });
        xhr.send(body);
    });
}

async function redir() {
    overlay();
    let response = await makeRequest("post", "http://localhost:8888");
    let parsed = JSON.parse(response);
    //
    let log, pic, static;
    log = parsed.log;
    pic = parsed.data;
    static = parsed.static;
    //
    localStorage.clear();
    localStorage.setItem('pics', JSON.stringify(pic));
    localStorage.setItem('log', log);
    localStorage.setItem('static', JSON.stringify(static));
    window.location.href = './final.html';
}