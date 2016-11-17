var _videoId = 3,
    _fadeLength = 2000;

$(function() {

    $('.btn').click(function() {

        $('#video').fadeOut(_fadeLength, function() {

            video0 = $('#video')[0];

            switch(_videoId) {
                case 3:
                    _videoId = 2;
                    break;

                case 2:
                    _videoId = 3;
                    break;
            }

            video0.src = '/assets/videos/ruimte/' + _videoId + '.mp4';
            video0.load();
            video0.play();

            $('#video').fadeIn(_fadeLength);

        });

    });

});