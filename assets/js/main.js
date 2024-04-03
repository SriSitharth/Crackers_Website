(function ($) {

  "use strict";
  // Read the JSON file and store data in sessionStorage
  var jsonData = "";
  $.getJSON('crackers.json', function (data) {
    getInitialData = data;
    storeDataInSessionStorage(data);
    var storedData = sessionStorage.getItem('jsonData');
    jsonData = JSON.parse(storedData);
  });
  $(window).on('load', function () {

    /*Page Loader active
      ========================================================*/
    $('#preloader').fadeOut();

    // Sticky Nav
    $(window).on('scroll', function () {
      if ($(window).scrollTop() > 200) {
        $('.scrolling-navbar').addClass('top-nav-collapse');
      } else {
        $('.scrolling-navbar').removeClass('top-nav-collapse');
      }
    });

    /* ==========================================================================
       countdown timer
       ========================================================================== */
    jQuery('#clock').countdown((jsonData.diwaliDate), function (event) {
      var $this = jQuery(this).html(event.strftime(''
        + '<div class="time-entry days"><span>%-D</span> Days</div> '
        + '<div class="time-entry hours"><span>%H</span> Hours</div> '
        + '<div class="time-entry minutes"><span>%M</span> Minutes</div> '
        + '<div class="time-entry seconds"><span>%S</span> Seconds</div> '));
    });

    /* slicknav mobile menu active  */
    $('.mobile-menu').slicknav({
      prependTo: '.navbar-header',
      parentTag: 'liner',
      allowParentLinks: true,
      duplicate: true,
      label: '',
    });

    /* WOW Scroll Spy
  ========================================================*/
    var wow = new WOW({
      //disabled for mobile
      mobile: false
    });
    wow.init();

    /* Nivo Lightbox
    ========================================================*/
    $('.lightbox').nivoLightbox({
      effect: 'fadeScale',
      keyboardNav: true,
    });

    // one page navigation
    $('.navbar-nav').onePageNav({
      currentClass: 'active'
    });

    /* Back Top Link active
    ========================================================*/
    var offset = 200;
    var duration = 500;
    $(window).scroll(function () {
      if ($(this).scrollTop() > offset) {
        $('.back-to-top').fadeIn(400);
      } else {
        $('.back-to-top').fadeOut(400);
      }
    });

    $('.back-to-top').on('click', function (event) {
      event.preventDefault();
      $('html, body').animate({
        scrollTop: 0
      }, 600);
      return false;
    });

  });
}(jQuery));

// Global Declaration
var grandTotal = 0;
var safeJson = '';
var getInitialData = [];
var stringHtml = "";
var whatsappMessage = "";
var whatsappTotalQuantity = "";
var jsonData = "";

$(document).ready(function () {
  // Read the JSON file and store data in sessionStorage
  $.getJSON('crackers.json', function (data) {
    getInitialData = data;
    storeDataInSessionStorage(data);
    var storedData = sessionStorage.getItem('jsonData');
    jsonData = JSON.parse(storedData);
    // Calling the function to load accordion
    loadAccordion(jsonData);
    // Calling the function to load New Arrival
    loadNewArrival(jsonData);
  });

  // Plus Button
  $(document).on('click', '.plus', function () {
    var myId = $(this).attr('id');
    const myArray = myId.split("_");
    var ctgId = myArray[1];
    var itemId = myArray[2];
    var quantityInput = $('#inputQuantity_' + ctgId + '_' + itemId);
    var price = $(this).data('price');
    var currentValue = parseInt(quantityInput.val(), 10);
    quantityInput.val(currentValue + 1);
    currentValue = currentValue + 1;
    var total = price * currentValue;
    $('#itemTotal_' + ctgId + '_' + itemId).text(total);
    //Update in Local JSON
    jsonData.crackers[ctgId].items[itemId].quantity = currentValue;
    jsonData.crackers[ctgId].items[itemId].total = total;
    //Grand Total Calculation
    grandTotal += price;
    $('#grandPrice').text('Grand Total (Rs) : ' + grandTotal);
    calculateCategoryTotal();
  });

  // Minus Button
  $(document).on('click', '.minus', function () {
    var myId = $(this).attr('id');
    const myArray = myId.split("_");
    var ctgId = myArray[1];
    var itemId = myArray[2];
    var quantityInput = $('#inputQuantity_' + ctgId + '_' + itemId);
    var price = $(this).data('price');
    var currentValue = parseInt(quantityInput.val(), 10);
    if (currentValue > 0) {
      quantityInput.val(currentValue - 1);
      currentValue = currentValue - 1;
      var total = price * currentValue;
      $('#itemTotal_' + ctgId + '_' + itemId).text(total);
      //Update in Local JSON
      jsonData.crackers[ctgId].items[itemId].quantity = currentValue;
      jsonData.crackers[ctgId].items[itemId].total = total;
      //Grand Total Calculation
      grandTotal -= price;
      $('#grandPrice').text('Grand Total (Rs) : ' + grandTotal);
      calculateCategoryTotal();
    }
  });

  // Image Button
  $(document).on('click', '.imgButton', function () {
    $('#exampleModalLabel').remove();
    $('#lbIndicator').empty();
    $('#lbImg').empty();
    var myId = $(this).attr('id');
    const myArray = myId.split("_");
    var ctgId = myArray[1];
    var itemId = myArray[2];
    var lightboxName = '<h5 class="modal-title" id="exampleModalLabel">' + jsonData.crackers[ctgId].items[itemId].name + '</h5>'
    var lightboxImg = '<div class="carousel-item active"><img class="d-block w-100" src="' + jsonData.crackers[ctgId].items[itemId].img + '" alt="Slide 1"></div>'
      + '<div class="carousel-item"><img class="d-block w-100" src="' + jsonData.crackers[ctgId].items[itemId].img2 + '" alt="Slide 2"></div>'
      + '<div class="carousel-item"><img class="d-block w-100" src="' + jsonData.crackers[ctgId].items[itemId].img3 + '" alt="Slide 3"></div>'
    var lightboxIndicator = '<button type="button" data-bs-target="#myCarousel2" data-bs-slide-to="0" class="active" aria-current="true" aria-label="Slide 1"></button>'
      + '<button type="button" data-bs-target="#myCarousel2" data-bs-slide-to="1" aria-label="Slide 2"></button>'
      + '<button type="button" data-bs-target="#myCarousel2" data-bs-slide-to="2" aria-label="Slide 3"></button>'
    $('#lbHeader').prepend(lightboxName);
    $('#lbIndicator').append(lightboxIndicator);
    $('#lbImg').append(lightboxImg);
  })

  // Reset Button
  $("#resetBtn").click(function (e) {
    e.preventDefault();
    $("#accordion").empty();
    $("#accordion").append(stringHtml);
    $("#accordion").accordion("refresh");
    $('#accordion').accordion({
      collapsible: true,
      active: 0
    });
    jsonData = getInitialData;
  });

  // To Calculate the category total
  function calculateCategoryTotal() {
    $.each(jsonData.crackers, function (index, category) {
      var catTotal = 0;
      $.each(category.items, function (i, item) {
        var dis = parseInt($('#itemTotal_' + index + '_' + i).text());
        catTotal += dis;
      });
      $('#ctgName_' + index).text('Subtotal : ' + catTotal);
      category.categoryTotal = catTotal;
    });
  }

  // Send Button to List order
  $("#sendBtn").click(function (e) {
    $('#cartBody').empty();
    $('#cartPrice').empty();
    $('#validateBoth').empty();
    var count = 0;
    var cartTotal = 0;
    whatsappMessage = "";
    $.each(jsonData.crackers, function (index, category) {
      cartTotal += category.categoryTotal;
      $.each(category.items, function (i, item) {
        if (item.quantity > 0) {
          $('#message').hide();
          $('#orderTable').show();
          count++;
          var fullName = item.name;
          var orderRow = '<tr><td>' + count + '</td><td>' + item.name + '</td><td>' + item.quantity + '</td><td>' + item.total + '</td></tr>'
          $('#cartBody').append(orderRow);
          if ((item.name).length < 28) {
            for (var i = (item.name).length; i < 28; i++) {
              fullName = fullName + " ";
            }
            whatsappMessage += '  ' + item.id + '      | ' + fullName + ' |       ' + item.quantity + '      | ' + item.total + '%0a';
          } else {
            var shortName = (item.name).substring(0, 25) + "...";
            whatsappMessage += '  ' + item.id + '      | ' + shortName + ' |       ' + item.quantity + '      | ' + item.total + '%0a';
          }
        }
      })
    })
    if (count == 0) {
      $('#orderTable').hide();
      $('#message').show();
    } else {
      whatsappTotalQuantity = 'Quantity Total(No) : ' + count;
      $('#cartPrice').append('Total Amount : ' + cartTotal);
    }
  })

  // Customer Name Validation
  $("#cartName").on("blur", function () {
    if ($(this).val().match('^[a-zA-Z]{3,16}$')) {
      $("#validateName").text("Valid Name").css('color', 'green');
    } else {
      $("#validateName").text("Not a Valid Name").css('color', 'red');
    }
  });

  // Mobile Number Validation
  $("#cartNumber").on("blur", function () {
    var mobNum = $(this).val();
    var filter = /^\d*(?:\.\d{1,2})?$/;
    if (filter.test(mobNum)) {
      if (mobNum.length == 10) {
        $("#validateNumber").text("Valid Number").css('color', 'green');
      } else {
        $("#validateNumber").text("Must be 10 digit Number").css('color', 'red');
        return false;
      }
    }
    else {
      $("#validateNumber").text("Not a Valid Number").css('color', 'red');
      return false;
    }
  });

  // Code for Cart Submit
  $(document).on('click', '#whatsappBtn', function () {
    var cartname = document.getElementById('cartName').value;
    var cartnumber = document.getElementById('cartNumber').value;
    var cartmessage = document.getElementById('message').value;
    var cartTotal = $('#grandPrice').text();
    if (cartname != '' && cartnumber != '') {
      if (cartmessage == '' && cartTotal != 'Grand Total (Rs) : 0') {
        var url = "https://wa.me/91" + jsonData.phoneNumber + "?text=Name : " + cartname + "%0aPhone : " + cartnumber + "%0a" + whatsappTotalQuantity + "%0a" + cartTotal + "%0a%0aCode | Product                            | Quantity | Price%0a" + whatsappMessage;
      } else if (cartmessage != '') {
        var url = "https://wa.me/91" + jsonData.phoneNumber + "?text=Name : " + cartname + "%0aPhone : " + cartnumber + "%0aMessage : " + cartmessage;
      } else {
        var url = "https://wa.me/91" + jsonData.phoneNumber + "?text=Name : " + cartname + "%0aPhone : " + cartnumber;
      }
      window.open(url, '_blank').focus();
    } else {
      $("#validateBoth").text("Enter the required details").css('color', 'red');
    }
  });

  // Code for Whatsapp Message
  $(document).on('click', '#subscribes', function () {
    var message = document.getElementById('whatsappMessage').value;
    if (message != "") {
      var url = "https://wa.me/91" + jsonData.phoneNumber + "?text=" + message;
      window.open(url, '_blank').focus();
    }
  });
});

// Function to store data in sessionStorage
function storeDataInSessionStorage(data) {
  sessionStorage.setItem('jsonData', JSON.stringify(data));
}

function loadAccordion(jsonData) {
  // FETCHING DATA FROM Stored JSON
  var itemCount = 0;
  $.each(jsonData.crackers, function (index, category) {
    var htmlOut = '<h3>' + category.category + '<p id="ctgName_' + index + '"></p></h3>';
    htmlOut += '<div>';
    htmlOut += '<table>';
    htmlOut += '<thead>';
    htmlOut += '<tr><th scope="col">#</th><th scope="col">Image</th><th scope="col">Name</th><th scope="col">Price</th><th scope="col">Quantity</th><th scope="col">Total</th></tr>';
    htmlOut += '</thead>';
    htmlOut += '<tbody>';
    $.each(category.items, function (i, item) {
      itemCount++;
      htmlOut += '<tr>';
      htmlOut += '<td scope="row">' + item.id + '</td><td><button type="button" class="imgButton" id="imgButton_' + index + '_' + i + '" data-bs-toggle="modal" data-bs-target="#myModal"><img src="' + item.img + '"class="card-img-top div-img" data-target="#indicatorImage" data-slide-to="' + itemCount + '" alt="' + item.name + '"></button></td><td>' + item.name + '</td><td>' + item.price + '</td>';
      htmlOut += '<td><button type="button" id="minusBtn_' + index + '_' + i + '" class="btn btn-primary btn-rounded btn-sm minus" data-price=' + item.price + ' data-index="' + itemCount + '">-</button>'
      htmlOut += '<input type="text" min="0" step="1" id="inputQuantity_' + index + '_' + i + '" class="count" name="qty" value="' + item.quantity + '" data-price=' + item.price + ' disabled>'
      htmlOut += '<button type="button" id="plusBtn_' + index + '_' + i + '" class="btn btn-primary btn-rounded btn-sm plus" data-price=' + item.price + ' data-index="' + itemCount + '">+</button></td>'
      htmlOut += '<td><div class="count-display" id="itemTotal_' + index + '_' + i + '">' + item.total + '</div></td>'
      htmlOut += '</tr>';
    });
    htmlOut += '</tbody>';
    htmlOut += '</table>';
    htmlOut += '</div>';
    $('#accordion').append(htmlOut);
  });

  // Initialize the accordion
  $('#accordion').accordion({
    collapsible: true,
    active: 0
  });
  stringHtml = $('#accordion').html();

  $('#ownerNumber').append('Mobile Number : ' + jsonData.phoneNumber);
  $('#ownerEmail').append('Email Id : ' + jsonData.emailId);
  $('#ownerAddress').append(jsonData.shopAddress + '<br>Ph : ' + jsonData.phoneNumber + ', ' + jsonData.secondaryNumber + '<br>Email Id : ' + jsonData.emailId);
}
// For the New Arrival Section
function loadNewArrival(jsonData) {
  $.each(jsonData.crackers, function (index, category) {
    $.each(category.items, function (i, item) {
      if (item.isChecked === true) {
        var htmlIn = '<div class="col-xs-12 col-md-6 col-lg-4">'
          + '<div class="about-item">'
          + '<img class="img-fluid" id="newArrivalImg" src="' + item.img + '" alt="">'
          + '<div class="about-text">'
          + '<h3><a href="#">' + item.name + '</a></h3>'
          + '<p>Price : ' + item.price + '</p><a class="btn btn-common btn-rm" href="#allProducts">View More</a>'
          + '</div></div></div>'

        $('#newArrivalRow').append(htmlIn);
      }
    })
  })
}
