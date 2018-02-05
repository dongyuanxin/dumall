var xhr =()=>{
    var req = null;
    if (window.XMLHttpRequest) {
        req = new XMLHttpRequest(); // IE 7+
    } else {
        req = new ActiveXObject("Microsoft.XMLHTTP"); // IE6, IE 5
    }
    return req;
}; // 珍爱生命 远离IE

var check = (btn_id,input_id,method) => {
    document.getElementById(btn_id).onclick = () => {
        var req = xhr();
        var number = document.getElementById(input_id).value;
        var url = '/learn/api';
        var params = null;
        if(method.toLowerCase() === "post") {
            params = 'number=' + number;
        } else {
            url = url + '?number=' + number;
        }
        req.open(method,url,true);
        if(method.toLowerCase() === "post") {
            req.setRequestHeader("Content-Type","application/x-dumall-form-urlencoded");
        }
        req.send(params);
        req.onreadystatechange = () => {
            if(req.readyState===4) {
                var p = document.getElementById('server-info');
                if(req.status === 200) {
                    p.innerText = "send success";
                } else {
                    p.innerText = "send fail";
                }
            } 
        }
    }
}

window.onload = () => {   
    if(xhr) {
        console.log('load success');
    }
    check('send-btn','id-input','get');
    check('send-btn-post','name-input','post');
};