/*jshint esversion: 6 */
// const mongoose = require('mongoose');
// import { ObjectId } from 'mongodb';

$(document).ready(function () {
    let globalProduct;
    // const { ObjectID } = require('mongodb');

    let url;

    $.ajax({
        url: 'config.json',
        type: 'GET',
        dataType: 'json',
        success: function (configData) {
            url = `${configData.SERVER_URL}:${configData.SERVER_PORT}`;
        },
        error: function (error) {

        }
    });



    // -------------- AJAX FUNCTIONS -------------------

    // Get All Products Function

    async function getAllProducts() {

        let products;

        try {
            products = await $.ajax({
                url: `http://${url}/allProducts`,
                type: 'GET',
                dataType: 'json',

            });

            return products;
        } catch (error) {
            console.error(error);
        }

    }

    // Get All Vendors Function 

    async function getAllVendors() {

        let vendors;

        try {
            vendors = await $.ajax({
                url: `http://${url}/allVendors`,
                type: 'GET',
                dataType: 'json',

            });

            return vendors;
        } catch (error) {
            console.error(error);
        }

    }

    // Get Single Product Function

    async function getSingleProduct(id) { 
        
        let product; 
        
        try{ 
            product = await $.ajax({ 
                url: `http://${url}/singleProduct/${id}`, 
                type: 'GET', 
                dataType: 'json', 
            }); 

            return product; 
        } catch (error) { 
            console.error(error); 
        } 
    }



    // Get Single Vendor Function

    async function getSingleVendor(id) {

        let vendor;

        try {
            vendor = await $.ajax({
                url: `http://${url}/singleVendor/${id}`,
                type: 'GET',
                dataType: 'json',

            });

            return vendor;
        } catch (error) {
            console.error(error);
        }
    }

    async function getSingleCollector(id) {

        let collector;

        try {
            collector = await $.ajax({
                url: `http://${url}/singleCollector/${id}`,
                type: 'GET',
                dataType: 'json',

            });

            return collector;
        } catch (error) {
            console.error(error);
        }
    }

    // Get Vendor Products Function 

    async function getVendorProducts(id) {

        let products = [];

        try {

            allProducts = await $.ajax({
                url: `http://${url}/allProducts`,
                type: 'GET',
                dataType: 'json',

            });



            allProducts.forEach(product => {

                if (id == product.user_id) {

                    products.push(product);

                }
            });


            return products;
        } catch (error) {
            console.error(error);
        }
    }



    // Add Product Function

    function addProduct(userid, newTitle, newPrice, newImage, newDescription, newCategory, newSubCategory) {
        $.ajax({
            url: `http://${url}/addProduct`,
            type: 'POST',
            dataType: 'json',
            data: {
                user_id: userid,
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

            }
        });

    }

    // Update Product Function 

    function updateProduct(id) {

        $.ajax({
            url: `http://${url}/updateProduct/${id}`,
            type: 'PATCH',
            dataType: 'json',
            data: {
                user_id: userid,
                name: newTitle,
                price: newPrice,
                image: newImage,
                description: newDescription,
                category: newCategory,
                sub_category: newSubCategory

            },
            success: function (result) {

                alert("Product has been updated");
                artistDashboard();

            },
            error: function () {

            }
        });
    }

    // Delete Product Function 

    function deleteProduct(id) {
        $.ajax({
            url: `http://${url}/deleteProduct/${id}`,
            type: 'DELETE',
            success: function () {


            },
            error: function () {

            } // error                
        }); // ajax

    }

    // Login Function 

    function login(userType) {

        let email = $('#email').val();
        let password = $("#password").val();
        let userTypeString = userType;

        if (email == '' || password == '') {
            alert('Please enter all details');
        } else {
            $.ajax({
                url: `http://${url}/login${userType}`,
                type: 'POST',
                data: {
                    email: email,
                    password: password
                },
                success: function (user) {


                    if (user == 'User not found. Please register') {
                        alert('User not found. Please Register');
                    } else if (user == 'This password does not match. Please try again') {
                        alert('Please try with correct details');
                        $('#email').val('');
                        $('#password').val('');
                    } else {
                        sessionStorage.setItem('userID', user['_id']);
                        sessionStorage.setItem('name', user['name']);
                        sessionStorage.setItem('artistname', user['artistname']);
                        sessionStorage.setItem('userType', `${userTypeString}`);



                        if (userType === 'Vendor') {
                            artistDashboard();
                        } if (userType === 'Collector'){
                            collectorDashboard();
                        }
                    }
                },
                error: function () {

                    alert('Unable to login - unable to call api');
                }
            });
        }
    }

    // Register Vendor Function 

    function registerVendor() {


        let firstName = $('#firstName').val();
        let lastName = $('#lastName').val();
        let name = firstName + ' ' + lastName;
        let artistName = $('#artistname').val();
        let email = $('#email').val();
        let password = $('#password').val();
        let bio = $('#bio').val();
        let instagram = $('#instagram').val();



        if (name == '' || email == '' || password == '') {
            alert('Please complete all details in required fields');
        } else {
            $.ajax({
                url: `http://${url}/registerVendor`,
                type: 'POST',
                data: {
                    name: name,
                    email: email,
                    password: password,
                    artistname: artistName,
                    instagram: instagram
                },
                success: function (vendor) {

                    if (vendor != 'This email has already been registered. Please sign in or use a different email') {
                        sessionStorage.setItem('userID', vendor['_id']);
                        sessionStorage.setItem('name', vendor['name']);
                        sessionStorage.setItem('artistname', vendor['artistname']);
                        sessionStorage.setItem('userType', 'Vendor');
                        populateArtistMenu()

                        artistDashboard();
                    } else {
                        alert('This email has already been used to register an account');
                    }

                },
                error: function () {
                    console.error('Cannot call add collector API');
                    alert('Error; Please try again');
                }
            });

        }


    }

    // Register Collector Function

    function registerCollector() {
        let firstName = $('#firstName').val();
        let lastName = $('#lastName').val();


        let name = firstName + ' ' + lastName;
        let email = $('#email').val();
        let password = $('#password').val();

        if (name == '' || email == '' || password == '') {
            alert('Please complete all details in required fields');
        } else {
            $.ajax({
                url: `http://${url}/registerCollector`,
                type: 'POST',
                data: {
                    name: name,
                    email: email,
                    password: password
                },
                success: function (collector) {

                    if (collector != 'This email has already been registered. Please sign in or use a different email') {
                        console.log(collector);
                        console.log(collector._id);
                        sessionStorage.setItem('userID', collector['_id']);
                        sessionStorage.setItem('name', name);
                        sessionStorage.setItem('userType', 'Collector');

                        collectorDashboard();

                    } else {
                        alert('This email has already been used to register an account');
                    }

                },
                error: function () {
                    console.error('Cannot call add collector API');
                }
            });

        }

    }

    // Update Artist Profile 

    function updateArtistProfile(id, newName, newEmail, newPassword, newArtistName, newBio, newInstagram) {

        $.ajax({
            url: `http://${url}/updateVendor/${id}`,
            type: 'PATCH',
            dataType: 'json',
            data: {
                name: newName,
                email: newEmail,
                password: newPassword,
                artistname: newArtistName,
                bio: newBio,
                instagram: newInstagram

            },
            success: async function (result) {
                sessionStorage.setItem('artistname', newArtistName)
               
                artistDashboard();
                let artist =  await getSingleVendor(id)
                console.log(artist.name);

            },
            error: function () {

            }
        });
    }

        // Update Collector Profile 

        function updateCollectorProfile(id, newName, newEmail, newPassword) {

            $.ajax({
                url: `http://${url}/updateUser/${id}`,
                type: 'PATCH',
                dataType: 'json',
                data: {
                    name: newName,
                    email: newEmail,
                    password: newPassword,
    
                },
                success: function (result) {
                    
                    sessionStorage.setItem('name', newName)
                    collectorDashboard();
                },
                error: function () {
    
                }
            });
        }
    

    // Get Comments Function 
    
    async function getComments() {

      

        try {
            let comments = await $.ajax({
                url: `http://${url}/allComments`,
                type: 'GET',
                dataType: 'json',

            });

           
            return comments;
        } catch (error) {
            console.error(error);
        }

    }

    

    function addComment(comment, author, productID){
        $.ajax({
            url: `http://${url}/createComment`,
            type: 'POST',
            data: {
                text: comment,
                author: author,
                product_id: productID,
            
            },
            success: function(comment){
             
              
            },
            error: function(){
                console.error('error');
            }
        })
    }



    // ---------- POPULATE DOM FUNCTIONS ---------------


    function populateHomePage(){
        let contentContainer = $('#contentContainer');

        contentContainer.html(`
        <div class="info-container">
      <h5>Welcome to the aesthete digital marketplace.</h5>
      <p>This space serves as a platform for independent artists and creatives from Aotearoa, New Zealand.</p>
    </div>
    <div class="image-container" id="imageContainerHome"></div >
        `);

        populateHomeImages()

    }

    // Populate Artist Menu Function 

    async function populateArtistMenu() {

        let vendors = await getAllVendors();

        vendors.forEach(vendor => {
            let vendorName = vendor.artistname;
            let artistList = $('#artistList');
            let artistListMobile = $('#artistListMobile');

            artistList.append(`<li class="artist-link vendor-link" data-vendorID='${vendor._id}'>${vendorName}</li>`);
            artistListMobile.append(`<li class="artist-link vendor-link" data-vendorID='${vendor._id}'>${vendorName}</li>`);

        });
        openArtistPage();



    }

    // Open Artist Page Function 

    function openArtistPage() {

        let artistLinks = document.querySelectorAll('.vendor-link');
        let links = Array.from(artistLinks);
        let screenWidth = $(window).width();
        let offcanvas = $("#offCanvasRight");
        let background = $('#backgroundOverlay');


        links.forEach(link => {
            link.addEventListener('click', () => {
                let vendorID = link.dataset.vendorid;

                if (screenWidth <= 425){

                    populateArtistPage(vendorID);
                    offcanvas.css('left', '130vw');
                    offcanvas.addClass('closed');
        
                    offcanvas.removeClass('open');
                    background.css('animation', 'blurOut .5s linear');
                    background.addClass('hidden');
                } else {
                    populateArtistPage(vendorID);
                }


                
            });

        });


    }

    // Populate Artist Page Function 

    async function populateArtistPage(id) {
        let products = await getVendorProducts(id);
        let vendor = await getSingleVendor(id);
        let contentContainer = $('#contentContainer');

        contentContainer.html(`

        <div class="listing-info-container">
 
        <div class="listing-info">
        
         <h1 class="listing-title">${vendor.artistname}</h1>
     
         <p class="listing-bio">${vendor.bio}</p>
         <h5 ><a href="${vendor.instagram}">Instagram</a></h5>
         
        </div>
        </div>

        <div class="image-container" id="imageContainer"></div>

        </div>


        
        
        `);

       populateImageContainer(vendor._id);
       setTimeout(()=>{
        openProductPageImageContainer()
    }, 2000)

    }

    // Populate Category Page Function

    async function populateCategory(category) {
        let products = await getAllProducts();
        let contentContainer = $('#contentContainer');
        
        contentContainer.html('');

        contentContainer.append(`
        <div class="listing-container mt-5" id="listingContainer">
              
    `);

        products.forEach(product => {
           
            if (category === product.category) {

                populateSingleListing(product);
            }
        });

        setTimeout(()=>{
            openProductPage();
        }, 2000)

    }

    // Populate SubCategory Function 

    async function populateSubCategory(subcategory) {
        

        let products = await getAllProducts();
        let contentContainer = $('#contentContainer');
        
        contentContainer.html('');

        contentContainer.append(`
        <div class="listing-container mt-5" id="listingContainer">
              
    `);

        products.forEach(product => {
            if (subcategory === product.sub_category) {

                populateSingleListing(product);
            }
        });

        setTimeout(()=>{
            openProductPage();
        }, 2000)

    }

    // Populate Single Listing Function 

    async function populateSingleListing(product) {

        let artist = await getSingleVendor(product.user_id);
        
    let listingContainer = $('#listingContainer');

    listingContainer.append(`
    <div class="shopall-listing" data-productid = "${product._id}" >
        <div class="shopall-listing-image" >
        <div class="image-overlay-listing"></div>
        <img src="${product.image}" alt="${product.name}">
        </div>
        <div class="listing-heading">
        <h6>${product.name}</h6>
        <h6>${artist.name}</h6>
        </div>
        </div>
        </div>
    `);




    }

    // Populate Shop All Function 

    async function populateShopAll() {
        let productsFromDb = await getAllProducts();
        let contentContainer = $('#contentContainer');
        let products = productsFromDb.sort();
        
        contentContainer.html('');

        contentContainer.append(`
        <div class="listing-container mt-5" id="listingContainer">
              
    `);

     products.forEach(product => {
            populateSingleListing(product);
        });
        setTimeout(()=>{
            openProductPage();
        }, 2000)


    }

    // Open Product Page Function 

    function openProductPage() {
        let listings = document.querySelectorAll(".shopall-listing");
        let allListings = Array.from(listings);

        allListings.forEach((listing) => {
            listing.addEventListener('click', () => {
                let productID = listing.dataset.productid;
                populateProductPage(productID);
            });

        });
    }
    function openProductPageImageContainer() {
        let listings = document.querySelectorAll(".listing-image");
        let allListings = Array.from(listings);
  

        allListings.forEach((listing) => {
            listing.addEventListener('click', () => {
                let productID = listing.dataset.productid;


                populateProductPage(productID);
            });

        });
    }

    // Populate Product Page Function 

    async function populateProductPage(productID) {
        let product = await getSingleProduct(productID)
        let artist = await getSingleVendor(product.user_id)
        
        let contentContainer = $('#contentContainer');
        contentContainer.html(' ');

        contentContainer.html(`

        
    <div class="listing-info-container" data-productid ="${productID}" id="productPage">
    <div class="listing-hero-image">

      <img src="${product.image}" alt="">
    </div>
    <div class="listing-info">

      <h1 class="listing-title">${product.name}</h1>
      <h5 class="artist-name" id="artistName">${artist.name}</h5>
      <p class="listing-bio">${product.description}</p>
      <h4 class="price">$${product.price}</h4>
      <div class="buttons-container">
        <button class="submit-button" id="reviewBtn">review</button>
        <button class="submit-button" id="orderBtn">order</button>
      </div>
    </div>

  </div>
  <div class="image-container" id="imageContainer"></div>

    <div class="comments-container" id="commentsContainer"></div>

    <div class="enquire-container" id="enquireContainer"></div>

  </div>

        
        `)

        populateImageContainer(artist._id)
        setTimeout(()=>{
            openProductPageImageContainer()
        }, 2000)

     

         // Review Button
         
    $("#reviewBtn").click(function () {
        slideUp($("#commentsContainer"));
        setTimeout(() => {
            populateCommentContainer(productID)
        }, 1500);

    });

    // Order Button
    
    $("#orderBtn").click(function () {
        slideUp($("#enquireContainer"));
        setTimeout(populateEnquireForm, 1500);


    });

    $('#artistName').click(function(){
        populateArtistPage(artist._id)
    })

    }
    
    // Populate Image Container Function

    async function populateImageContainer(artistID){
        let products = await getVendorProducts(artistID);
        let imageContainer = $("#imageContainer");
        let screenWidth = $(window).width();


        products.forEach(product => {
            imageContainer.append(
                `
                <div class="listing-image" data-productid = "${product._id}">
        <div class="image-overlay"></div>
        <img src="${product.image}" alt="">
      </div>`
            );
        });

        if( screenWidth > 425){
            imageContainer.on('wheel', function(e){

                e.preventDefault();
                $(this).scrollLeft($(this).scrollLeft() + e.originalEvent.deltaY);
             
             });
        }
        
    }

    //  Populate Home Images Function 

    async function populateHomeImages() {
        let products = await getAllProducts();
        let imageContainer = $("#imageContainerHome");
        let screenWidth = $(window).width();


        products.forEach(product => {
            imageContainer.append(
                `
                <div class="listing-image" data-productid = "${product._id}">
        <div class="image-overlay"></div>
        <img src="${product.image}" alt="">
      </div>`
            );
        });

        if( screenWidth > 425){
            imageContainer.on('wheel', function(e){

                e.preventDefault();
                $(this).scrollLeft($(this).scrollLeft() + e.originalEvent.deltaY);
             
             });
        }

       
        setTimeout(()=>{
            openProductPageImageContainer()
        }, 2000)

        

    }

    // Populate Enquire Form Function 

    function populateEnquireForm() {

        let enquireContainer = $("#enquireContainer");


        enquireContainer.html(`
        <i class="fa-solid fa-xmark" id="closeEnquire"></i>
        <input type="text" placeholder="first name" name="" id="enquiryFirstName">
        <input type="text" name="" placeholder="last name" id="enquiryLastName">
        <input type="email" placeholder="email" name="" id="enquiryEmail">
        <textarea name="" placeholder="message..." id="" cols="30" rows="10" id="enquiryMessage"></textarea>
        <button class="submit-button" id="enquireSubmit">submit</button>
        `);

        // Close Enquire
        $('#closeEnquire').click(function () {
            slideDown($("#enquireContainer"));
        });

        // Submit Enquiry
        $('#enquireSubmit').click(function () {
            slideDown($("#enquireContainer"));

        });
    }

    // Populate Comment Container Function 

    async function populateCommentContainer(productID) {
        let commentContainer = $("#commentsContainer");

        commentContainer.html(`
        <i class="fa-solid fa-xmark" id="closeComments"></i>
        <div class="all-comments" id="allCommentsContainer">
      </div>
      <div class="comment-input-container">
        <textarea placeholder="add a comment..." id='commentInput'></textarea>
        <button class="submit-button" id="commentSubmit">submit</button>

      </div> 

        `);
        $("#closeComments").click(function () {
            slideDown($("#commentsContainer"));
        });

        $('#commentSubmit').click(function () {
            let comment = $('#commentInput').val();
            let author = sessionStorage.getItem('name');
            
            // let productID = '642c9e70fc5019d6c3d932c9';
            
            addComment(comment, author, productID)
            reloadComments(productID)
            $('#commentInput').val('');

        });

       
        reloadComments(productID)
       
    }

    async function reloadComments(productID){
        let allCommentsContainer = $("#allCommentsContainer");
        let comments =  await getComments(productID);
        allCommentsContainer.html('')

        comments.forEach(comment => {

            if(comment.product_id === productID ){

                
                
                let date = comment.time;
                let dateObject = new Date(date);
                let hour = dateObject.getHours();
                let minutes = dateObject.getMinutes()
                let day = dateObject.getDate();
                let month = dateObject.getMonth();
    
                
                let year = dateObject.getFullYear();
                let formattedDate = `${day}/${month}/${year} ${hour}:${minutes}`
    
    
                allCommentsContainer.append(`
            <div class="comment">
            <p class="username">${comment.author}</p>
            <p class="date">${formattedDate}</p>
            <p class="comment-content">${comment.text}</p>
    
        </div>
            `)


            } 

          
        
    })

    }


    // Off Canvas Left Open / Close Function 

    function offCanvasLeft() {

        let offcanvas = $("#offCanvasLeft");
        let background = $('#backgroundOverlay');
        let close = $('#closeOffcanvasLeft');
        let screenWidth = $(window).width();


        if (offcanvas.hasClass('closed')) {

            offcanvas.css('left', '0vw');
            offcanvas.removeClass('closed');
            background.css('animation', 'blurIn .5s linear');
            background.removeClass('hidden');



            background.click(function () {
                offcanvas.css('left', '-40vw');
                offcanvas.addClass('closed');
                background.css('animation', 'blurOut .5s linear');
                offcanvas.removeClass('open');
                background.addClass('hidden');
            });

            // Render the Artist / Collector Register and Login options on click of the hamburger menu

            if (sessionStorage.getItem('userType') === "Vendor") artistDashboard();
            else if (sessionStorage.getItem('userType') === "Collector") collectorDashboard();
            else loggedOutDashboard();

            // Close Off Canvas
            close.click(function () {
                if (screenWidth <= 425) {
                    offcanvas.css('left', '-100vw');
                } else {
                    offcanvas.css('left', '-40vw');
                }
                offcanvas.addClass('closed');
                background.css('animation', 'blurOut .5s linear');
                offcanvas.removeClass('open');
                background.addClass('hidden');
                // clear out the off canvas extension container 
                let clearAfterCreate = document.getElementById('offCanvasContentContainerExt');
                clearAfterCreate.innerHTML = '';

            });


        }

    }

    // Logged Out Dashboard Function 

    function loggedOutDashboard() {

        // Render the Artist / Collector register and login options on click of the hamburger menu
        let artistCollectorOption = document.getElementById('offCanvasContentContainer');

        artistCollectorOption.innerHTML = `
            <div class="accordion-item text-center mt-5">
                <button class="collapsed form-buttons" type="button" data-bs-toggle="collapse"
                    data-bs-target="#flush-collapseOne" aria-expanded="false" aria-controls="flush-collapseOne"
                    style="font-family: 'GutenbergA'; font-size: 24px;"> Artist
                </button>
                <div id="flush-collapseOne" class="accordion-collapse collapse" aria-labelledby="flush-headingOne"
                    data-bs-parent="#artistCollectorOptions">
                    <div class="accordion-body">
                    <button class="form-buttons" id="artistRegister">Register</button><br>
                    <button class="form-buttons" id="artistLogin">Login</button>
                    </div>
                </div>
                </div>
                <div class="accordion-item text-center mt-5">
                <button class="collapsed form-buttons" type="button" data-bs-toggle="collapse"
                    data-bs-target="#flush-collapseTwo" aria-expanded="false" aria-controls="flush-collapseTwo"
                    style="font-family: 'GutenbergA'; font-size: 24px;"> Collector
                </button>
                <div id="flush-collapseTwo" class="accordion-collapse collapse" aria-labelledby="flush-headingTwo"
                    data-bs-parent="#artistCollectorOptions">
                    <div class="accordion-body">
                    <button class="form-buttons" id="collectorRegister">Register</button><br>
                    <button class="form-buttons" id="collectorLogin">Login</button>
                    </div>
                </div>
            </div> `;

        $("#artistRegister").click(function () {

            artistRegisterForm();
        });

        $("#artistLogin").click(function () {
            artistLoginForm();
        });

        $("#collectorRegister").click(function () {
            collectorRegisterForm();
        });

        $("#collectorLogin").click(function () {
            collectorLoginForm();
        });

    }

    // Off Canvas Right Open / Close Function

    function offCanvasRight() {

        let offcanvas = $("#offCanvasRight");
        let background = $('#backgroundOverlay');
        let close = $('#closeOffcanvasRight');

        if (offcanvas.hasClass('closed')) {

            offcanvas.css('left', '0vw');
            offcanvas.removeClass('closed');
            background.css('animation', 'blurIn .5s linear');
            background.removeClass('hidden');

        }

        // Close Off Canvas

        close.click(function () {
            offcanvas.css('left', '130vw');
            offcanvas.addClass('closed');

            offcanvas.removeClass('open');
            background.css('animation', 'blurOut .5s linear');
            background.addClass('hidden');


        });


    }

    // Slide Up Function 

    function slideUp(element) {
        element.css('border-top', '1px solid black');
        element.css('animation', 'slideUp 1.5s ease');
        element.css('height', '55vh');



    }

    // Slide Down Function 

    function slideDown(element) {

        element.css('border-top', 'none');
        element.css('animation', 'slideDown 1.5s ease');
        element.css('height', '0vh');
        element.html('');
    }

    // Artist Register Form Function 

    function artistRegisterForm() {
        let artistRegister = document.getElementById('offCanvasContentContainer');
        artistRegister.innerHTML = `
        <h1 class="form-options pt-5">Artist Registration</h1> 
        <div class="w-100 text-center pt-2"> 
            <input class="form-buttons" type="text" id="firstName" name="firstName" placeholder="first name"> 
            <input class="form-buttons" type="text" id="lastName" name="lastName" placeholder="last name"> 
            <input class="form-buttons" type="email" id="email" name="email" placeholder="email"> 
            <input class="form-buttons" type="password" id="password" name="password" placeholder="password"> 
            <input class="form-buttons" type="text" id="artistname" name="artistName" placeholder="artist name"> 
            <input class="form-buttons" type="text" id="instagram" name="instagram" placeholder="instagram"><br> 
            <button class="submit-button mt-5" id="registerArtist">submit</button> 
        </div>
`;

        $("#registerArtist").click(function () {
            registerVendor();


        });

    }

    // Artist Login Form Function 

    function artistLoginForm() {
        let artistLogin = document.getElementById('offCanvasContentContainer');
        artistLogin.innerHTML = `
        <h1 class="form-options pt-5">Artist Login</h1> 
        <div class="w-100 text-center pt-2"> 
          <input class="form-buttons" type="text" id="email" name="email" placeholder="email"> 
          <input class="form-buttons" type="password" id="password" name="password" placeholder="password"><br> 
          <button class="submit-button mt-5" id="loginArtist">login</button> 
        </div>
        `;

        $("#loginArtist").click(function () {
            login('Vendor');
        });

    }

    // Collector Register Form Function 

    function collectorRegisterForm() {
        let collectorRegister = document.getElementById('offCanvasContentContainer');
        collectorRegister.innerHTML = `
        <h1 class="form-options pt-5">Collector Registration</h1> 
        <div class="w-100 text-center pt-2"> 
          <input class="form-buttons" type="text" id="firstName" name="firstName" placeholder="first name"> 
          <input class="form-buttons" type="text" id="lastName" name="lastName" placeholder="last name"> 
          <input class="form-buttons" type="email" id="email" name="email" placeholder="email"> 
          <input class="form-buttons" type="password" id="password" name="password" placeholder="password"><br>
          <button class="submit-button mt-5" id="registerCollector">submit</button> 
        </div> `;


        $("#registerCollector").click(function () {
            registerCollector();
        });
    }

    // Collector Login Form Function 

    function collectorLoginForm() {
        let collectorLogin = document.getElementById('offCanvasContentContainer');
        collectorLogin.innerHTML = `
        <h1 class="form-options pt-5">Collector Login</h1> 
        <div class="w-100 text-center pt-2"> 
          <input class="form-buttons" type="text" id="email" name="email" placeholder="email"> 
          <input class="form-buttons" type="password" id="password" name="password" placeholder="password"><br>
          <button class="submit-button mt-5" id="loginCollector">login</button> 
        </div>

          `;
        $("#loginCollector").click(function () {
            login('Collector');
        });



    }

    // Collector Dashboard Function 

    function collectorDashboard() {

        let collectorDashboard = document.getElementById('offCanvasContentContainer');
        collectorDashboard.innerHTML = `
            <h1 class="form-options mt-5">${sessionStorage.getItem('name')}</h1> 
            
            <div class="w-100 text-center pt-2"> 
              <button id="editCollectorProfile" class="form-buttons">edit profile</button> 
              <button id="logOut" class="form-buttons">log out</button> 
            </div>

          `;

       
            // Edit Collector Profile
            $("#editCollectorProfile").click(function () {

                editCollectorProfile();
            });

            // Logout 
            $("#logOut").click(function () {
                logout();
            });
        };
    

    // Artist Dashboard Function 

    function artistDashboard() {
        let artistOptions = document.getElementById('offCanvasContentContainer');
        artistOptions.innerHTML =  '';

        artistOptions.innerHTML = `
            <h1 class="form-options pt-5">${sessionStorage.getItem('artistname')}</h1> 
            <div class="w-100 text-center pt-2"> 
              <button id="editProfile" class="form-buttons">edit profile</button><br> 
              <button id="createListing" class="form-buttons">create listing</button><br> 
              <button id="editListing" class="form-buttons">edit listing</button><br> 
              <button id="deleteListing" class="form-buttons">delete listing</button> 
              <button id="logOut" class="form-buttons">log out</button> 
          
            </div>
            `;
    

    // Edit Profile
    
    $("#editProfile").click(function () {
        editArtistProfile();
    });


        // Create Listing

        $("#createListing").click(function () {
            createListing1();
            createListing2();
            document.getElementById("category").onchange = function () {
                categorySelected = document.getElementById('category').value;
                if (categorySelected == 'accessories') {
                    createListing2Acc();
                } else if (categorySelected == 'art') {
                    createListing2Art();
                } else if (categorySelected == 'garments') {
                    createListing2Gar();
                } else if (categorySelected == 'homewares') {
                    createListing2Home();
                } else if (categorySelected == 'jewellery') {
                    createListing2Jewel();
                } else {
                    alert("Please select a valid sub-category");
                }
            };
        }); 
        // End of create Listing
        

        // Edit Listing 
        
        $("#editListing").click(function () {
            editListing1();

        });
        // end of edit listing

        // Delete Listing
        
        $("#deleteListing").click(function () {
            deleteListing();
        });
        
        // end of Delete listing

        // Logout 
        $("#logOut").click(function () {
            logout();
        });

    }; // End of Artist Dashboard Function


    //  Edit Artist Profile Function 

    async function editArtistProfile() {
        // need to get the artist details from mongo and populate
        // on click of the save button update their details in mongo
        let artist = await getSingleVendor(sessionStorage.getItem('userID'))
        let newName, newEmail, newPassword, newArtistName, newBio, newInstagram;
        let editArtistProfile = document.getElementById('offCanvasContentContainer');
        editArtistProfile.innerHTML =
            `
        <h1 class="form-options pt-5">Edit Profile</h1> 
        <div class="w-100 text-center pt-2"> 
          <input class="form-buttons" type="text" id="editName" name="editName" placeholder="name"> 
          <input class="form-buttons" type="text" id="email" name="email" placeholder="email"> 
          <input class="form-buttons" type="text" id="password" name="password" placeholder="password"> 
          <input class="form-buttons" type="text" id="artistName" name="artistName" placeholder="artist name"> 
          <input class="form-buttons py-5" type="text" id="editBio" name="editBio" placeholder="edit bio"> 
          <input class="form-buttons" type="text" id="editInst" name="editInst" placeholder="edit instagram"><br>
          <button class="submit-button mt-5" id="updateArtistProfile">submit</button> 
        </div>
  
        `;
        $('#updateArtistProfile').click(function (event) {
            newName = $('#editName').val();
            newEmail = $('#email').val();
            newPassword = $('#password').val();
            newArtistName = $('#artistName').val();
            newBio = $('#editBio').val();
            newInstagram = $('#editInst').val();

            if(newName === ''){
                newName = artist.name;
            }
            if(newEmail === '') {
                newEmail = artist.email;
            } 
            if(newPassword === '') {
                newPassword = artist.password;
            } 
            if(newArtistName === '') {
                newArtistName = artist.artistname;
            }
            if(newBio === '') {
                newBio = artist.bio;
             }
              
            if(newInstagram === '') {
                newInstagram = artist.instagram;
            } 

                updateArtistProfile(artist._id, newName, newEmail, newPassword, newArtistName, newBio, newInstagram)
            alert("Your artist profile has been updated");
            
        });

    }


    // Create Listing Function 

    function createListing1() {
        let createListing = document.getElementById('offCanvasContentContainer');
        createListing.innerHTML =
            `
        <h1 class="form-options pt-5">Create Listing</h1> 
        <div class="w-100 text-center pt-2"> 
          <input class="form-buttons" type="text" id="listingName" name="listingName" placeholder="listing name"><br> 
          <select class="form-buttons center-dropdown" id="category" name="category"> 
            <option disabled selected hidden>category</option> 
            <option value="accessories">accessories</option> 
            <option value="art">art</option> 
            <option value="garments">garments</option> 
            <option value="homewares">homewares</option> 
            <option value="jewellery">jewellery</option> 
          </select> 
        </div>`;
    }

    function createListing2() {
        let categorySelected;
        let createListing = document.getElementById('offCanvasContentContainerExt');
        createListing.innerHTML =
            `<div class="w-100 text-center pt-2"> 
          <select class="form-buttons center-dropdown" id="subCategoryNull" name="subCategoryNull"> 
            <option disabled selected hidden>sub-category</option>
            <option value="empty">please select a category first</option>
          </select><br> 
          <input class="form-buttons" type="text" id="listingDesc" name="listingDesc" placeholder="listing description"> 
          <input class="form-buttons" type="text" id="listingPrice" name="listingPrice" placeholder="price"> 
          <input class="form-buttons" type="text" id="listingImage" name="listingImage" placeholder="image upload"><br>
          <button class="submit-button mt-5" id="createListingBtn">submit</button> 
        </div>
        `;
        createListingButton();
    }

    function createListing2Acc() {
        let categorySelected;
        let createListing = document.getElementById('offCanvasContentContainerExt');
        createListing.innerHTML =
            `<div class="w-100 text-center pt-2"> 
          <select class="form-buttons center-dropdown" id="subCategory" name="subCategory"> 
            <option disabled selected hidden>sub-category</option>
            <option value="hats">hats</option> 
            <option value="bags">bags</option> 
            <option value="glasses">glasses</option>
          </select><br> 
          <input class="form-buttons" type="text" id="listingDesc" name="listingDesc" placeholder="listing description"> 
          <input class="form-buttons" type="text" id="listingPrice" name="listingPrice" placeholder="price"> 
          <input class="form-buttons" type="text" id="listingImage" name="listingImage" placeholder="image upload"><br>
          <button class="submit-button mt-5" id="createListingBtn">submit</button> 
        
        </div>
        `;
        createListingButton();
    }

    function createListing2Art() {
        let categorySelected;
        let createListing = document.getElementById('offCanvasContentContainerExt');
        createListing.innerHTML =
            `<div class="w-100 text-center pt-2"> 
          <select class="form-buttons center-dropdown" id="subCategory" name="subCategory"> 
            <option disabled selected hidden>sub-category</option>
            <option value="painting">painting</option> 
            <option value="prints">prints</option> 
            <option value="sculpture">sculpture</option> 
            <option value="ceramics">ceramics</option>
          </select><br> 
          <input class="form-buttons" type="text" id="listingDesc" name="listingDesc" placeholder="listing description"> 
          <input class="form-buttons" type="text" id="listingPrice" name="listingPrice" placeholder="price"> 
          <input class="form-buttons" type="text" id="listingImage" name="listingImage" placeholder="image upload"><br>
          <button class="submit-button mt-5" id="createListingBtn">submit</button> 
        
        </div>
        `;
        createListingButton();
    }

    function createListing2Gar() {
        let categorySelected;
        let createListing = document.getElementById('offCanvasContentContainerExt');
        createListing.innerHTML =
            `<div class="w-100 text-center pt-2"> 
          <select class="form-buttons center-dropdown" id="subCategory" name="subCategory"> 
            <option disabled selected hidden>sub-category</option>
            <option value="dresses">dresses</option> 
            <option value="tops">tops</option> 
            <option value="bottoms">bottoms</option> 
            <option value="intimates">intimates</option> 
            <option value="outerwear">outerwear</option>
          </select><br> 
          <input class="form-buttons" type="text" id="listingDesc" name="listingDesc" placeholder="listing description"> 
          <input class="form-buttons" type="text" id="listingPrice" name="listingPrice" placeholder="price"> 
          <input class="form-buttons" type="text" id="listingImage" name="listingImage" placeholder="image upload"><br>
          <button class="submit-button mt-5" id="createListingBtn">submit</button> 
        
        </div>
        `;
        createListingButton();
    }

    function createListing2Home() {
        let categorySelected;
        let createListing = document.getElementById('offCanvasContentContainerExt');
        createListing.innerHTML =
            `<div class="w-100 text-center pt-2"> 
          <select class="form-buttons center-dropdown" id="subCategory" name="subCategory"> 
            <option disabled selected hidden>sub-category</option>
            <option value="glass">glass</option> 
            <option value="linen">linen</option> 
            <option value="softFurnishings">soft furnishings</option> 
            <option value="decor">decor</option> 
            <option value="rugs">rugs</option> 
            <option value="kitchenDining">kitchen & dining</option>
          </select><br> 
          <input class="form-buttons" type="text" id="listingDesc" name="listingDesc" placeholder="listing description"> 
          <input class="form-buttons" type="text" id="listingPrice" name="listingPrice" placeholder="price"> 
          <input class="form-buttons" type="text" id="listingImage" name="listingImage" placeholder="image upload"><br>
          <button class="submit-button mt-5" id="createListingBtn">submit</button> 
        
        </div>
        `;
        createListingButton();
    }

    function createListing2Jewel() {
        let categorySelected;
        let createListing = document.getElementById('offCanvasContentContainerExt');
        createListing.innerHTML =

            `<div class="w-100 text-center pt-2"> 
          <select class="form-buttons center-dropdown" id="subCategoryArt" name="subCategoryAcc"> 
            <option disabled selected hidden>sub-category</option>
            <option value="earrings">earrings</option> 
            <option value="necklaces">necklaces</option> 
            <option value="bracelets">bracelets</option> 
            <option value="rings">rings</option> 
          </select><br> 
          <input class="form-buttons" type="text" id="listingDesc" name="listingDesc" placeholder="listing description"> 
          <input class="form-buttons" type="text" id="listingPrice" name="listingPrice" placeholder="price"> 
          <input class="form-buttons" type="text" id="listingImage" name="listingImage" placeholder="image upload"><br>
          <button class="submit-button mt-5" id="createListingBtn">submit</button> 
        
        </div>
        `;
        createListingButton();

    }

    function createListingButton() {

        $('#createListingBtn').click(function (event) {
            event.preventDefault();
            userid = sessionStorage.getItem('userID');
            newTitle = $('#listingName').val(); 
            newCategory = $('#category').val();
            newSubCategory = $('#subCategory').val();
            newDescription = $('#listingDesc').val();
            newPrice = $('#listingPrice').val();
            newImage = $('#listingImage').val();

            if (newTitle == '' || newPrice == '' || newImage == '') {
                alert('Please enter ALL listing details');
            } else {
                let createListing = document.getElementById('offCanvasContentContainerExt');
                createListing.innerHTML = '';
                artistDashboard()
                alert('New listing added');

                addProduct(userid, newTitle, newPrice, newImage, newDescription, newCategory, newSubCategory);
                
            }
        });
    }


    // Edit Listing Function 

    async function editListing1() {
        id = sessionStorage.getItem('userID');
        let products = await getVendorProducts(id);

        let editListing = document.getElementById('offCanvasContentContainer');
        editListing.innerHTML =
            `
        <h1 class="form-options pt-5">Edit Listing</h1> 
        <div class="w-100 text-center pt-2"> 
           <select class="form-buttons center-dropdown" id="listings" name="listings">
            <option disabled selected hidden>select listing</option> 

          </select><br> 
          <input class="form-buttons" type="text" id="listingName" name="listingName" placeholder="listing name"><br> 
          <select class="form-buttons center-dropdown" id="category" name="category"> 
            <option disabled selected hidden>category</option> 
            <option value="accessories">accessories</option> 
            <option value="art">art</option> 
            <option value="garments">garments</option> 
            <option value="homewares">homewares</option> 
            <option value="jewellery">jewellery</option> 
          </select> 
        </div>`;

        let categorySelected;
        editListing = document.getElementById('offCanvasContentContainerExt');
        editListing.innerHTML =
        `<div class="w-100 text-center pt-2"> 
          <select class="form-buttons center-dropdown" id="subCategoryNull" name="subCategoryNull"> 
            <option disabled selected hidden>sub-category</option>
            <option value="empty">please select a category first</option>
          </select><br> 
          <input class="form-buttons" type="text" id="listingDesc" name="listingDesc" placeholder="listing description"> 
          <input class="form-buttons" type="text" id="listingPrice" name="listingPrice" placeholder="price"> 
          <input class="form-buttons" type="text" id="listingImage" name="listingImage" placeholder="image upload"><br>
          <button class="submit-button mt-5" id="editListingBtn">submit</button> 
        </div>
        `;

        // Populate the vendor's listing options
        let listingsDropdown = $('#listings');
        products.forEach(product => {
            listingsDropdown.append(`
            <option value="${product._id}">${product.name}</option> 
            `)
        })
        
        // on selection of a product to edit, 
        listingsDropdown.change(async function (event) {
            let id = $('#listings :selected').val();
            // get product details from getSingleProduct()
            let product = await getSingleProduct(id);
            globalProduct = product;
            editListingButton(product);

        });
        
        document.getElementById("category").onchange = function() {
            categorySelected = document.getElementById('category').value;
            if (categorySelected == 'accessories') {
                editListing2Acc(globalProduct);
            } else if (categorySelected == 'art') {
                editListing2Art(globalProduct);
            } else if (categorySelected == 'garments') {
                editListing2Gar(globalProduct);
            } else if (categorySelected == 'homewares') {
                editListing2Home(globalProduct);
            } else if (categorySelected == 'jewellery') {
                editListing2Jewel(globalProduct);
            } else {
                alert("Please select a valid sub-category");
            }
        };
   
    }
    

    function editListing2Acc(product) {
        let categorySelected;
        let editListing = document.getElementById('offCanvasContentContainerExt');
        editListing.innerHTML =
        `<div class="w-100 text-center pt-2"> 
          <select class="form-buttons center-dropdown" id="subCategory" name="subCategory"> 
            <option disabled selected hidden>sub-category</option>
            <option value="hats">hats</option> 
            <option value="bags">bags</option> 
            <option value="glasses">glasses</option>
          </select><br> 
          <input class="form-buttons" type="text" id="listingDesc" name="listingDesc" placeholder="listing description"> 
          <input class="form-buttons" type="text" id="listingPrice" name="listingPrice" placeholder="price"> 
          <input class="form-buttons" type="text" id="listingImage" name="listingImage" placeholder="image upload"><br>
          <button class="submit-button mt-5" id="editListingBtn">submit</button> 
        
        </div>
        `;
        editListingButton(product);
    }

    function editListing2Art(product) {
        let categorySelected;
        let editListing = document.getElementById('offCanvasContentContainerExt');
        editListing.innerHTML =
        `<div class="w-100 text-center pt-2"> 
          <select class="form-buttons center-dropdown" id="subCategory" name="subCategory"> 
            <option disabled selected hidden>sub-category</option>
            <option value="painting">painting</option> 
            <option value="prints">prints</option> 
            <option value="sculpture">sculpture</option> 
            <option value="ceramics">ceramics</option>
          </select><br> 
          <input class="form-buttons" type="text" id="listingDesc" name="listingDesc" placeholder="listing description"> 
          <input class="form-buttons" type="text" id="listingPrice" name="listingPrice" placeholder="price"> 
          <input class="form-buttons" type="text" id="listingImage" name="listingImage" placeholder="image upload"><br>
          <button class="submit-button mt-5" id="editListingBtn">submit</button> 
        
        </div>
        `;
        editListingButton(product);
    }

    function editListing2Gar(product) {
        let categorySelected;
        let editListing = document.getElementById('offCanvasContentContainerExt');
        editListing.innerHTML =
        `<div class="w-100 text-center pt-2"> 
          <select class="form-buttons center-dropdown" id="subCategory" name="subCategory"> 
            <option disabled selected hidden>sub-category</option>
            <option value="dresses">dresses</option> 
            <option value="tops">tops</option> 
            <option value="bottoms">bottoms</option> 
            <option value="intimates">intimates</option> 
            <option value="outerwear">outerwear</option>
          </select><br> 
          <input class="form-buttons" type="text" id="listingDesc" name="listingDesc" placeholder="listing description"> 
          <input class="form-buttons" type="text" id="listingPrice" name="listingPrice" placeholder="price"> 
          <input class="form-buttons" type="text" id="listingImage" name="listingImage" placeholder="image upload"><br>
          <button class="submit-button mt-5" id="editListingBtn">submit</button> 
        
        </div>
        `;
        editListingButton(product);
    }

    function editListing2Home(product) {
        let categorySelected;
        let editListing = document.getElementById('offCanvasContentContainerExt');
        editListing.innerHTML =
        `<div class="w-100 text-center pt-2"> 
          <select class="form-buttons center-dropdown" id="subCategory" name="subCategory"> 
            <option disabled selected hidden>sub-category</option>
            <option value="glass">glass</option> 
            <option value="linen">linen</option> 
            <option value="softFurnishings">soft furnishings</option> 
            <option value="decor">decor</option> 
            <option value="rugs">rugs</option> 
            <option value="kitchenDining">kitchen & dining</option>
          </select><br> 
          <input class="form-buttons" type="text" id="listingDesc" name="listingDesc" placeholder="listing description"> 
          <input class="form-buttons" type="text" id="listingPrice" name="listingPrice" placeholder="price"> 
          <input class="form-buttons" type="text" id="listingImage" name="listingImage" placeholder="image upload"><br>
          <button class="submit-button mt-5" id="editListingBtn">submit</button> 
        
        </div>
        `;
        editListingButton(product);
    }

    function editListing2Jewel(product) {
        let categorySelected;
        let editListing = document.getElementById('offCanvasContentContainerExt');
        editListing.innerHTML =
        `<div class="w-100 text-center pt-2"> 
          <select class="form-buttons center-dropdown" id="subCategory" name="subCategory"> 
            <option disabled selected hidden>sub-category</option>
            <option value="earrings">earrings</option> 
            <option value="necklaces">necklaces</option> 
            <option value="bracelets">bracelets</option> 
            <option value="rings">rings</option> 
          </select><br> 
          <input class="form-buttons" type="text" id="listingDesc" name="listingDesc" placeholder="listing description"> 
          <input class="form-buttons" type="text" id="listingPrice" name="listingPrice" placeholder="price"> 
          <input class="form-buttons" type="text" id="listingImage" name="listingImage" placeholder="image upload"><br>
          <button class="submit-button mt-5" id="editListingBtn">submit</button> 
        
        </div>
        `;
        editListingButton(product);

    }

    function editListingButton(product) {
        $('#editListingBtn').click(function (event, product) {
            event.preventDefault();

            let editTitle = $('#listingName').val(); 
            if (editTitle !== "") {
                globalProduct.title = editTitle;
                
            } 

            let editCategory = $('#category').val();
            if (editCategory !== null) {
                globalProduct.category = editCategory;
            } 

            let editSubCategory = $('#subCategory').val();
            if (editSubCategory !== null) {
                globalProduct.sub_category = editSubCategory;
            } 

            let editDescription = $('#listingDesc').val();
            if (editDescription !== "") {
                globalProduct.description = editDescription;
            } 

            let editPrice = $('#listingPrice').val();
            if (editPrice !== "") {
                globalProduct.price = editPrice;
            } 

            let editImage = $('#listingImage').val();
            if (editImage !== "") {
                globalProduct.image = editImage;
            } 

            // call ajax update product

            id = globalProduct._id;
            userid = globalProduct.user_id;
            newTitle = globalProduct.title;
            newPrice = globalProduct.price;
            newImage = globalProduct.image;
            newDescription = globalProduct.description;
            newCategory = globalProduct.category;
            newSubCategory = globalProduct.sub_category;

            let editListing = document.getElementById('offCanvasContentContainerExt');
            updateProduct(id); 
            editListing.innerHTML = '';
            artistDashboard();


        });
    }
    // End of edit / update listing

    // Delete Listing Function 

    async function deleteListing() {
        id = sessionStorage.getItem('userID');
        let products = await getVendorProducts(id);

        let deleteListing = document.getElementById('offCanvasContentContainer');
        deleteListing.innerHTML = `
        <h1 class="form-options pt-5">Delete Listing</h1> 
        <div class="w-100 text-center pt-5 pb-5">
          <select class="form-buttons center-dropdown" id="listings" name="listings">
            <option disabled selected hidden>select listing</option>
          </select><br> 
        <div> 
        <label class="container-cb mb-5" for="confirmListingDelete"> * please select to confirm you wish to delete this listing 
          <input type="checkbox" id="confirmListingDelete" name="confirmListingDelete"> 
          <span class="checkmark"></span> 
        </label> 
        </div> 
          <button class="submit-button mt-5" id="deleteListingBtn">submit</button> 
        </div>
  
        `;

        // Populate the vendor's listing options

        let listingsDropdown = $('#listings');
        products.forEach(product => {
            listingsDropdown.append(`
            <option value="${product._id}">${product.name}</option> 
            `)
        })

        // on slection of a product to delete, 
        listingsDropdown.change(function (event) {
            let id = $('#listings :selected').val();
            // Delete Listing Button
            $('#deleteListingBtn').click(function (event) {
                let checkbox = document.getElementById('confirmListingDelete').checked;
                if (checkbox) {
                    // call delete function
                    deleteProduct(id);
                    artistDashboard()
                    alert("delete successful");
                } else {
                    alert("please check the confirm delete box");
                }
            });

        });
    }

    // Logout Function

    function logout() {
        sessionStorage.removeItem('name');
        sessionStorage.removeItem('userID');
        sessionStorage.removeItem('userType');

        loggedOutDashboard();
    }

    // Edit Collector Profile Function 

   async function editCollectorProfile() {
        let collector = await getSingleCollector(sessionStorage.getItem('userID'));
       
        let editCollectorProfile = document.getElementById('offCanvasContentContainer');
        editCollectorProfile.innerHTML = `
        <h1 class="form-options mt-5">Edit Profile</h1> 
        <div class="w-100 text-center mt-5"> 
          <input class="form-buttons" type="text" id="name" name="name" placeholder="name"> 
          <input class="form-buttons" type="text" id="email" name="email" placeholder="email"> 
          <input class="form-buttons mb-5" type="password" id="password" name="password" placeholder="password"><br>
          <button class="submit-button mt-5" id="updateCollectorProfile">submit</button> 
        </div>
    
        `;
        $('#updateCollectorProfile').click(function (event) {
          
            console.log(collector);
            newName = $('#name').val();
            newEmail = $('#email').val();
            newPassword = $('#password').val();
            
            if(newName === ''){
                newName = collector.name;
            } 
            if(newEmail === ''){
                newEmail = collector.email;
            } 
            if(newPassword === '') {
                newPassword = collector.password;
            } 
            console.log(newName);
            console.log(newEmail);
            console.log(newPassword);

            
            updateCollectorProfile(collector._id, newName, newEmail, newPassword)

        });

    }



    // ---------------------------------- CLICK EVENTS ----------------------------------------

    // Hamburger / Bar Icon

    $("#hamburgerIcon").click(function () {
        offCanvasLeft();
    });

    // Hamburger / Bar Icon Mobile 
    $("#hamburgerIconMobile").click(function () {
        offCanvasLeft();
    });

   

    // Mobile Off Canvas Right Open 
    $("#mobileOffcanvasOpen").click(function () {
        offCanvasRight();
    });

    // Shop All Link
    $('#shopAllLink').click(function () {
        populateShopAll();
    });

    // Shop All Link Mobile
    $('#shopAllLinkMobile').click(function () {
        populateShopAll();
    });

    $('#goHome').click(function (){
        populateHomePage()
    })



    // Category Links Function 

    function categoryLinks() {
        let categoryLinks = document.querySelectorAll('.category');
        let categories = Array.from(categoryLinks);
        let screenWidth = $(window).width();
        let offcanvas = $("#offCanvasRight");
        let background = $('#backgroundOverlay');

        categories.forEach(category => {
            

            category.addEventListener("click", function () {
                let name = category.dataset.name;
                if (screenWidth <= 425){
                    populateCategory(name);
                    offcanvas.css('left', '130vw');
                    offcanvas.addClass('closed');
        
                    offcanvas.removeClass('open');
                    background.css('animation', 'blurOut .5s linear');
                    background.addClass('hidden');
                } else{
                    populateCategory(name);
                }
                
            });
        });

    }

    // SubCategory Links Function

    function subcategoryLinks() {
        let subcategoryLinks = document.querySelectorAll('.subcategory');
        let subcategories = Array.from(subcategoryLinks);
        let screenWidth = $(window).width();
        let offcanvas = $("#offCanvasRight");
        let background = $('#backgroundOverlay');


        subcategories.forEach(subcategory => {

            let name = subcategory.dataset.name;


            subcategory.addEventListener("click", function(){

                if (screenWidth <= 425){
                    populateSubCategory(name);
                    offcanvas.css('left', '130vw');
                    offcanvas.addClass('closed');
        
                    offcanvas.removeClass('open');
                    background.css('animation', 'blurOut .5s linear');
                    background.addClass('hidden');
                } else{
                    populateSubCategory(name);
                }
            })
            
            
        });

    }

    // ---------------------------------- END OF CLICK EVENTS ----------------------------------------



    // ---------------------------------- LOADING SCREEN ---------------------------------------------

    setTimeout(() => {
        $("#enterText").css('animation', 'fadeIn 3s ease');
        $("#enterText").css('opacity', '1');
    }, 2000);

    $('#enterText').click(function () {
        $("#loadingScreen").css('animation', 'fadeOut 1.5s ease');
        setTimeout(() => {
            $("#loadingScreen").css('display', 'none');
        }, 1500);



        populateArtistMenu();
        populateHomePage();
        categoryLinks();
        subcategoryLinks();

    });



});




// ---------------------------------- END OF LOADING SCREEN ----------------------------------------






// -------------------------- End of Frontend $(document).ready() 'container' -------------------------------