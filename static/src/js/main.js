window.dataLayer = window.dataLayer || [];
function gtag() {
  dataLayer.push(arguments);
}
gtag("js", new Date());

gtag("config", "G-KCVW8NEE70");

!(function (o, c) {
  var n = c.documentElement,
    t = " w-mod-";
  (n.className += t + "js"),
    ("ontouchstart" in o || (o.DocumentTouch && c instanceof DocumentTouch)) &&
      (n.className += t + "touch");
})(window, document);

var showDate = new Date("2024-06-16T09:40:00");
var hideDate = new Date("2024-06-18T17:00:00");
var currentDate = new Date();

if (currentDate >= showDate && currentDate <= hideDate) {
  document.querySelector(".popup-div-bg").style.display = "block";
  document.querySelector(".popup-div-one").style.display = "block";
}

// setTimeout(function () {
//   document.querySelector(".popup-div-bg").style.display = "none";
//   document.querySelector(".popup-div-one").style.display = "none";
//   document.cookie =
//     "cookiePopup=yes; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
// }, hideDate - currentDate);

function openNav() {
  document.getElementById("mySidenav").style.width = "250px";
}

function closeNav() {
  document.getElementById("mySidenav").style.width = "0";
}

var dropdown = document.getElementsByClassName("dropdown-btn");
var i;

for (i = 0; i < dropdown.length; i++) {
  dropdown[i].addEventListener("click", function () {
    this.classList.toggle("active");
    var dropdownContent = this.nextElementSibling;
    if (dropdownContent.style.display === "block") {
      dropdownContent.style.display = "none";
    } else {
      dropdownContent.style.display = "block";
    }
  });
}

var swiper = new Swiper(".mySwiperyear", {
  loop: true,
  navigation: {
    nextEl: ".swiper-button-next",
    prevEl: ".swiper-button-prev",
  },
});

function init() {
  var vidDefer = document.getElementsByTagName("iframe");
  console.log("vidDefer: ", vidDefer);
  for (var i = 0; i < vidDefer.length; i++) {
    if (vidDefer[i].getAttribute("data-src")) {
      vidDefer[i].setAttribute("src", vidDefer[i].getAttribute("data-src"));
    }
  }
}

init();

window.onload = init;

var swiper = new Swiper(".mySwiper", {
  loop: true,
  navigation: {
    nextEl: ".swiper-button-next",
    prevEl: ".swiper-button-prev",
  },
});

function hideAllModals(exclude) {
  const modals = ["#exampleModal", "#exampleModalPhone", "#myModalDesigner"];
  modals.forEach((modal) => {
    if (modal !== exclude && $(modal).hasClass("show")) {
      $(modal).modal("hide");
    }
  });
}
$('[data-target="#myModalDesigner"]').click(function () {
  hideAllModals("#myModalDesigner");
});

$('[data-target="#exampleModal"]').click(function () {
  hideAllModals("#exampleModal");
});

$('[data-target="#exampleModalPhone"]').click(function () {
  hideAllModals("#exampleModalPhone");
});

$(document).on("click", function (e) {
  var target = $(e.target);
  var actionButton = $(".action-button");
  var time = 100;

  if (!target.closest(".action-button").length) {
    actionButton.removeClass("open");
    actionButton.find(".action-list li").animate(
      {
        opacity: 0,
      },
      time
    );
  }
});
$("[data-href]").click(function () {
  var $this = $(this);
  var hrefLink = $this.data("href");
  window.open(hrefLink, "_blank");
});

$(".action-button.triangle p").click(function () {
  $(this).parent().toggleClass("open");
  if ($(this).parent().hasClass("open")) {
    for (var i = 0; i <= $(this).parent().find(".action-list li").length; i++) {
      $(this).parent().find(".action-list li").eq(i).css("opacity", "1");
    }
  } else {
    for (var i = 0; i <= $(this).parent().find(".action-list li").length; i++) {
      $(this).parent().find(".action-list li").eq(i).css("opacity", "0");
    }
    $(".action-button li").removeClass("active");
  }
});

var swiper = new Swiper(".mySwiperproduct", {
  slidesPerView: 1,
  /*autoplay: {
  delay: 2500,
  disableOnInteraction: false,
},*/
  pagination: {
    el: ".swiper-pagination",
    clickable: true,
  },
  navigation: {
    nextEl: ".swiper-button-next",
    prevEl: ".swiper-button-prev",
  },
  breakpoints: {
    640: {
      slidesPerView: 2,
    },
    768: {
      slidesPerView: 3,
    },
    1024: {
      slidesPerView: 4,
      slidesPerGroup: 4,
    },
  },
});
var swiper = new Swiper(".mySwipercollection", {
  slidesPerView: 1,

  pagination: {
    el: ".swiper-pagination",
    clickable: true,
    dynamicBullets: true,
  },
  navigation: {
    nextEl: ".swiper-button-next",
    prevEl: ".swiper-button-prev",
  },
  coverflowEffect: {
    rotate: 4,
    slideShadows: false,
  },
  breakpoints: {
    640: {
      slidesPerView: 2,
    },
    768: {
      slidesPerView: 3,
    },
    1024: {
      slidesPerView: 4,
      slidesPerGroup: 4,
    },
  },
});

$(".popup-div-close-one").click(function () {
  var $this = $(this);
  $(".popup-div-one").fadeOut();
  $(".popup-div-bg").fadeOut();
});
$("body").click(function () {
  var $this = $(this);
  $(".popup-div").fadeOut();
  $(".popup-div-bg").fadeOut();
  $(".popup-div-one").fadeOut();
});

var swiper = new Swiper(".mySwiper3", {
  loop: true,
  navigation: {
    nextEl: ".swiper-button-next",
    prevEl: ".swiper-button-prev",
  },
});

var swiper = new Swiper("#custom-swiper", {
  slidesPerView: 3,
  spaceBetween: 0,
  centeredSlides: true,
  loop: true,
  navigation: {
    nextEl: ".swiper-button-next",
    prevEl: ".swiper-button-prev",
  },
  breakpoints: {
    320: {
      slidesPerView: 1,
    },
    768: {
      slidesPerView: 2,
    },
    1024: {
      slidesPerView: 3,
    },
  },
});
