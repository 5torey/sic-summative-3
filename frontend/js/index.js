$(document).ready(function () {  

//    Function to open/close left side off canvas
    function offCanvasLeft(){
        let offcanvas = $("#offCanvasLeft");
        let background = $('#backgroundOverlay')


        if (offcanvas.hasClass('closed')){
            console.log('opening')
            offcanvas.css('left', '0vw')
            offcanvas.removeClass('closed');
            // offcanvas.addClass('open');
            background.css ('animation', 'blurIn .5s linear')
            background.removeClass('hidden')

           background.click(function(){
            offcanvas.css('left', '-40vw')
            offcanvas.addClass('closed');
            background.css ('animation', 'blurOut .5s linear')
            offcanvas.removeClass('open')
            background.addClass('hidden')
           })


        }
        

    }

    function offCanvasRight(){
        let offcanvas = $("#offCanvasRight")
        let background = $('#backgroundOverlay')

        if (offcanvas.hasClass('closed')){
            console.log('opening')
            offcanvas.css('right', '0vw')



        }
        if (offcanvas.hasClass('open')){
            offcanvas.css('right', '130vw')
        }

    }

    $("#hamburgerIcon").click(function(){
        offCanvasLeft()
    })
    $("#hamburgerIconMobile").click(function(){
        offCanvasLeft()
    })
});

