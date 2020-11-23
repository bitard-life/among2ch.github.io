var CODES = [-1, {}]
var MAPS = { '0': 'The Skeld', '1': 'MIRA HQ', '2': 'Polus', '100': '???'}
var SERVERS = { 'EU': 'Европа', 'US': 'Америка', 'CH': 'Азия' }
var STATUS = { '100': 'идет игра', '101': 'ошибка' }
var FLG_REQ = false
    
function loadLIVE() {   
    var live_req = new XMLHttpRequest();
    live_req.overrideMimeType('application/json');
    live_req.open('GET', '/live');
    live_req.onreadystatechange = function () {
        if(live_req.readyState == 4 && live_req.status == '200') {
            parseLIVE( live_req.responseText );
        }
        FLG_REQ = false
    };
    live_req.send(null);  
}

function copyToClipboard() {
    code = this.getAttribute('code');
    if (window.clipboardData && window.clipboardData.setData) {
        return clipboardData.setData("Text", code);
    }
    else if (document.queryCommandSupported && document.queryCommandSupported("copy")) {
        let textarea = document.createElement("textarea");
        textarea.textContent = code;
        textarea.style.position = "fixed";
        document.body.appendChild(textarea);
        textarea.select();
        try {
            return document.execCommand("copy");
        }
        catch (ex) {
            return false;
        }
        finally {
            document.body.removeChild(textarea);
        }
    }
}

function createROOM(code){
    let li = document.createElement('li');
    li.id = code + '_li';
    li.className = 'table-row';
    
    let div_col1 = document.createElement('div');
    div_col1.className = 'col col-1';
    div_col1.setAttribute('data-label', 'Код:');
        let button_col1 = document.createElement('button');
        button_col1.id = code + '_button';
        button_col1.setAttribute('code', code.substr(0,6));
        button_col1.className = 'button';
        button_col1.title = 'Скопировать код';
        button_col1.addEventListener('click', copyToClipboard, false);
            let div2_col1 = document.createElement('div');
            div2_col1.className = 'icon';
                let svg_col1 = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
                svg_col1.setAttributeNS(null, 'viewBox', '0 0 22 22');
                svg_col1.setAttributeNS(null, 'fill', 'none');
                svg_col1.setAttributeNS(null, 'stroke', 'currentColor');
                    let path_col1 = document.createElementNS('http://www.w3.org/2000/svg', 'path');
                    path_col1.setAttributeNS(null, 'stroke-linecap', 'round');
                    path_col1.setAttributeNS(null, 'stroke-linejoin', 'round');
                    path_col1.setAttributeNS(null, 'stroke-width', '2');
                    path_col1.setAttributeNS(null, 'd', 'M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2');
                    svg_col1.append(path_col1);
                div2_col1.append(svg_col1);
            button_col1.append(div2_col1);
            let label_col1 = document.createElement('label');
            label_col1.id = code + '_label';
            label_col1.innerHTML = code.substr(0,6);
            button_col1.append(label_col1);
        div_col1.append(button_col1);
    li.append(div_col1);
    
    let div_col2 = document.createElement('div');
    div_col2.className = 'col col-2';
    div_col2.setAttribute('data-label', 'Сервер:');
    div_col2.innerHTML = SERVERS[code.substring(6,8)];
    li.append(div_col2);
    
    let div_col3 = document.createElement('div');
    div_col3.id = code + '_map';
    div_col3.className = 'col col-3';
    div_col3.setAttribute('data-label', 'Карта:');
    div_col3.innerHTML = MAPS[CODES[1][code][0]];
    li.append(div_col3);
    
    let div_col4 = document.createElement('div');
    div_col4.id = code + '_status';
    div_col4.className = 'col col-4';
    div_col4.setAttribute('data-label', 'Статус:');
    div_col4.innerHTML = (CODES[1][code][1]>99?STATUS[CODES[1][code][1]]:CODES[1][code][1]+'/10');
    li.append(div_col4);
    
    let div_col5 = document.createElement('div');
    div_col5.id = code + '_bumps';
    div_col5.className = 'col col-5';
    div_col5.setAttribute('data-label', 'Бампы:');
    div_col5.innerHTML = CODES[1][code][2];
    li.append(div_col5);
    
    let div_col6 = document.createElement('div');
    div_col6.id = code + '_push';
    div_col6.className = 'col col-6';
    div_col6.setAttribute('data-label', 'Push:');
        let label_col6 = document.createElement('label');
        label_col6.className = 'form-switch';
            let input_col6 = document.createElement('input');
            input_col6.type = 'checkbox';
            label_col6.append(input_col6);
            let i_col6 = document.createElement('i');
            label_col6.append(i_col6);
    div_col6.append(label_col6);
    li.append(div_col6);
    
    document.getElementById('codes_ul').append(li);
}

function parseLIVE(json_txt) {
    let codes;
    try {
         codes = JSON.parse(json_txt);
    }
    catch (ex) {
        return;
    }
    if( codes[0] !== CODES[0] ) {
        for (let code in codes[1]) {
            if(CODES[1][code] === undefined) {
                CODES[1][code] = codes[1][code];
                createROOM(code);
            }else{
                if(codes[1][code][0] !== CODES[1][code][0]){
                    CODES[1][code][0] = codes[1][code][0];
                    document.getElementById(code+'_map').innerHTML = MAPS[CODES[1][code][1]];
                }
                if(codes[1][code][1] !== CODES[1][code][1]){
                    CODES[1][code][1] = codes[1][code][1];
                    document.getElementById(code+'_status').innerHTML = (CODES[1][code][1]>99?STATUS[CODES[1][code][1]]:CODES[1][code][1]+'/10');
                }
                if(codes[1][code][2] !== CODES[1][code][2]){
                    CODES[1][code][2] = codes[1][code][2];
                    document.getElementById(code+'_bumps').innerHTML = CODES[1][code][2];
                }
            }
        }
        
        for (let code in CODES[1]) {
            if(codes[1][code] === undefined) {
                delete CODES[1][code];
                document.getElementById(code+'_button').removeEventListener('click', copyToClipboard, false);
                document.getElementById('codes_ul').removeChild(document.getElementById(code + '_li'));
            }
        }
        
        CODES[0] = codes[0];
        
        if(Object.keys(CODES[1]).length == 0) {
            document.getElementById('load_label').innerHTML = 'На данный момент не найдено ни одной румы =(';
        } else {
            document.getElementById('load_label').innerHTML = '';
        }
    }
}

if( document.readyState !== 'loading' ) {
    StartLive();
} else {
    document.addEventListener('DOMContentLoaded', StartLive);
}

function StartLive() {
    let timerId = setInterval(() => {
        if( FLG_REQ == false ) {
            FLG_REQ = true
            loadLIVE();
        }
    }, 1000);
}