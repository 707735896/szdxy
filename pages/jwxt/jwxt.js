//index.js
//获取应用工具脚本
var utils = require('../../utils/util.js')

Page({
  data: {
    weather: {},
  },
  onLoad: function () {
    var that = this;

    utils.loadWeatherData(function (data) {
      console.log(data);
      that.setData({
        weather: data
      });

      //更新城市名称
      wx.setNavigationBarTitle({
        title: data.city + ' 天气预报'
      })

    });

  }
})