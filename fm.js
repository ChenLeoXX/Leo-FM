// Ajax 请求
var audio = new Audio()
audio.autoplay = true
audio.volume = 0.6
var channel
var sid
var timeReg = /\[\d{2}:\d{2}.\d{2}\]/g
var result
//歌词滚动
var curTop = $('.ct-lrc')
var minTop = $('.min-ct')
var musicObj
//jQ写法
getRanMusic(channel, sid)

function getRanMusic() {
  console.log('1')
  $.get('https://jirenguapi.applinzi.com/fm/getSong.php?channel=4', {
      channel: channel || 'public_xinqing_qingsongjiari'
    })
    .done(function (song) {
      console.log(song)
      musicObj = JSON.parse(song).song[0]
      console.log(musicObj)
      loadMusic(musicObj)
      getNum()
    }).fail(function (e) {
      getRanMusic(channel, sid)
    })
}
// 歌词获取
function getLrc() {
  $.get('https://jirenguapi.applinzi.com/fm/getLyric.php', {
      sid: sid
    })
    .done(function (musicObj) {
      var lyrics = JSON.parse(musicObj).lyric
      console.log(lyrics)
      // if(){

      // }
      parseLrc(lyrics)
      showLrc(result)
      // minLrc(result)
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
//加载音乐
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
//空格暂停/播放
document.onkeydown = function (e) {
  if (e.keyCode === 32) {
    console.log(e)
    audio.paused === true ? (function pause() {
      audio.play()
      $('.pause i').removeClass('icon-play').addClass('icon-pause')
    })() : (function play() {
      audio.pause()
      $('.pause i').removeClass('icon-pause').addClass('icon-play')
    })()
  }
}
//下一首
$('.next').on('click', function () {
  $('.like i').css('color', 'white')
  getRanMusic(channel, sid)
})
//自动播放下一首
audio.onended = function () {
  getRanMusic(channel, sid)
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
  //歌词同步
  //  console.log(audio.currentTime)
  for (let i = 0; i < result.length; i++) {
    if(!result.length) break
    if (Number(audio.currentTime.toFixed(2)) > Number(result[i][0].toFixed(2))) {
      curTop.css('top', '-' + curTop.children().eq(i).css('top'))
      curTop.children().eq(i).addClass('lrc-font')
      curTop.children().eq(i - 1).removeClass('lrc-font')
    }
  }
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
    $('.min-ct').removeClass('active')
  }, 10000)
})
//解析歌词
function parseLrc(lyrics) {
  result = []; //最后的歌词格式[tiem,lrc]//歌词和时间分离出来
  var lrc = lyrics.split(/\n/) // 把歌词变为一行一回车的数组
  //  while 语句有BUG lrc = lrc.slice(1) //去除第一个包含时间的歌词，以便下面去除不包含时间的歌词
  // while (!timeReg.test(lrc[0])) {
  //   lrc = lrc.slice(1)
  // }  //去除不包含歌词的行
  lrc.pop(lrc[lrc.length - 1]) //由于上面使用split数组最后一个为空字符串。
  lrc.forEach(function (v, i, a) {
    var time = v.match(timeReg) //匹配出纯时间
    var value = v.replace(timeReg, '') //匹配出纯歌词
    if (time) {
      time.forEach(function (v1) {
        var t = v1.slice(1, -1).split(':') //可能包含多个时间，再次处理
        result.push([parseInt(t[0], 10) * 60 + parseFloat(t[1]), value]) // 排进数组
        result.sort(function (a, b) {
          return a[0] - b[0]
        })
        return result
      })
    } else {
      return result
    }
  })
}
// //显示歌词
function showLrc(result) {
  var $lrc = $('.ct-lrc')
  var $frag = $(document.createDocumentFragment())
  for (let j = 0, l = result.length; j < l; j++) {
    var $li = $('<p>' + result[j][1] + '</p>')
    $li.css('top', j * 26 + 'px')
    $frag.append($li)
  }
  $lrc.empty()
  $lrc.append($frag)
}
// function minLrc(result) {
//   var $lrc = $('.min-lrc')
//   var $frag = $(document.createDocumentFragment())
//   for (let j = 0, l = result.length; j < l; j++) {
//     var $li = $('<p>' + result[j][1] + '</p>')
//     $li.css('top', j * 33 + 'px')
//     $frag.append($li)
//   }
//   $(".min-ct").empty()
//   $('.min-ct').append($frag)
// }

//歌词隐藏/出现
$('.lrc').click(function () {
  if ($(".ct-lrc").css("display") === 'none') {
    $('#lyric').children().fadeIn()
    $('.tab').fadeOut()
    $('.music-info').fadeOut()
  } else {
    $('#lyric').children().fadeOut()
    $('.tab').fadeIn()
    $('.music-info').fadeIn()
  }
})
