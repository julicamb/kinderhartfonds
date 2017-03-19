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
    var dial = $(".dial .inner");
    var gauge_value = $(".gauge .value");

    //start at 0
    var deg = 45;
    var value = rpm;

    //rotate the dial to correct degree
    if (value >= 75) {
        value = 75;
        deg = (value - 45) * 6 ;
    } else if (value <= 45) {
        deg = 0;
    } else {
        deg = (value - 45 ) * 6 ;
    }
    
    gauge_value.html(value + " rpm");

    dial.css({'transform': 'rotate('+deg+'deg)'});
    dial.css({'-ms-transform': 'rotate('+deg+'deg)'});
    dial.css({'-moz-transform': 'rotate('+deg+'deg)'});
    dial.css({'-o-transform': 'rotate('+deg+'deg)'}); 
    dial.css({'-webkit-transform': 'rotate('+deg+'deg)'});
    }
    return rotateDial();
    //setInterval(rotateDial, 1000);
}