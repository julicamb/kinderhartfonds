$(function() {

    _video1 = $('#video1');
    _video2 = $('#video2');
    _videoSrc1 = $('#video1')[0];
    _videoSrc2 = $('#video2')[0];

    _video2.hide();

    $('.btn').click(function() {

        $(_video1).fadeOut(2000, function() {

            $(_video1).remove();

        });

        $(_video2).show();

    });

});