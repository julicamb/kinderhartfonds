var _theme,
    _phase,
    _video,
    _activeVideo,
    _speed,
    _playing,
    _fadeLength;

$(function() {
    $('body').addClass('background');
    //$('#speed').hide();
    // init globale variabelen
    _video = [];
    _video[1] = $('#video1');
    _video[2] = $('#video2');
    _activeVideo = 1;
    _speed = 1;
    _playing = false;
    _fadeLength = 1000;

    var goal = 60;
    var lastTapSeconds = 0;
    var bpm = 0;
    var beats = [];

        $('body').keydown(function(e) {  //keypress did not work with ESC;
            if (event.which == '75') {
                var tapSeconds = new Date().getTime();
                bpm = ((1 / ((tapSeconds - lastTapSeconds) / 1000)) * 60);
                lastTapSeconds = tapSeconds;
                beats.push(Math.floor(bpm));
            }
        });

    window.setInterval(function(){
     $('#speed').text(Math.floor(bpm));
        if(Math.floor(bpm) > (goal+10)){
            $('#speed').attr('style', 'color:red')
        } else if(Math.floor(bpm) < (goal-10)){
            $('#speed').attr('style', 'color:yellow')
        } else {
            $('#speed').attr('style', 'color:#00FF7F')
        }
    }, 500);

    var socket = io('http://192.168.1.7:8000');

    socket.on('running', function(theme, phase, led, speed) {
        $('body').removeClass('background');
        //$('#speed').fadeIn(_fadeLength);
        // staat momenteel uit omdat er nog geen echte data is uit de fiets
        _theme = theme;
        _phase = phase;
        _speed = speed;
        switchVideo();
    });

    socket.on('stop', function(){
        $(_video[_activeVideo]).fadeOut(_fadeLength, function() {
            _video[_activeVideo][0].pause();
            $('body').addClass('background');
        });
        //$('#speed').fadeOut(_fadeLength);
    });
    socket.on('speed update', function(speed){
        _video[_activeVideo][0].playbackRate = speed;
    });

});

function switchVideo(){
    // speed resetten bij nieuwe video
    _speed = 1;
    // check of er tussenscherm moet getoond worden
    if(_phase != 1 && _phase != 2 && _phase != 8) {
        // tussenscherm-video
        var src = '../assets/videos/' + _theme + '/' + (_phase-1) + '_naar_' + _phase + '.mp4';
        console.log(src);
        play(src, false);
    } else {
        // fase-video
        var src = '../assets/videos/' + _theme + '/' + _phase + '.mp4';
        console.log(src);
        play(src, true);
    }

    // bij einde van een tussenscherm video, fase-video tonen en terug laten loopen
    _video[_activeVideo].on('ended', function() {
        // ended wordt enkel getriggered bij niet-loopende video's
        // maar toch om mogelijke toekomstige problemen te verhinderen
        if(!_video[_activeVideo].attr('loop')) {
            var src = '../assets/videos/' + _theme + '/' + _phase + '.mp4';
            play(src, true);
        }
    });
}

function play(src, loop) {
    // zorgen dat eerste video niet onmiddelijk outfade
    if(_playing) {
        // huidige video opslaan omdat _activeVideo geswitched is na de fadeOut
        var videoToPause = _video[_activeVideo][0];
        $(_video[_activeVideo]).fadeOut(_fadeLength, function() {
            videoToPause.pause();
        });
        // _activeVideo switchen van 1 naar 2 (of omgekeerd)
        _activeVideo = _activeVideo == 1 ? 2 : 1;
        $(_video[_activeVideo]).fadeIn(_fadeLength);
    } else {
        $(_video[_activeVideo]).fadeIn(_fadeLength);
        _playing = true;
    }

    _video[_activeVideo].attr('loop', loop);
    _video[_activeVideo][0].src = src;
    _video[_activeVideo][0].load();
    _video[_activeVideo][0].play();
    _video[_activeVideo][0].playbackRate = _speed;
}