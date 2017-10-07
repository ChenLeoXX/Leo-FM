// Ajax 请求
var audio = new Audio()
audio.autoplay = true
var channel = ''

getRanMusic(call)
function getRanMusic() {
  var xhr = new XMLHttpRequest()
  xhr.open('GET', 'https://jirenguapi.applinzi.com/fm/getSong.php', true)
  xhr.onload = function (callback) {
    if ((xhr.status >= 200 && xhr.status <= 300) || xhr.status === 304) {
      var data = JSON.parse(xhr.responseText)
      call(data)
    }
  }
  xhr.send()
}
function call(data) {
  musicObj = data.song[0]
  console.log(musicObj)
  loadMusic(musicObj)
}
function loadMusic() {
  audio.src = musicObj.url
  $('.songauthor').text(musicObj.artist)
  $('.author p').text(musicObj.title)
  $('.album-img img').attr('src', musicObj.picture)
}
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
  getRanMusic()
})
//喜欢
$('.like').on('click', function () {
  $('.like i').css('color', 'red')
})
//进度条
audio.onplaying = function () {
  process = setInterval(function () {
    $('.current').css('width', audio.currentTime / audio.duration * 100 + '%')
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
$.get('https://jirenguapi.applinzi.com/fm/getSong.php', { channel: "public_yuzhong_hanyu" })
  .done(function (song) {
    console.log(JSON.parse(song).song[0])
  })
// 专辑滑动
$('.left').on('click', function () {
  trans('left')
})
$('.right').on('click', function () {
  trans('right')
})
var timer
function trans(direction) {
  if(timer){
    console.log(timer)
    clearTimeout(timer)
  }
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
    if (translateX === -2300) {
      translateX = -2300
    }
    $('.carrousel').css('transform', 'translateX(' + translateX + 'px)')
}
// var translateX
// var transStyle = getComputedStyle (document.querySelector('.carrousel')).transform
// var curTrans = parseInt(transStyle.split('(')[1].split(')')[0].split(',')[4])
// var windowWrap = parseInt($('.window').css('width'))
// if(direction === 'right') {
//     translateX = curTrans - windowWrap
//     console.log(translateX)
// } else {
//   translateX = curTrans + windowWrap
//   console.log(translateX)
// }
//    if(translateX > 0) {
//      translateX = 0
//    }
//    if(translateX === -2300) {
//     $('.carrousel').css('widht','2300'+'px')
//    }
// $('.carrousel').css('transform', 'translateX('+ translateX +'px)')
