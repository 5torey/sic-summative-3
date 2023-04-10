/*jshint esversion: 6 */

// ------------- LOADING PAGE ANIMATION -----------------




$(document).ready(function () {

    let url;

    // Get config.json file

    $.ajax({
        url: 'config.json',
        type: 'GET',
        dataType: 'json',
        success: function (configData) {
            console.log(configData.SERVER_URL, configData.SERVER_PORT);
            url = `${configData.SERVER_URL}:${configData.SERVER_PORT}`;

            // getAllProducts();

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

            });

            console.log(products);
            return products;
        } catch (error) {
            console.error(error);
        }

    }

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



    function getSingleProduct(id) {
        $.ajax({
            url: `http://${url}/singleProcuct/${id}`,
            type: 'GET',
            dataType: 'json',

            success: function (product) {

                return product;
            },
            error: function () {
                alert('Unable to get this product');
            }
        });
    }

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

    async function getVendorProducts(id){

        let products = [];

        try {

            allProducts = await $.ajax({
                url: `http://${url}/allProducts`,
                type: 'GET',
                dataType: 'json',

            });


            allProducts.forEach(product => {
               
                if (id == product.user_id){
                   
                    products.push(product);
                } 
            });

            return products;
        } catch (error) {
            console.error(error);
        }
    }


    let newTitle;
    let newCategory;
    let newSubCategory;
    let newDescription;
    let newPrice;
    let newImage; 

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
                console.log("Unable to update product");
            }
        });

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
                console.log("Unable to update product");
            }
        });
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
        
        artistList.append(`<li class="artist-link vendor-link" data-vendorID='${vendor._id}'>${vendorName}</li>`);
        artistListMobile.append(`<li class="artist-link vendor-link" data-vendorID='${vendor._id}>${vendorName}</li>`);

        

        
       });
       openArtistPage();

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
                populateArtistPage(vendorID);
            });
              
            });
       

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

        
        
        `);

        let imageContainer = $('#artistImageContainer');

        products.forEach(product => {
            imageContainer.append(
                `
                <div class="listing-image">
        <div class="image-overlay"></div>
        <img src="${product.image}" alt="">
      </div>`
            );
        });


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
            );
        });

    }

    function populateEnquireForm() {

        console.log('in populate');
        let enquireContainer = $("#enquireContainer");


        enquireContainer.html(`
        <i class="fa-solid fa-xmark" id="closeEnquire"></i>
        <input type="text" placeholder="first name" name="" id="enquiryFirstName">
        <input type="text" name="" placeholder="last name" id="enquiryLastName">
        <input type="email" placeholder="email" name="" id="enquiryEmail">
        <textarea name="" placeholder="message..." id="" cols="30" rows="10" id="enquiryMessage"></textarea>
        <button class="submit-button" id="enquireSubmit">submit</button>
        `);



        $('#closeEnquire').click(function () {
            slideDown($("#enquireContainer"));

        });
        $('#enquireSubmit').click(function () {
            slideDown($("#enquireContainer"));

        });
    }

    function populateCommentContainer() {
        console.log('in populate 2');
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

        `);

        $("#closeComments").click(function () {
            slideDown($("#commentsContainer"));
        });

        $('#commentSubmit').click(function () {


        });
    }

    function submitEnquiry() {

    }

    //    Function to open/close left side off canvas
    function offCanvasLeft() {

        let offcanvas = $("#offCanvasLeft");
        let background = $('#backgroundOverlay');
        let close = $('#closeOffcanvasLeft');
        let screenWidth = $(window).width();


        if (offcanvas.hasClass('closed')) {
            console.log('opening');
            offcanvas.css('left', '0vw');
            offcanvas.removeClass('closed');
            // offcanvas.addClass('open');
            background.css('animation', 'blurIn .5s linear');
            background.removeClass('hidden');


           background.click(function(){
            offcanvas.css('left', '-40vw');
            offcanvas.addClass('closed');
            background.css ('animation', 'blurOut .5s linear');
            offcanvas.removeClass('open');
            background.addClass('hidden');
           });
           
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
            </div>
           `;
            $("#artistRegister").click(function(){
                artistRegisterForm();
            });

            $("#artistLogin").click(function(){
                artistLoginForm();
            });
        
            $("#collectorRegister").click(function(){
                collectorRegisterForm();
            });
        
            $("#collectorLogin").click(function(){
                collectorLoginForm();
            });
        
        
        }

        // close off canvas
        close.click(function(){
            if (screenWidth <= 425){
                offcanvas.css('left', '-100vw');
            } else {
                offcanvas.css('left', '-40vw');
            }
            offcanvas.addClass('closed');
            background.css('animation', 'blurOut .5s linear');
            offcanvas.removeClass('open');
            background.addClass('hidden');

        });


    }

    function offCanvasRight() {

        let offcanvas = $("#offCanvasRight");
        let background = $('#backgroundOverlay');
        let close = $('#closeOffcanvasRight');

        if (offcanvas.hasClass('closed')) {
            console.log('opening');
            offcanvas.css('left', '0vw');
            offcanvas.removeClass('closed');
            background.css('animation', 'blurIn .5s linear');
            background.removeClass('hidden');
            // offcanvas.addClass('open');





        }
        close.click(function () {
            offcanvas.css('left', '130vw');
            offcanvas.addClass('closed');

            offcanvas.removeClass('open');
            background.css('animation', 'blurOut .5s linear');
            background.addClass('hidden');


        });


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
        element.html('');
    }


    function artistRegisterForm() {
        let artistRegister = document.getElementById('offCanvasContentContainer');
        artistRegister.innerHTML = `
        <h1 class="form-options pt-5">Artist Registration</h1> 
        <div class="w-100 text-center pt-2"> 
            <input class="form-buttons" type="text" id="firstName" name="firstName" placeholder="first name"> 
            <input class="form-buttons" type="text" id="lastName" name="lastName" placeholder="last name"> 
            <input class="form-buttons" type="text" id="email" name="email" placeholder="email"> 
            <input class="form-buttons" type="text" id="password" name="password" placeholder="password"> 
            <input class="form-buttons py-5" type="text" id="bio" name="bio" placeholder="bio"> 
            <input class="form-buttons" type="text" id="instagram" name="instagram" placeholder="instagram"><br> 
            <button class="submit-button mt-5" id="registerArtist">submit</button> 
        </div>
            `;
        $("#registerArtist").click(function(){
            let artistOptions = document.getElementById('offCanvasContentContainer');
            artistOptions.innerHTML = `
            <h1 class="form-options pt-5">Artist Name</h1> 
            <div class="w-100 text-center pt-2"> 
              <button id="editProfile" class="form-buttons">edit profile</button><br> 
              <button id="createListing" class="form-buttons">create listing</button><br> 
              <button id="editListing" class="form-buttons">edit listing</button><br> 
              <button id="deleteListing" class="form-buttons">delete listing</button> 
            </div>
            `;

            $("#editProfile").click(function(){
                editArtistProfile();
            });

            $("#createListing").click(function(){
                createListing();
            });

            $("#editListing").click(function(){
                editListing();
            });

            $("#deleteListing").click(function(){
                deleteListing();
            });

        });
    
    }

    function artistLoginForm() {
        let artistLogin = document.getElementById('offCanvasContentContainer');
        artistLogin.innerHTML = `
        <h1 class="form-options pt-5">Artist Login</h1> 
        <div class="w-100 text-center pt-2"> 
          <input class="form-buttons" type="text" id="email" name="email" placeholder="email"> 
          <input class="form-buttons" type="text" id="password" name="password" placeholder="password"><br> 
          <button class="submit-button mt-5" id="loginArtist">login</button> 
        </div>
        `;
        $("#loginArtist").click(function(){
            let artistOptions = document.getElementById('offCanvasContentContainer');
            artistOptions.innerHTML = `
            <h1 class="form-options pt-5">Artist Name</h1> 
            <div class="w-100 text-center pt-2"> 
              <button id="editProfile" class="form-buttons">edit profile</button><br> 
              <button id="createListing" class="form-buttons">create listing</button><br> 
              <button id="editListing" class="form-buttons">edit listing</button><br> 
              <button id="deleteListing" class="form-buttons">delete listing</button> 
            </div>
            `;
            $("#editProfile").click(function(){
                editArtistProfile();
            });

            $("#createListing").click(function(){
                createListing();
            });

            $("#editListing").click(function(){
                editListing();
            });

            $("#deleteListing").click(function(){
                deleteListing();
            });

        });

    }

    function collectorRegisterForm() {
        let collectorRegister = document.getElementById('offCanvasContentContainer');
        collectorRegister.innerHTML = `
        <h1 class="form-options pt-5">Collector Registration</h1> 
        <div class="w-100 text-center pt-2"> 
          <input class="form-buttons" type="text" id="firstName" name="firstName" placeholder="first name"> 
          <input class="form-buttons" type="text" id="lastName" name="lastName" placeholder="last name"> 
          <input class="form-buttons" type="text" id="email" name="email" placeholder="email"> 
          <input class="form-buttons" type="text" id="password" name="password" placeholder="password"><br>
          <button class="submit-button mt-5" id="registerCollector">submit</button> 
        </div>
          `;
        $("#registerCollector").click(function(){
            let welcomeCollector = document.getElementById('offCanvasContentContainer');
            welcomeCollector.innerHTML = `
            <h1 class="form-options mt-5">Collector Name</h1> 
            <div class="w-100 text-center pt-2"> 
              <p class="my-5">Welcome, Collector Name</p> 
              <button id="editCollectorProfile" class="form-buttons">edit profile</button> 
            </div>
            `;
            $("#editCollectorProfile").click(function(){
                editCollectorProfile();
            });
        });
    }

    function collectorLoginForm() {
        let collectorLogin = document.getElementById('offCanvasContentContainer');
        collectorLogin.innerHTML = `
        <h1 class="form-options pt-5">Collector Login</h1> 
        <div class="w-100 text-center pt-2"> 
          <input class="form-buttons" type="text" id="email" name="email" placeholder="email"> 
          <input class="form-buttons" type="text" id="password" name="password" placeholder="password"><br>
          <button class="submit-button mt-5" id="loginCollector">login</button> 
        </div>
          `;
        $("#loginCollector").click(function(){
            let welcomeCollector = document.getElementById('offCanvasContentContainer');
            welcomeCollector.innerHTML = `
            <h1 class="form-options mt-5">Collector Name</h1> 
            <div class="w-100 text-center pt-2"> 
                <p class="my-5">Welcome, Collector Name</p> 
                <button id="editCollectorProfile" class="form-buttons">edit profile</button> 
            </div>
            `;
            $("#editCollectorProfile").click(function(){
                editCollectorProfile();
            });

        });

    }

    function editArtistProfile() {
        // need to get the artist details from mongo and populate
        // on click of the save button update their details in mongo
        let editArtistProfile = document.getElementById('offCanvasContentContainer');
        editArtistProfile.innerHTML = 
        `
        <h1 class="form-options pt-5">Edit Profile</h1> 
        <div class="w-100 text-center pt-2"> 
          <input class="form-buttons" type="text" id="editName" name="editName" placeholder="edit artist name"> 
          <input class="form-buttons" type="text" id="email" name="email" placeholder="email"> 
          <input class="form-buttons" type="text" id="password" name="password" placeholder="password"> 
          <input class="form-buttons py-5" type="text" id="editBio" name="editBio" placeholder="edit bio"> 
          <input class="form-buttons" type="text" id="editInst" name="editInst" placeholder="edit instagram"><br>
          <button class="submit-button mt-5" id="updateArtistProfile">submit</button> 
        </div>
  
        `;
        $('#updateArtistProfile').click(function (event) {
            alert("Your artist profile has been updated");
            console.log("you have clicked the submit on the update artist profile");
        });

    }

    function createListing() {
        let createListing = document.getElementById('offCanvasContentContainer');
        createListing.innerHTML =
        `
        <h1 class="form-options pt-5">Create Listing</h1> 
        <div class="w-100 text-center pt-2"> 
          <input class="form-buttons" type="text" id="listingName" name="listingName" placeholder="listing name"><br> 
          <select class="form-buttons center-dropdown" id="category" name="category"> <option disabled selected hidden>category</option> 
            <option value="accessories">accessories</option> 
            <option value="art">art</option> <option value="garments">garments</option> 
            <option value="homewares">homewares</option> 
            <option value="jewellery">jewellery</option> 
          </select><br> 
          <select class="form-buttons center-dropdown" id="subCategoryAcc" name="subCategoryAcc"> 
            <option disabled selected hidden>sub-category</option>
            <option value="hats">hats</option> 
            <option value="bags">bags</option> 
            <option value="glasses">glasses</option>
            <option value="painting">painting</option> 
            <option value="prints">prints</option> 
            <option value="sculpture">sculpture</option> 
            <option value="ceramics">ceramics</option>
            <option value="dresses">dresses</option> 
            <option value="tops">tops</option> 
            <option value="bottoms">bottoms</option> 
            <option value="intimates">intimates</option> 
            <option value="outerwear">outerwear</option>
            <option value="glass">glass</option> 
            <option value="linen">linen</option> 
            <option value="softFurnishings">soft furnishings</option> 
            <option value="decor">decor</option> 
            <option value="rugs">rugs</option> 
            <option value="kitchenDining">kitchen & dining</option>
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




        $('#createListingBtn').click(function (event) {
            event.preventDefault();
            newTitle = $('#listingName').val(); 
            newCategory = $('#category').val();
            newSubCategory = $('#subCategoryAcc').val();
            newDescription = $('#listingDesc').val(); 
            newPrice = $('#listingPrice').val(); 
            newImage = $('#listingImage').val(); 
            // let userid = '642b9fb4641fd5d38b2fcf03';

            // let userid = sessionStorage.getItem('userID');
            console.log(newTitle, newPrice, newImage);
            // don't want to send any empty stuff so do if stmt checks
            if (newTitle == '' || newPrice == '' || newImage == '') {
                alert('Please enter ALL listing details');
            } else {
                alert('New listing added');
                addProduct(newTitle, newPrice, newImage, newDescription, newCategory, newSubCategory)
                    // addProduct();
            }
            // end of else
        });
    }

    function editListing() {
        // ajax calll to get the logged in artist's listings
        // populate the dropdown with the listings
        // display the form ...
        let editListing = document.getElementById('offCanvasContentContainer');
        editListing.innerHTML = `
        <h1 class="form-options pt-5">Edit Listing</h1> 
        <div class="w-100 text-center pt-2"> 
          <select class="form-buttons center-dropdown" id="category" name="category">
            <option disabled selected hidden>select listing</option> 
            <option value="listing1">listing 1</option> 
            <option value="listing2">listing 2</option> 
            <option value="listing3">listing 3</option> 
          </select><br> 
          <input class="form-buttons" type="text" id="listingName" name="listingName" placeholder="listing name"><br> 
          <select class="form-buttons center-dropdown" id="category" name="category">
            <option disabled selected hidden>category</option> 
            <option value="accessories">accessories</option> 
            <option value="art">art</option> 
            <option value="garments">garments</option> 
            <option value="homewares">homewares</option> 
            <option value="jewellery">jewellery</option> 
          </select><br> 
          <select class="form-buttons center-dropdown" id="subCategoryAcc" name="subCategoryAcc"> 
            <option disabled selected hidden>sub-category</option> -->
            <option value="hats">hats</option> 
            <option value="bags">bags</option> 
            <option value="glasses">glasses</option>
  
            <option value="painting">painting</option> 
            <option value="prints">prints</option> 
            <option value="sculpture">sculpture</option> 
            <option value="ceramics">ceramics</option>
  
            <option value="dresses">dresses</option> 
            <option value="tops">tops</option> 
            <option value="bottoms">bottoms</option> 
            <option value="intimates">intimates</option> 
            <option value="outerwear">outerwear</option>
  
            <option value="glass">glass</option> 
            <option value="linen">linen</option> 
            <option value="softFurnishings">soft furnishings</option> 
            <option value="decor">decor</option> 
            <option value="rugs">rugs</option> 
            <option value="kitchenDining">kitchen & dining</option>
  
            <option value="earrings">earrings</option> 
            <option value="necklaces">necklaces</option> 
            <option value="bracelets">bracelets</option> 
            <option value="rings">rings</option> 
          </select><br> 
          <input class="form-buttons" type="text" id="listingDesc" name="listingDesc" placeholder="listing description"> 
          <input class="form-buttons" type="text" id="listingPrice" name="listingPrice" placeholder="price"> 
          <input class="form-buttons" type="text" id="listingImage" name="listingImage" placeholder="image upload"><br>
          <button class="submit-button mt-5" id="updateListingBtn">submit</button> 
        
        </div> 
  
        `;
        $('#updateListingBtn').click(function (event) {
            alert("Listing updated");

            console.log("you have clicked the submit on the update listing page");
        });

    }

    function deleteListing() {
        let deleteListing = document.getElementById('offCanvasContentContainer');
        deleteListing.innerHTML = `
        <h1 class="form-options pt-5">Delete Listing</h1> 
        <div class="w-100 text-center pt-5 pb-5">
          <select class="form-buttons center-dropdown" id="category" name="category">
            <option disabled selected hidden>select listing</option>
            <option value="listing1">listing 1</option> 
            <option value="listing2">listing 2</option> 
            <option value="listing3">listing 3</option> 
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
        $('#deleteListingBtn').click(function (event) {
            let checkbox = document.getElementById('confirmListingDelete').checked;
            if (checkbox) {
                alert("delete successful");
            } else {
                alert("please check the confirm delete box");
            }
        });

    }

    function editCollectorProfile() {
        // need to get the artist details from mongo and populate
        // on click of the save button update their details in mongo
        let editCollectorProfile = document.getElementById('offCanvasContentContainer');
        editCollectorProfile.innerHTML = `
        <h1 class="form-options mt-5">Edit Profile</h1> 
        <div class="w-100 text-center mt-5"> 
          <input class="form-buttons" type="text" id="firstName" name="firstName" placeholder="first name"> 
          <input class="form-buttons" type="text" id="lastName" name="lastName" placeholder="last name"> 
          <input class="form-buttons" type="text" id="email" name="email" placeholder="email"> 
          <input class="form-buttons mb-5" type="text" id="password" name="password" placeholder="password"><br>
          <button class="submit-button mt-5" id="updateCollectorProfile">submit</button> 
        </div>
    
        `;
        $('#updateCollectorProfile').click(function (event) {
            alert("Your collector profile has been updated");
            console.log("you have clicked the submit on the update collector profile");
        });

    }




    // ------------- CLICK EVENTS ------------

    $("#hamburgerIcon").click(function () {
        offCanvasLeft();
    });
    $("#hamburgerIconMobile").click(function () {
        offCanvasLeft();
    });
    $("#reviewBtn").click(function () {
        slideUp($("#commentsContainer"));
        setTimeout(populateCommentContainer, 1500);

    });
    $("#orderBtn").click(function () {
        slideUp($("#enquireContainer"));
        setTimeout(populateEnquireForm, 1500);


    });


    $('#commentSubmit').click(function () {
        slideDown($("#commentsContainer"));

    });


    $("#mobileOffcanvasOpen").click(function () {
        offCanvasRight();
    });



    // ----------------------------- Get all products ----------------------------------

    // ----------------------------- End of get all products ----------------------------------
    // const test = document.getElementById('confirmListingDelete');
    // console.log(test.checked);
    
    
    // ----------------------------- Add a product ----------------------------------


    // ---------------- LOADING SCREEN --------------------------

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
        populateHomeImages();
        
    });

    


});


    // ----------------------------- End of add a product ----------------------------------






// -------------------------- End of Frontend $(document).ready() 'container' -------------------------------

