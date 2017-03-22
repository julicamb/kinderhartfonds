/*
 * author: Simen De Troch
 * last update: 19/03/2017
 */
// connect to the websocktserver
var socket = new WebSocket("ws://localhost:8080");


function setup() {
    // The socket connection needs two event listeners:
    socket.onopen = openSocket;
    socket.onmessage = showData;
}

function openSocket() {
    //display in console, confirms connection
    socket.send("Hello server");
}

/*
showData(), below, will get called whenever there is new Data
from the server. So there's no need for a draw() function:
*/
function showData(result) {
    function rotateDial()
    {
    // when the server returns, show the result in the div:
    var str = result.data;
    //only get the rpm number
    var rpm = parseInt(str.replace(/\D/g,''));
    //make sure it's a number
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
}