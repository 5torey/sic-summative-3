$(document).ready(function () {  


    function populateEnquireForm(){
        console.log('in populate')
        let enquireContainer = $("#enquireContainer");
        

        enquireContainer.html(`
        <input type="text" placeholder="first name" name="" id="enquiryFirstName">
        <input type="text" name="" placeholder="last name" id="enquiryLastName">
        <input type="email" placeholder="email" name="" id="enquiryEmail">
        <textarea name="" placeholder="message..." id="" cols="30" rows="10" id="enquiryMessage"></textarea>
        <button class="submit-button" id="enquireSubmit">submit</button>
        `)

        $('#enquireSubmit').click(function(){
            slideDown($("#enquireContainer"));
            
        })
    }
    function populateCommentContainer(){
        console.log('in populate 2')
        let commentContainer = $("#commentsContainer");
        

        commentContainer.html(`
        <div class="all-comments">
                <div class="comment">
                <p class="username">username</p>
                <p class="date">19/03/23</p>
                <p class="comment-content">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum</p>

            </div>
        <div class="comment"></div>
        <div class="comment"></div>
      
    
      </div>
      <div class="comment-input-container">
        <textarea placeholder="add a comment..."></textarea>
        <button class="submit-button" id="commentSubmit">submit</button>

      </div> 

        `)

        $('#commentSubmit').click(function(){
           
            
        })
    }

    function submitEnquiry(){

    }
//    Function to open/close left side off canvas
    function offCanvasLeft(){
        let offcanvas = $("#offCanvasLeft");
        let background = $('#backgroundOverlay')
        let close = $('#closeOffcanvasLeft')


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

        close.click(function(){
            offcanvas.css('left', '-100vw')
            offcanvas.addClass('closed');
            offcanvas.addClass('closed');
            background.css ('animation', 'blurOut .5s linear')
            offcanvas.removeClass('open')
            background.addClass('hidden')
            offcanvas.removeClass('open')
            
           })
        

    }

    function offCanvasRight(){
        let offcanvas = $("#offCanvasRight")
        let background = $('#backgroundOverlay')
        let close = $('#closeOffcanvasRight')

        if (offcanvas.hasClass('closed')){
            console.log('opening')
            offcanvas.css('left', '0vw')
            offcanvas.removeClass('closed');
            background.css ('animation', 'blurIn .5s linear')
            background.removeClass('hidden')
            // offcanvas.addClass('open');
          

           


        }
        close.click(function(){
            offcanvas.css('left', '130vw')
            offcanvas.addClass('closed');
           
            offcanvas.removeClass('open')
            background.css ('animation', 'blurOut .5s linear')
            background.addClass('hidden')
            
           })

    }

    function slideUp(element){
       element.css ('border-top','1px solid black');
        element.css ('animation','slideUp 1.5s ease');
        element.css ('height','55vh');
        
        

    }

    function slideDown(element){
        console.log('in slidedown');
        element.css ('border-top','none');
        element.css ('animation','slideDown 1.5s ease');
        element.css ('height','0vh');
        element.html('')
    }


    // ------------- CLICK EVENTS ------------

    $("#hamburgerIcon").click(function(){
        offCanvasLeft()
    })
    $("#hamburgerIconMobile").click(function(){
        offCanvasLeft()
    })
    $("#reviewBtn").click(function(){
        slideUp($("#commentsContainer"))
        setTimeout(populateCommentContainer, 1500)
       
    })
    $("#orderBtn").click(function(){
        slideUp($("#enquireContainer"))
        setTimeout(populateEnquireForm, 1500)
        
       
    })

   
    $('#commentSubmit').click(function(){
        slideDown($("#commentsContainer"))
        
    })

    $("#mobileOffcanvasOpen").click(function(){
        offCanvasRight();
    })


});

