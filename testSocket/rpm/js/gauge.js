/**
 * Created by julien on 28/03/2017.
 */
var socket = io();

socket.on('themaNaam', function(data) {
    $('#themaNaam').text(data);
});
socket.emit("RPM");

socket.on('newData', function(data){
    console.log('New Data: ' + data);
    $('#Rpm').text(data);
    function rotateDial()
    {
        /////// when the server returns, show the result in the div:
        //var str = data.data;
        ///////only get the rpm number
        //var rpm = parseInt(str.replace(/\D/g,''));
        var rpm = data;
        ///////make sure it's a number
        console.log(typeof rpm + rpm);

        //get the div's
        var dial = $(".dial img");
        var gauge_value = $(".gauge .value");
        var thumb = $("#thumb_green")

        //start at 0
        var posLeft = 45;
        var value = rpm;

        //move the dial to correct position
        if (value >= 75) {
            value = 75;
            posLeft = ((value - 45) * 40.8) + 658 ;
            thumb.css({'display': 'none'});
        } else if (value <= 45) {
            posLeft = 658;
            thumb.css({'display': 'none'});
        } else {
            posLeft = ((value - 45 ) * 40.8) + 658 ;
            thumb.css({'display': 'initial'});
        }

        gauge_value.html(value + " rpm");

        dial.css({'left': posLeft});
        dial.css({'-webkit-transition': 'all 1.5s ease-out'});
        dial.css({'-moz-transition': 'all 1.5s ease-out'});
        dial.css({'-ms-transition': 'all 1.5s ease-out'});
        dial.css({'-o-transition': 'all 1.5s ease-out'});
        dial.css({'transition': 'all 1.5s ease-out'});
    }
    return rotateDial();
    //setInterval(rotateDial, 1000);
});