// 动态日期计算
function formatTime(date) {
  var year = date.getFullYear()
  var month = date.getMonth() + 1
  var day = date.getDate()

  var hour = date.getHours()
  var minute = date.getMinutes()
  var second = date.getSeconds()


  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

function formatDate(date, split) {
  var year = date.getFullYear()
  var month = date.getMonth() + 1
  var day = date.getDate()
  return [year, month, day].map(formatNumber).join(split || '')
}


function formatNumber(n) {
  n = n.toString()
  return n[1] ? n : '0' + n
}

// 天气预报
//将时间戳格式化为日期
function w_formatDate(timestamp) {
  var date = new Date(timestamp * 1000);
  return date.getMonth() + 1 + "月" + date.getDate() + "日 " + formatWeekday(timestamp);
}

//将时间戳格式化为时间
function w_formatTime(timestamp) {
  var date = new Date(timestamp * 1000);
  return date.getHours() + ":" + date.getMinutes();
}

//中文形式的每周日期
function formatWeekday(timestamp) {
  var date = new Date(timestamp * 1000);
  var weekday = ["周日", "周一", "周二", "周三", "周四", "周五", "周六"];
  var index = date.getDay();
  return weekday[index];
}

//获取当前的地理位置
function getLocation(callback) {
  wx.getLocation({
    success: function (res) {
      callback(true, res.latitude, res.longitude);
    },
    fail: function () {
      callback(false);
    }
  })
}

//Reverse Geocoding 根据经纬度获取城市名称
function getCityName(latitude, longitude, callback) {

  var apiURL = "http://api.map.baidu.com/geocoder?output=json&location=" + latitude + "," + longitude + "&key=37492c0ee6f924cb5e934fa08c6b1676";

  wx.request({
    url: apiURL,
    success: function (res) {

      callback(res.data["result"]["addressComponent"]["city"]);

    }
  });

}

//根据darksky.net接口获取天气信息
function getWeatherByLocation(latitude, longitude, callback) {

  var apiKey = "cb4b12e15af2771d497f762476d754f5";
  var apiURL = "https://api.darksky.net/forecast/" + apiKey + "/" + latitude + "," + longitude + "?lang=zh&units=ca";


  wx.request({
    url: apiURL,
    success: function (res) {

      var weatherData = parseWeatherData(res.data);

      getCityName(latitude, longitude, function (city) {
        weatherData.city = city;
        callback(weatherData);
      });
    }
  });

}

//取得我们需要的数据并重组成新的结果
function parseWeatherData(data) {
  var weather = {};
  weather["current"] = data.currently;
  weather["daily"] = data.daily;
  return weather;
}


//加载天气数据
function requestWeatherData(cb) {
  getLocation(function (success, latitude, longitude) {
    //如果 GPS 信息获取不成功， 设置一个默认坐标
    if (success == false) {
      latitude = 0;
      longitude = 0;
    }

    //请求天气数据 API
    getWeatherByLocation(latitude, longitude, function (weatherData) {
      cb(weatherData);
    });

  });

}

function loadWeatherData(callback) {

  requestWeatherData(function (data) {

    //对原始数据做一些修整， 然后输出给前端
    var weatherData = {};
    weatherData = data;
    weatherData.current.formattedDate = w_formatDate(data.current.time);
    weatherData.current.formattedTime = w_formatTime(data.current.time);
    weatherData.current.temperature = parseInt(weatherData.current.temperature);

    var wantedDaily = [];
    for (var i = 1; i < weatherData.daily.data.length; i++) {

      var wantedDailyItem = weatherData.daily.data[i];
      var time = weatherData.daily.data[i].time;
      wantedDailyItem["weekday"] = formatWeekday(time);
      wantedDailyItem["temperatureMin"] = parseInt(weatherData.daily.data[i]["temperatureMin"])
      wantedDailyItem["temperatureMax"] = parseInt(weatherData.daily.data[i]["temperatureMax"])

      wantedDaily.push(wantedDailyItem);

    }

    weatherData.daily.data = wantedDaily;
    callback(weatherData);

  });

}

//将这个方法暴露给应用层
module.exports = {
  formatTime: formatTime,
  formatDate: formatDate,
  loadWeatherData: loadWeatherData
}