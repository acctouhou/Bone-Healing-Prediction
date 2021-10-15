let list;
let bpic;
let log;
let table;
let static;
let counter = 0;
let interval;
let temp, newtemp;
newtemp = new Array();
let pause;

function init() {
    list = document.getElementById("list");
    bpic = document.getElementById("bpic");
    pause = document.getElementById("pause");
    log = document.getElementById('log');
    table = document.getElementById('tab');
    dealtemp();
    writelog();
    drawstatic();
    writetable();

    writelist();
    intervalplay();
}

function dealtemp() {
    temp = localStorage.getItem('pics');
/*
    temp = temp.split(",");


    for (let h = 0; h < temp.length / 2; h++) {
        newtemp.push(temp[2*h] + ',' + temp[2*h+1]);
    }
*/
    newtemp = JSON.parse(temp);
    for(let h=0;h<newtemp.length;h++){
        newtemp[h] = 'data:image/png;base64,' + newtemp[h];
    }
    
    console.log(newtemp[0]);
}

function writelist() {
    let str = '';
    for (let h = 0; h < newtemp.length; h++) {
        str += `
        <input type="button" onclick="setimage('${newtemp[h]}',${h})" class="zzzz" style="background-image:url('${newtemp[h]}'); background-size: 100% 100%">
        `
            ;
    }
    list.innerHTML = str;
    bpic.innerHTML = `<img src="${newtemp[0]}" class="bigpic">`;
}

function setimage(h, index) {
    bpic.innerHTML = `<img src="${h}" class="bigpic">`;
    counter = index;
}

function nextimage() {
    console.log('next');
    if (++counter >= newtemp.length) {
        counter = 0;
    }
    bpic.innerHTML = `<img src="${newtemp[counter]}" class="bigpic">`;
}

function previousimage() {
    if (--counter < 0) {
        counter = newtemp.length - 1;
    }
    bpic.innerHTML = `<img src="${newtemp[counter]}" class="bigpic">`;
}

function intervalplay() {
    interval = setInterval(nextimage, 1000);
}

function stop() {
    clearInterval(interval);
    pause.style = `background-image: url('../pics/play.png'); background-size: 50px 50px`;
    pause.setAttribute('onclick', `play()`);
}

function play() {
    interval = setInterval(nextimage, 1000);
    pause.style = "background-image: url('../pics/pause.png'); background-size: 50px 50px";
    pause.setAttribute('onclick', `stop()`);

}

function writelog() {
    let log_temp = localStorage.getItem('log');
    console.log(log_temp);
    log.innerHTML = `<img src="data:image/png;base64,${log_temp}" class="rpic">`;
}

function writetable(){
    table.innerHTML = 
    `
    <table border="1" align="center" class="table">
        <tr>
            <td class="title">成熟骨比例</td>
            <td class="digit">${(static[0] / 10).toFixed(2)} %</td>
        </tr>
        <tr>
            <td class="title">骨釘/骨頭接觸比例</td>
            <td class="digit">${static[1].toFixed(2)} %</td>
        </tr>
        <tr>
            <td class="title">表面骨流失</td>
            <td class="digit">${static[2].toFixed(2)} %</td>
        </tr>
    </table>
    `
}

function drawstatic(){
    static = JSON.parse(localStorage.getItem('static'));
    console.log(static);
}

function saveSTL(){

}