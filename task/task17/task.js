/**
 * Created by wb-chm174910 on 2016/4/1.
 */
/* 数据格式演示
 var aqiSourceData = {
 "北京": {
 "2016-01-01": 10,
 "2016-01-02": 10,
 "2016-01-03": 10,
 "2016-01-04": 10
 }
 };
 */

// 以下两个函数用于随机模拟生成测试数据
function getDateStr(dat) {
    var y = dat.getFullYear();
    var m = dat.getMonth() + 1;
    m = m < 10 ? '0' + m : m;
    var d = dat.getDate();
    d = d < 10 ? '0' + d : d;
    return y + '-' + m + '-' + d;
}
function randomBuildData(seed) {
    var returnData = {};
    var dat = new Date("2016-01-01");
    var datStr = ''
    for (var i = 1; i < 92; i++) {
        datStr = getDateStr(dat);
        returnData[datStr] = Math.ceil(Math.random() * seed);
        dat.setDate(dat.getDate() + 1);
    }
    return returnData;
}

var aqiSourceData = {
    "北京": randomBuildData(500),
    "上海": randomBuildData(300),
    "广州": randomBuildData(200),
    "深圳": randomBuildData(100),
    "成都": randomBuildData(300),
    "西安": randomBuildData(500),
    "福州": randomBuildData(100),
    "厦门": randomBuildData(100),
    "沈阳": randomBuildData(500)
};

//获取所有城市名
var cityNames = Object.keys(aqiSourceData);


// 用于渲染图表的数据
var chartData = {};

// 记录当前页面的表单选项
var pageState = {
    nowSelectCity: 0,
    nowGraTime: "day"
}

/**
 * 渲染图表
 */
function renderChart() {
    var city = cityNames[pageState.nowSelectCity];
    var type = pageState.nowGraTime;
    var cityAndType = city +""+ type;
    var date = chartData[cityAndType];
    var purpose = document.querySelector(".aqi-chart-wrap");
    purpose.innerHTML = "";
    var left = 0;
    for(var key in date){
        var color = (Math.random())*360;
        var div = document.createElement('div');
        div.setAttribute('class','data-item');
        div.style.height = date[key];
        div.style.left = left;
        div.style.background = "hsla("+color+",50%,50%,1)";
        left+=10;
        purpose.appendChild(div);
    }
}

/**
 * 日、周、月的radio事件点击时的处理函数
 */
function graTimeChange() {
    pageState.nowGraTime = this.value;
    initAqiChartData();
    renderChart()
}

/**
 * select发生变化时的处理函数
 */
function citySelectChange() {
    pageState.nowSelectCity = this.value;
    initAqiChartData();
    renderChart();
}

/**
 * 初始化日、周、月的radio事件，当点击时，调用函数graTimeChange
 */
function initGraTimeForm() {
    var btns = document.querySelectorAll("input[name='gra-time']")
    Array.prototype.forEach.call(btns,function(btn){
        btn.onchange = graTimeChange;
    })
}

/**
 * 初始化城市Select下拉选择框中的选项
 */
function initCitySelector() {
    var select = document.querySelector("#city-select");
    for(var i = 0,length=cityNames.length;i<length;i++){
        var option = document.createElement("option");
        option.innerHTML = cityNames[i];
        option.value = i;
        select.appendChild(option);
    }
    select.onchange = citySelectChange;
}

/**
 * 初始化图表需要的数据格式
 */
function initAqiChartData() {
    // 将原始的源数据处理成图表需要的数据格式
    // 处理好的数据存到 chartData 中
    var city = cityNames[pageState.nowSelectCity];
    var type = pageState.nowGraTime;
    var cityAndType = city +""+ type;
    var data = aqiSourceData[city];
    if(type === 'day'){
        if(chartData[cityAndType]) return ;
        chartData[cityAndType] = data;
    }else if(type === 'week'){
        if(chartData[cityAndType]) return ;
        var weekDay = 0;
        var sum = 0;
        var result = {Jan:[],Feb:[],March:[]}
        var month = ["Jan","Feb","March"];
        for(var key in data){
            var date = new Date(key);
            if(date.getDay()!=0){
                weekDay++;
                sum += data[key];
                if((new Date((date/1000+86400*1)*1000)).getMonth()!==date.getMonth()){
                    result[month[date.getMonth()]].push(Math.floor(sum/weekDay));
                    sum = 0;
                    weekDay=0;
                };
            }else{
                weekDay++;
                sum += data[key];
                result[month[date.getMonth()]].push(Math.floor(sum/weekDay));
                sum = 0;
                weekDay=0;
            }
        }
        chartData[cityAndType] = result;
    }else if(type === "month"){
        if(chartData[cityAndType]) return ;
        data = getMonData(data);
        for(var key in data){
            var sum = 0;
            data[key].forEach(function(num){
                sum+=num;
            })
            data[key] = Math.floor(sum/data[key].length);
        }
        chartData[cityAndType] = data;
    }
}

function getMonData(data){
    var Jan = [],Feb=[],march=[];
    var result = {};
    for(var key in data){
        if((new Date(key).getMonth())==0){
            Jan.push(data[key]);
        }else if((new Date(key).getMonth())==1){
            Feb.push(data[key]);
        }else if((new Date(key).getMonth())==2){
            march.push(data[key]);
        }
    }
    result["Jan"] = Jan;
    result["Feb"] = Feb;
    result["march"] = march;
    return result;
}

/**
 * 初始化函数
 */
function init() {
    initGraTimeForm()
    initCitySelector();
    initAqiChartData();
    initAqiChartData();
    renderChart();
}

init();
