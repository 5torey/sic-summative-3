// ------------- LOADING PAGE ANIMATION -----------------




$(document).ready(function () {
    let url;

    $.ajax({
        url: 'config.json',
        type: 'GET',
        dataType: 'json',
        success: function (configData) {
            console.log(configData.SERVER_URL, configData.SERVER_PORT);
            url = `${configData.SERVER_URL}:${configData.SERVER_PORT}`;

        },
        error: function (error) {
            console.log(error);
        }
    });



    // -------------- AJAX FUNCTIONS -------------------

    async function getAllProducts() {

        let products;

        try {
            products = await $.ajax({
                url: `http://${url}/allProducts`,
                type: 'GET',
                dataType: 'json',

            })

            console.log(products);
            return products;
        } catch (error) {
            console.error(error)
        }

    }

    async function getAllVendors() {

        let vendors;

        try {
            vendors = await $.ajax({
                url: `http://${url}/allVendors`,
                type: 'GET',
                dataType: 'json',

            })

            return vendors;
        } catch (error) {
            console.error(error)
        }

    }



    function getSingleProduct(id) {
        $.ajax({
            url: `http://${url}/singleProcuct/${id}`,
            type: 'GET',
            dataType: 'json',

            success: function (product) {

                return product;
            },
            error: function () {
                alert('Unable to get this product')
            }
        })
    }

    async function getSingleVendor(id) {

        let vendor;

        try {
            vendor = await $.ajax({
                url: `http://${url}/singleVendor/${id}`,
                type: 'GET',
                dataType: 'json',

            })

            return vendor;
        } catch (error) {
            console.error(error)
        }
    }

    async function getVendorProducts(id){

        let products = [];

        try {

            allProducts = await $.ajax({
                url: `http://${url}/allProducts`,
                type: 'GET',
                dataType: 'json',

            })


            allProducts.forEach(product => {
               
                if (id == product.user_id){
                   
                    products.push(product);
                } 
            })

            return products;
        } catch (error) {
            console.error(error)
        }
    }

    function addProduct(newTitle, newPrice, newImage, newDescription, newCategory, newSubCategory) {
        $.ajax({
            url: `http://${url}/addProduct`,
            type: 'POST',
            dataType: 'json',
            data: {
                name: newTitle,
                price: newPrice,
                image: newImage,
                description: newDescription,
                category: newCategory,
                sub_category: newSubCategory

            },
            success: function (result) {

            },
            error: function () {
                console.log("Unable to update product")
            }
        })

    }

    function updateProduct(id) {

        $.ajax({
            url: `http://${url}/updateProduct/${id}`,
            type: 'PATCH',
            dataType: 'json',
            data: {
                name: newTitle,
                price: newPrice,
                image: newImage,
                description: newDescription,
                category: newCategory,
                sub_category: newSubCategory

            },
            success: function (result) {

            },
            error: function () {
                console.log("Unable to update product")
            }
        })
    }

    function deleteProduct(id) {
        $.ajax({
            url: `http://${url}/deleteProduct/${id}`,
            type: 'DELETE',
            success: function () {


            },
            error: function () {
                console.log('error: cannot delete due to call on api');
            } // error                
        }); // ajax

    }


    function login(userType){

    }

    // ---------- POPULATE DOM FUNCTIONS ---------------

    async function populateArtistMenu() {
        let vendors = await getAllVendors();

       vendors.forEach(vendor => {
        let vendorName = vendor.name;
        let artistList = $('#artistList');
        let artistListMobile = $('#artistListMobile');
        
        artistList.append(`<li class="artist-link vendor-link" data-vendorID='${vendor._id}'>${vendorName}</li>`)
        artistListMobile.append(`<li class="artist-link vendor-link" data-vendorID='${vendor._id}>${vendorName}</li>`)

        

        
       });
       openArtistPage()

        console.log(vendors);

    }

    function openArtistPage(){
        console.log('in open artist page function');
        let artistLinks = document.querySelectorAll('.vendor-link');
        let links = Array.from(artistLinks);
        console.log(links);

        links.forEach(link => {
            link.addEventListener('click', () => {
                console.log('link clicked');
                let vendorID = link.dataset.vendorid;
                console.log(vendorID);
                populateArtistPage(vendorID)
            })
              
            })
       

    }

    async function populateArtistPage(id){
        let products = await getVendorProducts(id);
        let vendor = await getSingleVendor(id);
        console.log(products);
        let contentContainer = $('#contentContainer');

        contentContainer.html(`

        <div class="listing-info-container">
 
        <div class="listing-info">
        
         <h1 class="listing-title">${vendor.name}</h1>
     
         <p class="listing-bio">${vendor.bio}</p>
         <h5 ><a href="${vendor.instagram}">Instagram</a></h5>
         
        </div>
        </div>

        <div class="image-container" id="artistImageContainer"></div>

        
        
        `)

        let imageContainer = $('#artistImageContainer');

        products.forEach(product => {
            imageContainer.append(
                `
                <div class="listing-image">
        <div class="image-overlay"></div>
        <img src="${product.image}" alt="">
      </div>`
            )
        })


    }


    async function populateHomeImages(){
        let products = await getAllProducts();
        console.log(products);
        let imageContainer = $("#imageContainerHome");

        products.forEach(product => {
            imageContainer.append(
                `
                <div class="listing-image">
        <div class="image-overlay"></div>
        <img src="${product.image}" alt="">
      </div>`
            )
        })

    }

    function populateEnquireForm() {
        console.log('in populate')
        let enquireContainer = $("#enquireContainer");


        enquireContainer.html(`
        <i class="fa-solid fa-xmark" id="closeEnquire"></i>
        <input type="text" placeholder="first name" name="" id="enquiryFirstName">
        <input type="text" name="" placeholder="last name" id="enquiryLastName">
        <input type="email" placeholder="email" name="" id="enquiryEmail">
        <textarea name="" placeholder="message..." id="" cols="30" rows="10" id="enquiryMessage"></textarea>
        <button class="submit-button" id="enquireSubmit">submit</button>
        `)


        $('#closeEnquire').click(function () {
            slideDown($("#enquireContainer"));

        })
        $('#enquireSubmit').click(function () {
            slideDown($("#enquireContainer"));

        })
    }

    function populateCommentContainer() {
        console.log('in populate 2')
        let commentContainer = $("#commentsContainer");


        commentContainer.html(`
        <i class="fa-solid fa-xmark" id="closeComments"></i>
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
        $("#closeComments").click(function () {
            slideDown($("#commentsContainer"))
        })

        $('#commentSubmit').click(function () {


        })
    }

    function submitEnquiry() {

    }
    //    Function to open/close left side off canvas
    function offCanvasLeft() {
        let offcanvas = $("#offCanvasLeft");
        let background = $('#backgroundOverlay')
        let close = $('#closeOffcanvasLeft')
        let screenWidth = $(window).width();


        if (offcanvas.hasClass('closed')) {
            console.log('opening')
            offcanvas.css('left', '0vw')
            offcanvas.removeClass('closed');
            // offcanvas.addClass('open');
            background.css('animation', 'blurIn .5s linear')
            background.removeClass('hidden')

            background.click(function () {
                offcanvas.css('left', '-40vw')
                offcanvas.addClass('closed');
                background.css('animation', 'blurOut .5s linear')
                offcanvas.removeClass('open')
                background.addClass('hidden')
            })


        }

        close.click(function () {

            if (screenWidth <= 425) {
                offcanvas.css('left', '-100vw')
            } else {
                offcanvas.css('left', '-40vw')
            }
            offcanvas.addClass('closed');
            background.css('animation', 'blurOut .5s linear')
            offcanvas.removeClass('open')
            background.addClass('hidden')

        })


    }

    function offCanvasRight() {
        let offcanvas = $("#offCanvasRight")
        let background = $('#backgroundOverlay')
        let close = $('#closeOffcanvasRight')

        if (offcanvas.hasClass('closed')) {
            console.log('opening')
            offcanvas.css('left', '0vw')
            offcanvas.removeClass('closed');
            background.css('animation', 'blurIn .5s linear')
            background.removeClass('hidden')
            // offcanvas.addClass('open');





        }
        close.click(function () {
            offcanvas.css('left', '130vw')
            offcanvas.addClass('closed');

            offcanvas.removeClass('open')
            background.css('animation', 'blurOut .5s linear')
            background.addClass('hidden')

        })

    }

    function slideUp(element) {
        element.css('border-top', '1px solid black');
        element.css('animation', 'slideUp 1.5s ease');
        element.css('height', '55vh');



    }

    function slideDown(element) {
        console.log('in slidedown');
        element.css('border-top', 'none');
        element.css('animation', 'slideDown 1.5s ease');
        element.css('height', '0vh');
        element.html('')
    }


    // ------------- CLICK EVENTS ------------

    $("#hamburgerIcon").click(function () {
        offCanvasLeft()
    })
    $("#hamburgerIconMobile").click(function () {
        offCanvasLeft()
    })
    $("#reviewBtn").click(function () {
        slideUp($("#commentsContainer"))
        setTimeout(populateCommentContainer, 1500)

    })
    $("#orderBtn").click(function () {
        slideUp($("#enquireContainer"))
        setTimeout(populateEnquireForm, 1500)


    })


    $('#commentSubmit').click(function () {
        slideDown($("#commentsContainer"))

    })

    $("#mobileOffcanvasOpen").click(function () {
        offCanvasRight();
    })


    // ---------------- LOADING SCREEN --------------------------

    setTimeout(() => {
        $("#enterText").css('animation', 'fadeIn 3s ease');
        $("#enterText").css('opacity', '1');
    }, 2000)

    $('#enterText').click(function () {
        $("#loadingScreen").css('animation', 'fadeOut 1.5s ease');
        setTimeout(() => {
            $("#loadingScreen").css('display', 'none');
        }, 1500)


        populateArtistMenu()
        populateHomeImages()
        
    })

    

});