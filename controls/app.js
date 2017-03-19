var _socket = io(),
    _theme = 0,
    _phase = 0,
    _speed = 1,
    _speedStep = 0.2,
    _speedMin = 1,
    _speedMax = 5,
    _testStarted = 0,
    _phasesDuration = [];


var _themes = [
    {
        'slug' : 'ruimte',
        'name' : 'Ruimte',
        'leds' : [
            '#E4744E',
            '#E4744E',
            '#FBE5C0',
            '#E32C4A',
            '#EFB9DB',
            '#E0AD5A',
            '#FBE5C0',
            '#E4744E'
        ]
    },
    {
        'slug' : 'reis',
        'name' : 'Reis rond de Wereld',
        'leds' : 0
    },
    {
        'slug' : 'mjungle',
        'name' : 'Jungle',
        'leds' : 0
    },
    {
        'slug' : 'vjungle',
        'name' : 'Jungle',
        'leds' : 0
    },
    {
        'slug' : 'mcircus',
        'name' : 'Circus',
        'leds' : 0
    },
    {
        'slug' : 'vcircus',
        'name' : 'Circus',
        'leds' : 0
    }
];




var _phases = [
    'Intro',
    'Ademtest',
    'Opwarming',
    'Lastiger',
    'Verzuring',
    'Uitputting',
    'Finish en losrijden',
    'Outro'
];




$(function() {




    // FastClick schakelt de 300ms vertraging uit bij touch
    // zie https://github.com/ftlabs/fastclick
    FastClick.attach(document.body);

    
    
    
    // timer om duur van fases bij te houden
    window.setInterval(function(){
        timerTick();
    }, 1000);


    var test = function(){
        _socket.emit('ControlLogin');
        console.log('emit control happened');
    };
    test();

    _socket.on('VideoLogin', function() {
        console.log('video logged in')
    });


    _socket.on('running', function(theme, phase, led, speed) {

        if(!_testStarted) {

            // gekozen thema uit themes array halen via slug-naam vanop server
            for(var i = 0; i < _themes.length; i++) {
                if(_themes[i]['slug'] == theme)
                    _theme = _themes[i];
            }

            _phase = phase;

            drawPhases();

            _testStarted = 1;

        }

    });




    listThemes();




});




function listThemes() {




    // thema's weergeven
    var html = '<div id="themes">'
             + '<h1>Kies een thema</h1>'
             + '<div class="row">';

    for(var i = 0; i < _themes.length; i++) {

        html += '<div class="col col-xs-6 col-md-4">'
              + '<img src="../usbdrv/assets/themes/' + _themes[i]['slug'] + '.png" id="' + i + '" />'
              + '</div>'
    }

    html += '</div>'
          + '<button class="btn btn-lg disabled" id="btnStart">Start de test</button>&nbsp;'
          + '<button class="btn btn-lg btn-danger" id="btnStopSystem">Zet systeem uit</button>'
        + '</div>';

    // delay en fade-in zodat tekst en afbeeldingen tegelijk verschijnen
    $('body').delay(1000).hide().append(html).fadeIn(200);

    $('#btnStopSystem').confirm({
        text: 'Volledig systeem uizetten? <br> Opgelet, wacht enkele seconden na dat de schermen <br> volledig zwart zijn voor dat je de stroom uitzet',
        //title: 'Einde test',
        confirm: function(button) {
            _socket.emit('stopSystem');
        },
        cancel: function(button) {},
        confirmButton: 'Ja, stop de App',
        cancelButton: 'Nee, hervat de test',
        post: true,
        confirmButtonClass: 'btn-danger',
        cancelButtonClass: 'btn-default',
        dialogClass: 'modal-dialog modal-md'
    });


    $('#btnStart').click(function() {

        if(!$(this).hasClass('disabled')) {
            startTest(1, true);
        }

        return false;

    });




    // click event toevoegen
    $('#themes img').click(function() {

        $('#themes img').each(function() {
            $(this).removeClass('selected');
        });

        $(this).addClass('selected');

        // gekozen thema id opslaan (zit in img id)
        _theme = _themes[$(this).attr('id')];

        // start knop enablen (enkel nodig bij eerste click)
        $('#themes button').removeClass('disabled');

    });




}




function startTest(phase, start) {

        // gekozen thema verzenden
        _socket.emit('theme picked', _theme['slug']);
    // themes div verbergen met een fadeout en daarna verwijderen
    $('#themes').fadeOut(200, function() {
        $('body').empty();

        // fase 1 instellen en verzenden, led kleur ook meezenden
        _phase = phase;
        if(start == true){
            _phase = 1;
            _socket.emit('running', _theme['slug'], _phase, _theme['leds'][phase - 1], 1);
            console.log(_theme['slug'] + ' ' + _theme['leds'][phase - 1] + ' ' + _phase);
        } else {
            _socket.emit('phase update', _phase, _theme['leds'][phase - 1]);
            console.log('new fase: ' + _phase);
        }
        drawPhases();
    });
}




function drawPhases() {




    // body nog eens legen voor als deze functie opgeroepen wordt in socket.on('running')
    $('body').empty();



    //tijd is leeg
    var html = '<table class="table">'
             + '<thead>'
             + '<tr>'
             + '<th colspan="2">'
             + 'thema: <span class="text-uppercase">' + _theme['name'] + '</span><br />'
             + '</th>'
             + '<th class="text-right">'
             + '<span id="totalDuration"></span>'
             + '</th>'
             + '</tr>'
             + '</thead>'
             + '<tbody>';

    for(var i = 0; i < _phases.length; i++) {

        //tijd is leeg
        html += '<tr id="' + (i+1) + '" style="border-color:' + _theme['leds'][i] + '">'
              + '<td style="background-image:url(\'../usbdrv/assets/screenshots/' + _theme['slug'] + '/' + (i+1) + '.jpg\')">'
              + '</td>'
              + '<td><span>' + _phases[i] + '</span></td>'
              + '<td class="text-right"><span id="duration' + (i+1) + '">' + '' + '</span></td>'
              + '</tr>';

    }

    html += '</tbody>'
          + '<tfoot>'
          + '<tr>'
          + '<td colspan="3" class="text-center">'
          + '<button href="#" class="btn btn-lg" id="btnPrevious">'
          + '<span class="glyphicon glyphicon-arrow-up" title="Vorige fase"></span>'
          + '</button>&nbsp;'
          + '<button href="#" class="btn btn-lg" id="btnNext">'
          + '<span class="glyphicon glyphicon-arrow-down" title="Volgende fase"></span>'
          + '</button>'
          + '<button href="#" class="btn btn-lg pull-right" id="btnStop">'
          + '<span class="glyphicon glyphicon-off" title="Einde test"></span>'
          + '</button>'
          + '</td>'
          + '</tr>'
          + '</tfoot>'
          + '</table>';

    $('body').append(html);
    updateSpeedSpanAndButtons();
    $('table').hide().fadeIn(2000, function() {

    });




    // Einde test-knop configureren (via jquery.confirm)
    $('#btnStop').confirm({
        text: 'Wil je de test stopzetten?',
        //title: 'Einde test',
        confirm: function(button) {
            stopTest();
        },
        cancel: function(button) {},
        confirmButton: 'Ja, stop de test',
        cancelButton: 'Nee, hervat de test',
        post: true,
        confirmButtonClass: 'btn-danger',
        cancelButtonClass: 'btn-default',
        dialogClass: 'modal-dialog modal-md'
    });




    // huidige fase aanduiden
    updateTable();




    // button events toevoegen
    $('.btn').bind('click', function() {

        switch($(this).attr('id')) {

            case 'btnPrevious':
                tryPreviousOrNextPhase('prev');
                break;

            case 'btnNext':
                tryPreviousOrNextPhase('next');
                break;

            case 'btnSlower':
                trySlowerOrFaster('slower');
                break;

            case 'btnFaster':
                trySlowerOrFaster('faster');
                break;

        }

        return false;

    });




    // row events toevoegen
    $('tbody tr').bind('click', function() {

        // fase 1 lager instellen dan geklikte fase want tryPreviousOrNextPhase('next') doet +1
        _phase = $(this).attr('id') - 1;
        tryPreviousOrNextPhase('next');

    });




    // keyboard events toevoegen (en eerst verwijderen om bug op te lossen)
    $(this).off('keydown');
    $(this).bind('keydown', function(e) {

        // als er een toets gedrukt is die we gebruiken, return false, zoniet return true
        // (anders werken toetsen zoals CMD+R en F5 niet meer)
        rf = true;

        switch(e.which) {

            // pijltje naar beneden
            case 40:
                trySlowerOrFaster('slower');
                rf = false;
                break;

            // pijltje naar omhoog
            case 38:
                trySlowerOrFaster('faster');
                rf = false;
                break;

            // pijltje naar links
            case 37:
                tryPreviousOrNextPhase('prev');
                rf = false;
                break;

            // pijltje naar rechts
            case 39:
                tryPreviousOrNextPhase('next');
                rf = false;
                break;

        }

        return rf;

    });

}




function updateTable() {

    $('tr').each(function() {
        $(this).removeClass('current');
    });

    $('tr#' + _phase).each(function() {
        $(this).addClass('current');
    });

    if(_phase == 1) {

        $('#btnPrevious').addClass('disabled');

    } else if(_phase == _phases.length) {

        $('#btnNext').addClass('disabled');

    } else {

        $('#btnPrevious').removeClass('disabled');
        $('#btnNext').removeClass('disabled');

    }

}




function stopTest() {

    _socket.emit('stop');

    // keyboard en click events wissen
    $(this).off('keydown');
    $('tr').off('click');
    $('.btn').off('click');

    $('table').fadeOut(200, function() {
        $('body').empty();
        //setTimeout(200, listThemes());
        listThemes();
    });

    _testStarted = 0;
    _speed = 1;
    _phasesDuration = [];

}




function tryPreviousOrNextPhase(e) {

    var proceed = false;
    
    switch(e) {

        case 'prev':
            if(_phase != 1) {
                _phase--;
                proceed = true;
                animateBtn('btnPrevious');
            }
            break;

        case 'next':
            if (_phase != _phases.length) {
                _phase++;
                proceed = true;
                animateBtn('btnNext');
            }
            break;
        
    }

    if(proceed) {

        _socket.emit('phase update', _phase, _theme['leds'][_phase - 1]);
        _speed = 1;
        console.log('fase ' + _phase + '/' + _phases.length);

        updateTable();
        updateSpeedSpanAndButtons();

    }
    
}




function trySlowerOrFaster(e) {

    console.log('speed before update:', _speed);

    var proceed = false;

    switch(e) {

        case 'slower':
            if(_speed > _speedMin) {
                _speed -= _speedStep;
                animateBtn('btnSlower');
                proceed = true;
            }
            break;

        case 'faster':
            if(_speed < _speedMax) {
                _speed += _speedStep;
                animateBtn('btnFaster');
                proceed = true;
            }
            break;

    }

    if(proceed) {

        console.log('speed now:', _speed);
        _speed = Math.round(_speed * 100) / 100;
        _socket.emit('speed update', _speed);
        updateSpeedSpanAndButtons();

    }

}




function updateSpeedSpanAndButtons() {

    if(_speed <= _speedMin)
        $('#btnSlower').addClass('disabled');
    else
        $('#btnSlower').removeClass('disabled');

    if(_speed >= _speedMax)
        $('#btnFaster').addClass('disabled');
    else
        $('#btnFaster').removeClass('disabled');

    $('#speed').text(Math.round(100 * _speed) + '%');

}




function animateBtn(btnId) {

    $('#' + btnId).addClass('click-effect');
    setTimeout(function(){
        $('#' + btnId).removeClass('click-effect');
    }, 200);

}




function timerTick() {

    if(_testStarted) {

        if(_phasesDuration[_phase] == null)
            _phasesDuration[_phase] = 1;
        else
            _phasesDuration[_phase] ++;

        $('#duration' + _phase).text(secondsToString(_phasesDuration[_phase]));
        $('#totalDuration').text(secondsToString(calcTotalDuration()));

    }
    
}




function secondsToString(seconds) {

    //var numyears = Math.floor(seconds / 31536000);
    //var numdays = Math.floor((seconds % 31536000) / 86400);
    //var numhours = Math.floor(((seconds % 31536000) % 86400) / 3600);
    //return numyears + " years " +  numdays + " days " + numhours + " hours " + numminutes + " minutes " + numseconds + " seconds";
    var numminutes = Math.floor((((seconds % 31536000) % 86400) % 3600) / 60);
    var numseconds = (((seconds % 31536000) % 86400) % 3600) % 60;
    return padding(numminutes, 2) + ':' + padding(numseconds, 2);

}




function padding(n, width, z) {
    z = z || '0';
    n = n + '';
    return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
}




function calcTotalDuration() {

    var totalDuration = 0;

    for(var i = 0; i < _phasesDuration.length; i++) {
        if(_phasesDuration[i])
            totalDuration += _phasesDuration[i];
    }

    return totalDuration;

}