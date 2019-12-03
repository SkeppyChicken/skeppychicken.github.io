if(!localStorage.getItem('radioStation')) {
  localStorage.setItem('radioStation', 'https://radio.chickenfm.com/radio/8000/radio.mp3')
}
if(!localStorage.getItem('api')) {
  localStorage.setItem('api', 'chickenfm')
}
var api = localStorage.getItem('api')

  function updateNowplaying(data) {
    //var data = res.data
    var song = data.now_playing.song.artist + " - " +data.now_playing.song.title;
    var track = data.now_playing.song.title;
    var artist = data.now_playing.song.artist;

    document.getElementById("track").innerHTML = track.toString();
    document.getElementById("artist").innerHTML = artist.toString();
    //var dj = data.live.streamer_name + ":";
    var djstat = data.live.streamer_name;
    document.getElementById("dj").innerHTML = dj.toString()
    if(djstat == "") {
      document.getElementById("dj").innerHTML = "AutoDJ";
      //document.getElementById("request").innerHTML = `<a href="#" id="myBtn">Request songs</a>`;
    } else {
      document.getElementById("dj").innerHTML = djstat.toString();
      //document.getElementById("request").innerHTML = `<a href="#popup1">Suggest songs</a>`;
    }

    coversrc = data.now_playing.song.art;
    //imagesrc = cover.toString();
    //imagehtml = '<img src="'+imagesrc+'"></img>'
    image = document.getElementById('coverimg');
    image.src = coversrc.toString();
    //image.innerHTML = imagehtml.toString()
    //image.innerHTML = cover.toString();

    // When audio starts playing...
    if ('mediaSession' in navigator) {
    navigator.mediaSession.metadata = new MediaMetadata({
        title: track,
        artist: artist,
        album: 'ChickenFM',
        artwork: [
            { src: coversrc.toString(), type: 'image/jpg' },
      ]
        });
    navigator.mediaSession.setActionHandler('play', function(){
      playRadioKey()
    });
    navigator.mediaSession.setActionHandler('pause', function(){
      pauseRadioKey()
        });
      }

   //setTimeout(playing, 5000);
 } 	//playing();
 var ws;
 function playingNew(api) {
   if("WebSocket" in window) {
    ws = new WebSocket("wss://radio.chickenfm.com/api/live/nowplaying/"+api);

    ws.onmessage = function(evt) {
      
      var message = evt.data;
      nowPlaying = JSON.parse(message);
      updateNowplaying(nowPlaying)
      elapsed = JSON.parse(message).now_playing.elapsed
      var played_at = nowPlaying.now_playing.played_at
      var duration = nowPlaying.now_playing.duration
      if(nowPlaying.live.is_live == true){
        if(countTime.interval)clearTimeout(countTime.interval);
        document.getElementById('elapsed').innerHTML = 'N.A.'
        document.getElementById("duration").innerHTML = 'N.A.'
        return;
      }
      if(countTime.interval)
          clearTimeout(countTime.interval);
      
      countTime(played_at, duration)
     }
     ws.onerror = () => {
      ws.close()
      setTimeout(function(){playingNew(localStorage.getItem('radioStation'))}, 1000)
     }
     ws.onclose = () => {
      setTimeout(function(){playingNew(localStorage.getItem('radioStation'))}, 1000)
     }
   }

 }

 //playingNew(api)

 function countTime(played_at, total){
  var ts = Math.round((new Date()).getTime() / 1000);
  //var seconds = (date2 - date1) / 1000
  var seconds = ts - played_at
  //console.log(seconds)
  //second = parseInt(second)
  if(seconds < 0)
    seconds = 0
  
  if(seconds !== total){
    second = seconds + 1
    document.getElementById('elapsed').innerHTML = getTime(second * 1000)
    document.getElementById("duration").innerHTML = getTime(total * 1000)
  }
  countTime.interval = setTimeout(function(){ countTime(played_at, total); }, 1000);
}

 var getTime = (millisec) => {
  // Credit: https://stackoverflow.com/questions/19700283/how-to-convert-time-milliseconds-to-hours-min-sec-format-in-javascript
  var seconds = (millisec / 1000).toFixed(0);
  var minutes = Math.floor(seconds / 60);
  var hours = "";
  if (minutes > 59) {
    hours = Math.floor(minutes / 60);
    hours = (hours >= 10) ? hours : "0" + hours;
    minutes = minutes - (hours * 60);
    minutes = (minutes >= 10) ? minutes : "0" + minutes;
  }
  // Normally I'd give notes here, but I actually don't understand how this code works.
  seconds = Math.floor(seconds % 60);
  seconds = (seconds >= 10) ? seconds : "0" + seconds;
  if (hours != "") {
    return hours + ":" + minutes + ":" + seconds;
  }
  return minutes + ":" + seconds;
}

 var stream = document.getElementById("player");
 stream.pause()
 //loadRadio()
 volumeslider = document.getElementById("volumeslider");
 volumeslider.addEventListener("mousemove", setvolume);
function setvolume(){
  stream.volume = volumeslider.value / 100;
}
$('.togl').click(function(){
  toggleRadio();
});
function toggleRadio(){
  if (stream.paused){
    playRadio();
  } else {
    pauseRadio();
  }
}
function playRadio(){
  stream.src = "";

  stream.src = localStorage.getItem('radioStation');
  //stream.volume = 0;

  $('.togl').attr("class", "togl fas fa-circle-notch fa-spin");
  stream.play().then(function() {
    stream.volume = 0.6;
    $('.togl').attr("class", "togl fa fa-pause");
    $('.volume').attr("class", "volume")
    stream.volume = volumeslider.value / 100;


  }).catch(function() {
    pauseRadio();
  });
}

function pauseRadio(){
  stream.pause();
  stream.volume = 0;
  stream.src = "";
  $('.togl').attr("class", "togl fa fa-play");
  $('.volume').attr("class", "volume displaynone")
}

function pauseRadioKey() {
  stream.pause();
  stream.volume = 0;
  //stream.src = "";
  $('.togl').attr("class", "togl fa fa-play");
  $('.volume').attr("class", "volume displaynone")
}

function playRadioKey() {
  stream.src = "";
  playRadio()
}

function volumeChange(){
  volumeslider = document.getElementById("volumeslider");
  stream.volume = volumeslider.value / 100;
  setTimeout(volumeChange, 1000);
} volumeChange()
