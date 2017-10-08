// Ajax 请求
var audio = new Audio()
audio.autoplay = true
audio.volume = 0.6
var channel
var sid
//jQ写法
getRanMusic(channel, sid)
function getRanMusic() {
  $.get('https://jirenguapi.applinzi.com/fm/getSong.php?channel=4', { channel: channel })
    .done(function (song) {
      musicObj = JSON.parse(song).song[0]
      loadMusic(musicObj)
      getNum()
    }).fail(function () {
      getRanMusic()
    })
}
// 歌词获取
function getLrc() {
  $.get('https://jirenguapi.applinzi.com/fm/getLyric.php', { sid: sid })
    .done(function (musicObj) {
      var lyric = JSON.parse(musicObj).lyric
      console.log(lyric)
    })
}

//原生常规写法
// var xhr = new XMLHttpRequest()
// xhr.open('GET', 'http://api.jirengu.com/fm/getSong.php?',{ channel: channel},true)
// xhr.onload = function (callback) {
//   if ((xhr.status >= 200 && xhr.status <= 300) || xhr.status === 304) {
//     var data = JSON.parse(xhr.responseText)
//     call(data)
//   }
// }
// xhr.send()
// }
// function call(data) {
//   musicObj = data.song[0]
//   console.log(musicObj)
//   loadMusic(musicObj)
// }
function loadMusic(musicObj) {
  audio.src = musicObj.url
  sid = musicObj.sid
  getLrc(sid)
  $('.songauthor').text(musicObj.artist)
  $('.author p').text(musicObj.title)
  $('.album-img img').attr('src', musicObj.picture)
  //静止状态下的，歌曲信息
  $('.static').children('p').eq(0).text(musicObj.title)
  $('.static').children('p').eq(1).text(musicObj.artist)
}
//点击专辑切换歌曲功能
$('.albums li').on('click', function (e) {
  channel = $(e.target).attr('channel-data')
  $('.album-name button').text($(this).text())
  getRanMusic(channel)
})
//暂停/播放
$('.pause').on('click', function () {
  if (audio.paused) {
    audio.play()
    $('.pause i').removeClass('icon-play').addClass('icon-pause')
  } else {
    audio.pause()
    $('.pause i').removeClass('icon-pause').addClass('icon-play')
  }
})
//下一首
$('.next').on('click', function () {
  $('.like i').css('color', 'white')
  getRanMusic(musicObj)
})
//自动播放下一首
audio.onended = function () {
  getRanMusic(channel)
}
//喜欢
$('.like').on('click', function () {
  $('.like i').css('color', 'red')
})
//收听量，收藏数。
function getNum() {
  $('.music-info span').eq(0).text(' ' + (Math.floor(Math.random() * 4000) + 1000))
  $('.music-info span').eq(1).text(' ' + (Math.floor(Math.random() * 999) + 100))
}
//进度条
audio.onplaying = function () {
  process = setInterval(function () {
    $('.current').css('width', audio.currentTime / audio.duration * 100 + '%')
    //静止状态进度条
    $('.static-process').css('width', audio.currentTime / audio.duration * 100 + '%')
  }, 1000)

  $('.pause i').removeClass('icon-play')
  $('.pause i').addClass('icon-pause')
}

//点击快进
$('.total').on('click', function (e) {
  var rate = e.offsetX / parseInt(getComputedStyle(this).width)
  audio.currentTime = audio.duration * rate
})
//时间
audio.ontimeupdate = function () {
  var min = Math.floor(audio.currentTime / 60)
  var sec = Math.floor(audio.currentTime) % 60 + ''
  $('.time').text(function () {
    sec = sec.length === 2 ? sec : '0' + sec
    return min + ':' + sec
  })
  //静止状态下的时间
  $('.static-time').text(function () {
    sec = sec.length === 2 ? sec : '0' + sec
    return min + ':' + sec
  })
}
//音量
$('.sound span').on('click', function (e) {
  event.stopPropagation()
  if ($('.length').css('display') === 'none') {
    $('.length').attr('style', 'display:block')
  } else {
    $('.length').attr('style', 'display:"none"')
  }
})
$('.length').on('click', function (e) {
  var percent = (e.offsetX / 200) * 100
  $('.voice').css('width', percent + '%')
  audio.volume = e.offsetX / 200
  $('.circle').css('left', e.offsetX + 'px')
})

// 滑动图标特效
$('.albums').mouseenter(function () {
  $('.left').removeClass('icon-trans-left')
  $('.right').removeClass('icon-trans-right')
})
$('.albums').mouseleave(function () {
  $('.left').addClass('icon-trans-left')
  $('.right').addClass('icon-trans-right')
})

// 专辑滑动(使用函数节流解决快速点击导致滑动不准确问题)
$('.left').on('click', function () {
  trans('left')
})
$('.right').on('click', function () {
  trans('right')
})
//定时器
var timer
function trans(direction) {
  if (timer) {
    clearTimeout(timer)
  }
  timer = setTimeout(function () {
    var translateX
    var transStyle = getComputedStyle(document.querySelector('.carrousel')).transform
    var curTrans = parseInt(transStyle.split('(')[1].split(')')[0].split(',')[4])
    var windowWrap = parseInt($('.window').css('width'))
    if (direction === 'right') {
      translateX = curTrans - windowWrap
    } else {
      translateX = curTrans + windowWrap
    }
    if (translateX > 0) {
      translateX = 0
    }
    if (translateX <= -3450) {
      translateX = -2300
    }
    $('.carrousel').css('transform', 'translateX(' + translateX + 'px)')
  }, 300);
}
//全屏监听，进入静止状态,使用mousemove事件，而不是mouseenter。
var staticTimer
$(window).mousemove(function () {
  if (staticTimer) {
    clearTimeout(staticTimer)
  }
  $('.music-panel').removeClass('active')
  $('.control').removeClass('active')
  $('.albums').removeClass('active')
  $('.album-img img').removeClass('location')
  $('.static').addClass('active')

  staticTimer = setTimeout(function () {
    $('.music-panel').addClass('active')
    $('.control').addClass('active')
    $('.albums').addClass('active')
    $('.album-img img').addClass('location')
    $('.static').removeClass('active')
  }, 10000)
})











