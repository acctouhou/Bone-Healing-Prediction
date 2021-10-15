let submitbtn, input, desc;

//const data = require('../data.json');

function init() {
    submitbtn = document.getElementById("sub");
    input = document.getElementById("form");
    submitbtn.addEventListener("click", Kumiko);
    input.addEventListener("submit", Kumiko);
    //desc = document.getElementById("desc");
}

function Kumiko(evt) {
    evt.preventDefault();
    const form = document.forms['form'];

    const name = form.elements.patientID.value;

    form.elements.patientID.value = "";
    if ((!name) || (!obj[name])) {
        alert("請輸入正確病歷號碼");
        return;
    }
    writedata(obj[name]);
    writebut();

}



function toptooth(arr) {
    let temp = [18, 17, 16, 15, 14, 13, 12, 11, 21, 22, 23, 24, 25, 26, 27, 28];
    let str = "";

    for (let u = 0; u < temp.length; u++) {
        let flag = false;

        for (let k = 0; k < arr.length; k++) {
            if (arr[k] == temp[u]) {
                str += `<td class="highlight">` + temp[u] + `</td>`;
                flag = true;
            }
            if (flag) {
                break;
            }
        }
        if (!flag) {
            str += `<td>` + temp[u] + `</td>`;
        }
    }
    return str;
}

function bottooth(arr) {
    let temp = [48, 47, 46, 45, 44, 43, 42, 41, 31, 32, 33, 34, 35, 36, 37, 38];
    let str = "";

    for (let u = 0; u < temp.length; u++) {
        let flag = false;

        for (let k = 0; k < arr.length; k++) {
            if (arr[k] == temp[u]) {
                str += `<td class="highlight">` + temp[u] + `</td>`;
                flag = true;
            }
            if (flag) {
                break;
            }
        }
        if (!flag) {
            str += `<td>` + temp[u] + `</td>`;
        }
    }
    return str;
}



function writebut() {
    document.getElementById("button").innerHTML =
        `
        <input type="button" value="NEXT" onclick='location.href="./htmls/design.html"'>
        `
}

function writedata(obj) {
    document.getElementById('write').innerHTML =
        `<div class="bot-ind" id="fuck">
                <div class="pics in">
                    <img src="${ obj.image}" alt="" id="head">
                </div>
                <div class="data in">
                    <img src="./pics/tooth.png" alt="" width=50 height=50 class="aaaa">
                    <p class="aaaa">基本資料</p>
                    <hr class="style">
                    <p class="detail">
                        姓名： ${obj.name}
                        <br>
                        性別： ${obj.gender}
                        <br>
                        生日： ${obj.birth} 
                        <br>
                        年齡： ${obj.age}
                        <br>
                        血型： ${obj.bloodtype}
                        <br>
                        特殊疾病： ${obj.dicease} 
                    </p>
                </div>
                <div class="tpic in">
                    <img src="./pics/tooth.png" alt="" width=50 height=50 class="aaaa">
                    <p class="aaaa">口腔概況</p>
                    <hr class="style">
                    <img src=" ${obj.timage} " alt="" width="300" height="200">
                </div>
            </div>
            <div class="table inl">
                <table border="1" align="center">
                    <tr>
                        <td class="col" colspan="8">右上</td>
                        <td class="col" colspan="8">左上</td>
                    </tr>
                    <tr>
                        ${toptooth(obj.missing)} 
                    </tr>
                    <tr>
                        ${bottooth(obj.missing)} 
                    </tr>
                    <tr>
                        <td class="col" colspan="8">左下</td>
                        <td class="col" colspan="8">右下</td>
                    </tr>
                </table>
            </div>
            <div class="inl" id="desc">
                <img src = "../pics/desc.png" height = 100px width = 80px>
            </div>
            `


}

const obj = { //因為不知道要怎麼讀local json file//所以先寫死在裡面
    "1": {
        "name": "許ＯＯ",
        "gender": "男",
        "birth": "1940.1.4",
        "age": 79,
        "bloodtype": "A",
        "dicease": "高血壓",
        "missing": [35, 36, 15, 16, 24, 25],
        "image": "https://i.imgur.com/ne3TSVw.png",
        "timage": "https://i.imgur.com/7ZnYGUG.jpg"
    },
    "2": {
        "name": "陳ＯＯ",
        "gender": "男",
        "birth": "1967.3.7",
        "age": 52,
        "bloodtype": "B",
        "dicease": "無",
        "missing": [46, 36],
        "image": "https://i.imgur.com/ufQV0pz.png",
        "timage": "https://i.imgur.com/Xrlr2M9.jpg"
    },
    "3": {
        "gender": "女",
        "name": "吳ＯＯ",
        "birth": "2000.10.11",
        "age": 18,
        "bloodtype": "AB",
        "dicease": "無",
        "missing": [17, 27, 28],
        "image": "https://i.imgur.com/YJoUCIS.png",
        "timage": "https://i.imgur.com/HphOQGE.jpg"
    },
    "4": {
        "gender": "男",
        "name": "林ＯＯ",
        "birth": "1987.2.20",
        "age": 32,
        "bloodtype": "O",
        "dicease": "糖尿病",
        "missing": [14, 46, 35, 36],
        "image": "https://i.imgur.com/MNABlcU.png",
        "timage": "https://i.imgur.com/72k6cpw.jpg"
    },
    "5": {
        "gender": "女",
        "name": "沈ＯＯ",
        "birth": "1979.5.31",
        "age": 40,
        "bloodtype": "O",
        "dicease": "無",
        "missing": [16, 36],
        "image": "https://i.imgur.com/y61hdVZ.png",
        "timage": "https://i.imgur.com/Wpqw2D2.jpg"
    },
    "6": {
        "gender": "男",
        "name": "洪ＯＯ",
        "birth": "1994.9.28",
        "age": 24,
        "bloodtype": "O",
        "dicease": "無",
        "missing": [46, 47, 48, 33, 37],
        "image": "https://i.imgur.com/gEbbCRT.png",
        "timage": "https://i.imgur.com/jiz1byj.jpg"
    },
    "7": {
        "gender": "男",
        "name": "賴ＯＯ",
        "birth": "1989.11.24",
        "age": 29,
        "bloodtype": "A",
        "dicease": "僵直性脊椎炎",
        "missing": [17, 16, 15, 14, 13, 24, 26, 46, 47, 35, 36, 37],
        "image": "https://i.imgur.com/QYlVBQY.png",
        "timage": "https://i.imgur.com/VwEK43r.jpg"
    },
    "8": {
        "gender": "女",
        "name": "黃ＯＯ",
        "birth": "1950.12.12",
        "age": 68,
        "bloodtype": "B",
        "dicease": "無",
        "missing": [16, 17, 36, 37],
        "image": "https://i.imgur.com/LqOhqDl.png",
        "timage": "https://i.imgur.com/KEMwYs3.jpg"
    },
    "9": {
        "name": "徐ＯＯ",
        "gender": "女",
        "birth": "1953.6.17",
        "age": 67,
        "bloodtype": "O",
        "dicease": "無",
        "missing": [26, 36, 46, 16, 18],
        "image": "https://i.imgur.com/TMvyBtk.png",
        "timage": "https://i.imgur.com/lQZ9m9S.jpg"
    },
    "10": {
        "name": "張ＯＯ",
        "gender": "男",
        "birth": "1978.8.8",
        "age": 41,
        "bloodtype": "O",
        "dicease": "類風濕性關節炎",
        "missing": [47, 46, 35, 36],
        "image": "https://i.imgur.com/M2YIINN.png",
        "timage": "https://i.imgur.com/Y2DuHxz.png"
    }

}