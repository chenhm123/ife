/**
 * Created by wb-chm174910 on 2016/4/1.
 */
/**
 * aqiData，存储用户输入的空气指数数据
 * 示例格式：
 * aqiData = {
 *    "北京": 90,
 *    "上海": 40
 * };
 */
var aqiData = {};



/**
 * 从用户输入中获取数据，向aqiData中增加一条数据
 * 然后渲染aqi-list列表，增加新增的数据
 */
function addAqiData() {
    var cityName =  document.querySelector("#aqi-city-input").value.trim();
    var cityScore = document.querySelector("#aqi-value-input").value.trim();
    if(cityName && /^[\u4e00-\u9fa5]+|[A-Za-z]+$/.test(cityName)){
        if(cityScore && /^\d*$/.test(cityScore)){
            cityName = cityName.replace(/\s+/g,"");//去除字符串中空格
            aqiData[cityName] = parseInt(cityScore,10);
            renderAqiList()
        }else{
            alert('空气质量指数不符合规范')
        }
    }else{
        alert('城市名不符合规范');
    }
}

/**
 * 渲染aqi-table表格
 */
function renderAqiList() {
    var table =  document.querySelector("#aqi-table");
    var trList = table.children[0].children;

    /**清楚之前数据**/
    for(var i = 1,length = trList.length;i<length;i++){
        trList[1].parentNode.removeChild(trList[1]);
    }

    /**重新加载数据**/
    var cityNames = Object.keys(aqiData);
    for(i = 0,length = cityNames.length;i<length;i++){
        var tr = document.createElement("tr");
        tr.innerHTML = "<td>"+cityNames[i]+"</td><td>"+aqiData[cityNames[i]]+"</td><td><button class='del-btn''>删除</button></td>"
        table.children[0].appendChild(tr);
    }


}

/**
 * 点击add-btn时的处理逻辑
 * 获取用户输入，更新数据，并进行页面呈现的更新
 */
function addBtnHandle() {
    addAqiData();
}

/**
 * 点击各个删除按钮的时候的处理逻辑
 * 获取哪个城市数据被删，删除数据，更新表格显示
 */
function delBtnHandle(cityName) {
    delete aqiData[cityName]
    renderAqiList();
}

function init() {
    //事件委托
    document.body.onclick = function(ev){
        var target = ev.target;
        if(target.id === "add-btn"){
            addBtnHandle()
        }else if(target.getAttribute("class") ==='del-btn'){
            delBtnHandle(target.parentNode.parentNode.firstChild.innerText);
        }
    }

}

init();