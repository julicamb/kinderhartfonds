var _theme,
    _phase,
    _video,
    _video0,
    _speed = 1;



$(function() {

    $('body').addClass('background');

    var socket = io();

    socket.on('running', function(theme, phase, led, speed) {

        $('body').removeClass('background');

        _theme = theme;
        _phase = phase;
        _speed = speed;

        switchVideo();

    });

    socket.on('stop', function(){

        $('#video').fadeOut(5000, function(){

            _video0.pause();
            _video.css('display', 'none');
            $('body').addClass('background');

        });

    });

    socket.on('speed update', function(speed){

        _video0.playbackRate = speed;

    });

});



function switchVideo(){

    _video = $('#video');
    _video0 = _video[0];

    // speed resetten bij nieuwe video
    _speed = 1;

    if(_phase != 1 && _phase != 7) {

        // tussenscherm-video
        var src = '../assets/videos/' + _theme + '/' + (_phase-1) + '_naar_' + _phase + '.mp4';
        play(src, false);

    }else{

        // fase-video
        var src = '../assets/videos/' + _theme + '/' + _phase + '.mp4';
        play(src, true);

    }

    // bij einde van een tussen-scherm video, fase-video tonen en terug laten loopen
    _video.on('ended', function(){
        if(!_video.attr('loop')){
            var src = '../assets/videos/' + _theme + '/' + _phase + '.mp4';
            play(src, true);
        }
    });

    // video div pas tonen als video ingeladen en aan het spelen is
    _video.css('display', 'block');

}



function play(src, loop) {

    _video.attr('loop', loop);

    _video0.src = src;
    _video0.load();
    _video0.play();
    _video0.playbackRate = _speed;

}