$(document).ready(function () {

  $('.votes-widget__question input').on('change', function (e){
    if ($(this).prop('checked')) {
      $(this).parent().addClass('selected');
    } else {
      $(this).parent().removeClass('selected');
    }
  });

  $('.js-mnu-btn').on("click", function () {
    $(this).toggleClass('active');
    $('.js-mobile-mnu').toggleClass('active');
  });

  $(".js-sortable").sortable();

  $('.js-select').select2({
    containerCssClass: 'select_custom',
    dropdownCssClass: 'select_custom',
    minimumResultsForSearch: Infinity,
  });

  $(".js-slider").owlCarousel({
    items: 1,
    loop: true,
    autoplay: true,
    animateIn: "fade",
  });

  $('.js-hamb').on('click', function () {
    $('.js-hamb-hidden').fadeToggle(200)
  });

  $(window).on('click', function (e) {
      if(e.target.closest('.js-hamb'))
          return false
      $('.js-hamb-hidden').fadeOut(200)

  })

  $('.js-popup-ava-link').on('click', function (){
    $('.js-popup-bg, .js-popup--ava').addClass('active');
  });

  $('.js-popup-add-ava-link').on('click', function (){
    $('.js-popup-bg, .js-popup--add-ava').addClass('active');
  });

  $('.js-popup-close').on('click', function (){
    $('.js-popup-bg, .js-popup').removeClass('active');
  });

  $('.js-delete-ava').on('click', function () {
    var ava = $('.js-ava');
    if (!ava.data("is-default")) {
      $.ajax({
        url: $('.js-crop-save').data("ajax-target"),
        data: {
          action: "avatar",
          csrfmiddlewaretoken: $('input[name=csrfmiddlewaretoken]').val(),
          "_avatar-clear": "on"
        },
        type: 'POST',
      });
      ava.attr('src', ava.data("default-image"));
      ava.data("is-default", 1);
    }
    $('.js-popup-bg, .js-popup').removeClass('active');
  })

// TODO: check why it blocks ajax on news page?
//  $('.js-popup-bg').on('click', function (e) {
//    if ($(e.target).closest('.js-popup').length)
//      return false
//    $('.js-popup-bg, .js-popup').removeClass('active');
//  })

  function demoUpload() {
    var $uploadCrop;

    function readFile(input) {
      if (input.files && input.files[0]) {
        var reader = new FileReader();

        reader.onload = function (e) {

          $('.js-popup').removeClass('active');
          $('.js-popup--add-ava-crop').addClass('active');

          $('.upload-demo').addClass('ready');
          $uploadCrop.croppie('bind', {
            url: e.target.result
          }).then(function(){
            console.log('jQuery bind complete');
          });

        }

        reader.readAsDataURL(input.files[0]);
      }
      else {
        swal("Sorry - you're browser doesn't support the FileReader API");
      }
    }

    $uploadCrop = $('#upload-demo').croppie({
      viewport: {
        width: 270,
        height: 270,
        type: 'circle',
      },
      enableExif: true
    });

    $('#upload').on('change', function () { readFile(this); });
    $('.js-crop-save').on('click', function (ev) {
      var fd = new FormData(document.forms[0]);
      fd.append("action", "avatar");
      fd.append("csrfmiddlewaretoken", $('input[name=csrfmiddlewaretoken]').val());

      $uploadCrop.croppie('result', {
        type: 'blob',
        size: 'viewport'
      }).then(function (blob) {
        fd.append('_avatar', blob, 'profile-image.png');

        $.ajax({
          url: $('.js-crop-save').data("ajax-target"),
          data: fd,
          type: 'POST',
          contentType: false,
          processData: false,
          success: function () {
            $uploadCrop.croppie('result', {
              type: 'canvas',
              size: 'viewport'
            }).then(function (resp) {
              var ava = $('.js-ava');
              ava.attr('src', resp)
              ava.data("is-default", 0);
              $('.js-popup-bg, .js-popup').removeClass('active');
              $('#upload').val('');
              return false;
            });
          },
          error: function (data) {
            console.warn(data);
          },
        });

        return false;
      });
    });
  }

  $('.bottom-scroll').on('click', function (e){
    e.preventDefault();
    $('html, body').animate({
      scrollTop: $('body').outerHeight()
    }, 500)
  })

  if ($('#upload-demo').length > 0) {
    demoUpload();
  }

  $('.welcome-popup__close, .welcome-popup__btn').on('click', function () {
    $('body').removeClass('open-welcome-popup');
    $('.welcome-popup-bg').fadeOut();
  })

  var bigimage = $(".js-news-slider");
  var thumbs = $(".js-news-thumbs");
  var syncedSecondary = false;

  bigimage
      .owlCarousel({
        items: 1,
        nav: true,
        autoplay: true,
        dots: false,
        loop: true,
        responsiveRefreshRate: 300,
        margin: 20,
        navText:[
          "<div class='owl-prev'>" +
          "   <svg class=\"icn icn-arrow_r\">\n" +
          "     <use xlink:href=\"/static/img/sprite.svg#arrow_r\"></use>\n" +
          "   </svg>" +
          "</div>",
          "<div class='owl-next'>" +
          "   <svg class=\"icn icn-arrow_r\">\n" +
          "     <use xlink:href=\"/static/img/sprite.svg#arrow_r\"></use>\n" +
          "   </svg>" +
          "</div>"],
      })
      .on("changed.owl.carousel", syncPosition);

  thumbs
      .on("initialized.owl.carousel", function() {
        thumbs
            .find(".owl-item")
            .eq(0)
            .addClass("current");
      })
      .owlCarousel({
        items: 4,
        margin: 40,
        smartSpeed: 200,
        slideSpeed: 500,
        slideBy: 1,
        responsiveRefreshRate: 200,
        responsive:{
          768:{
            items:2,
          },
          1024:{
            items:3,
          },
          1365:{
            items:4,
          }
        }
      })
      .on("changed.owl.carousel", syncPosition2);

  function syncPosition(el) {
    //if loop is set to false, then you have to uncomment the next line
    // var current = el.item.index;

    //to disable loop, comment this block
    var count = el.item.count - 1;
    var current = Math.round(el.item.index - el.item.count / 2 - 0.5);

    if (current < 0) {
      current = count;
    }
    if (current > count) {
      current = 0;
    }
    //to this
    thumbs
        .find(".owl-item")
        .removeClass("current")
        .eq(current)
        .addClass("current");
    var onscreen = thumbs.find(".owl-item.active").length - 1;
    var start = thumbs
        .find(".owl-item.active")
        .first()
        .index();
    var end = thumbs
        .find(".owl-item.active")
        .last()
        .index();
    if (current > end) {
      thumbs.data("owl.carousel").to(current, 100, true);
    }
    if (current < start) {
      thumbs.data("owl.carousel").to(current - onscreen, 100, true);
    }
  }

  function syncPosition2(el) {
    if (syncedSecondary) {
      var number = el.item.index;
      bigimage.data("owl.carousel").to(number, 100, true);
    }
  }

  thumbs.on("click", ".owl-item", function(e) {
    e.preventDefault();
    var number = $(this).index();
    bigimage.data("owl.carousel").to(number, 300, true);
  });

  $('.js-feedback').on('click', function (e) {
    e.preventDefault();
    $('#proposal').find("button").attr("disabled", false);
    $('.js-popup-bg').addClass('active');
    $('.js-popup--feedback').addClass('active');
  });

  $('.js-feedback-thanks').on('click', function (e) {
    e.preventDefault();
    $('.js-popup--feedback').removeClass('active');
    $('.js-popup-bg').addClass('active');
    $('.js-popup--thanks').addClass('active');
  });

  if ($('.b-lazy').length) {
    new Blazy();
  }

  $('.js-research').owlCarousel({
    items: 4,
    margin: 40,
    smartSpeed: 200,
    slideSpeed: 500,
    slideBy: 1,
    responsiveRefreshRate: 200,
    loop: false,
    nav: true,
    navText:[
      "<div class='owl-prev'>" +
      "   <svg class=\"icn icn-arrow_r\">\n" +
      "     <use xlink:href=\"/static/img/sprite.svg#arrow_r\"></use>\n" +
      "   </svg>" +
      "</div>",
      "<div class='owl-next'>" +
      "   <svg class=\"icn icn-arrow_r\">\n" +
      "     <use xlink:href=\"/static/img/sprite.svg#arrow_r\"></use>\n" +
      "   </svg>" +
      "</div>"],
    responsive:{
      0:{
        items:1,
      },
      768:{
        items:2,
      },
      1024:{
        items:3,
      },
      1365:{
        items:4,
      }
    }
  })

  $('.js-slider-about').owlCarousel({
    items: 1,
    margin: 40,
    loop: true,
    dots: true,
    nav: true,
    autoHeight: true,
    navText:[
    "   <svg class=\"icn icn-arrow_r\">\n" +
    "     <use xlink:href=\"static/img/sprite.svg#arrow_r\"></use>\n" +
    "   </svg>",
    "   <svg class=\"icn icn-arrow_r\">\n" +
    "     <use xlink:href=\"static/img/sprite.svg#arrow_r\"></use>\n" +
    "   </svg>"],
  })

  $('.js-research-landing').owlCarousel({
    items: 3,
    margin: 0,
    smartSpeed: 200,
    slideSpeed: 500,
    slideBy: 1,
    responsiveRefreshRate: 200,
    loop: false,
    nav: true,
    navText:[
      "<div class='owl-prev'>" +
      "   <svg class=\"icn icn-arrow_r\">\n" +
      "     <use xlink:href=\"static/img/sprite.svg#arrow_r\"></use>\n" +
      "   </svg>" +
      "</div>",
      "<div class='owl-next'>" +
      "   <svg class=\"icn icn-arrow_r\">\n" +
      "     <use xlink:href=\"static/img/sprite.svg#arrow_r\"></use>\n" +
      "   </svg>" +
      "</div>"],
    responsive:{
      0:{
        items:1,
      },
      768:{
        items:2,
      },
      1024:{
        items:3,
      },
      1365:{
        items:3,
      }
    }
  })

  $('.js-project-work').owlCarousel({
    items: 1,
    margin: 40,
    loop: true,
    dots: true,
    nav: true,
    URLhashListener:true,
    animateOut: 'fadeOut',
    navText:[
      "   <svg class=\"icn icn-arrow_r\">\n" +
      "     <use xlink:href=\"static/img/sprite.svg#arrow_r\"></use>\n" +
      "   </svg>",
      "   <svg class=\"icn icn-arrow_r\">\n" +
      "     <use xlink:href=\"static/img/sprite.svg#arrow_r\"></use>\n" +
      "   </svg>"],
  });

  $('.js-anchors a').on('click', function (e) {
    var id = $(this).attr('href');
    if ($(id).length) {
      e.preventDefault()
      $('html, body').animate({
        scrollTop: $(id).offset().top - $('header').outerHeight() - 20
      }, 500)
    }
  });

  $(window).on('scroll', function () {
    if ($(this).scrollTop() > 300) {
      $('.js-up').fadeIn(0)
    } else {
      $('.js-up').fadeOut(0)
    }
  })

  $('.js-up').on('click', function () {
    $('html, body').animate({
      scrollTop: 0
    }, 500)
  })

  $('.starability-basic input').on('change', function (){
    $('.js-hint-selected').remove();
    $('.starability-basic label .hint__hidden').removeClass('hint__hidden--visible');
    $(this).next('label').find('.hint__hidden').addClass('hint__hidden--visible');

  });

});
