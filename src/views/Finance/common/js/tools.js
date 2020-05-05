//获取单一元素
function elem(elem){
    return document.querySelector(elem);
}
//获取数组类型dom元素
function elems(elem){
    return document.querySelectorAll(elem);
}
//创建xhr对象
function createXhr(){
    var xhr = null;
    if(window.XMLHttpRequest){
        xhr=new XMLHttpRequest();
    }else{
        xhr=new ActiveXObject("Microsoft.XMLHttp");
    }
    return xhr;
}
//ajax封装函数
function ajax({type,url,data,dataType}){
    return new Promise(callback=>{
        var xhr = createXhr();
        if(type.toLowerCase()==="get"){
            data===""?xhr.open(type.toLowerCase(),url,true):xhr.open(type.toLowerCase(),url+'?'+data,true)
            xhr.send(null);
        }else if(type.toLowerCase()==="post"){
            xhr.open(type.toLowerCase(),url,true);
            xhr.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
            xhr.send(data);
        }
        xhr.onreadystatechange = ()=>{
            if(xhr.readyState===4&&xhr.status===200){
                var res = xhr.responseText;
                if(dataType!==undefined&&dataType.toLowerCase()==="json"){
                    res = JSON.parse(res);
                }
                callback(res);
            }
        }
    })
}
//get方法
function get({url,data}){
    return new Promise((callback)=>{
        var xhr = createXhr();
        data===""?xhr.open("get",url,true):xhr.open("get",url+"?"+data,true);
        xhr.send(null);
        xhr.onreadystatechange = ()=>{
            if(xhr.readyState===4&&xhr.status===200){
                var res = xhr.responseText;
                res=JSON.parse(res);
                callback(res);
            }
        }
    })
}
//post方法
function post({url,data}){
    return new Promise((callback)=>{
        var xhr = createXhr();
        xhr.open("post",url,true);
        xhr.setRequestHeader("Content-type","application/x-www-form-urlencoded");
        xhr.send(data);
        xhr.onreadystatechange = ()=>{
            if(xhr.readyState===4&&xhr.status===200){
                var res = xhr.responseText;
                res=JSON.parse(res);
                callback(res);
            }
        }
    })
}
 
//ctx对象画圆
/*cx,cy:原点位置
 * r:半径
 * start,end:开始角度，结束角度:角度*Math.PI
 * lw:描线宽
 * fill:是否填充(true/false)
 */
    function circle({cx,cy,r,start,end,color,lw,fill}){
        ctx.beginPath();
        ctx.arc(cx,cy,r,start,end);
        ctx.strokeStyle=color;
        ctx.lineWidth=lw;
        if(fill==true){
            ctx.fillStyle=color;
            ctx.fill();
        }
    }
//随机颜色
function rgb(){
    var r = Math.floor(Math.random()*256);
    var g = Math.floor(Math.random()*256);
    var b = Math.floor(Math.random()*256);
        return `rgb(${r},${g},${b})`;
}