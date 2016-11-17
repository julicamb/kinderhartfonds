var _currentPhase = 1,
    _seconds = 0,
    _secondsPerPhase = 5,
    _videoObj;




$(function() {

    window.setInterval(tick, 1000);

    _videoObj = $('#video')[0];

    $('.btn').click(function() {

        switch ($(this).attr('id')) {

            case 'btnPhase1':
                _currentPhase = 1;
                break;

            case 'btnPhase2':
                _currentPhase = 2;
                break;

            case 'btnPhase3':
                _currentPhase = 3;
                break;

        }

    });

});




function tick() {

    _seconds++;
    console.log(_seconds + 's');

    if(_seconds == _currentPhase * _secondsPerPhase) {

        _videoObj.currentTime = (_currentPhase - 1) * _secondsPerPhase;
        _seconds = (_currentPhase - 1) * _secondsPerPhase;

    }

}