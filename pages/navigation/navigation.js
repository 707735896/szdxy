import {
  MUSIC_PALY_IMG,
  MUSIC_PAUSE_IMG
} from '../../utils/constants.js'
import api from '../../api/api.js'
import util from '../../utils/util.js'

Page({
  data: {
    latitude: 0,//纬度 
    longitude: 0,//经度 
    speed: 0,//速度 
    accuracy: 16,//位置精准度 
    markers: [],
    covers: [],
  },
  onReady:function(){
    wx.setNavigationBarTitle({
      title: '地图',
    })
  },
  onLoad: function () {
    wx.getLocation({
      type: 'gcj02',
      success: function (res) {
        var latitude = res.latitude
        var longitude = res.longitude
        var speed = res.speed
        var accuracy = res.accuracy
        console.log("latitude:" + latitude)
        console.log("longitude:" + longitude)
        console.log("speed:" + speed)
        console.log("accuracy:" + accuracy)
        wx.openLocation({
          latitude: latitude,
          longitude: longitude,
          scale: 28
        })
      }
    })
  }
})