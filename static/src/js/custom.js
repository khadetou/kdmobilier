var swiper = new Swiper(".mySwiper", {
  lazy: true,
  observer: true,
  observeParents: true,
  parallax: true,
  loop: true,
  pagination: {
    el: ".swiper-pagination",
    clickable: true,
  },
  navigation: {
    nextEl: ".swiper-button-next",
    prevEl: ".swiper-button-prev",
  },
});

document.addEventListener("DOMContentLoaded", function () {
  var pconElement = document.getElementById("pcon");
  if (pconElement) {
    pconElement.addEventListener("click", function () {
      var closeButton = document.getElementById("closeButton");
      var galeriElement = document.getElementById("galeri");
      if (closeButton && galeriElement) {
        closeButton.style.display = "inline";
        galeriElement.style.display = "block";
      }
    });
  }

  var closeButtonElement = document.getElementById("closeButton");
  if (closeButtonElement) {
    closeButtonElement.addEventListener("click", function () {
      closeButtonElement.style.display = "none";
      var pconPage = document.querySelector(".pcon-page");
      if (pconPage) {
        pconPage.classList.add("d-none");
      }
      var galeriElement = document.getElementById("galeri");
      if (galeriElement) {
        galeriElement.style.display = "none";
      }
    });
  }
});

document.addEventListener("DOMContentLoaded", function () {
  var galeriButton = document.getElementById("galeri-button");
  var galeriContent = document.getElementById("galeri-target");

  if (galeriButton && galeriContent) {
    galeriButton.addEventListener("click", function () {
      galeriContent.style.display = "block";
      window.scrollTo({ top: galeriContent.offsetTop, behavior: "smooth" });
    });
  }
});

$("#pcon").click(function (e) {
  e.preventDefault();
  var $this = $(this);

  $(".pcon-page").removeClass("d-none");
});

$(document).on("submit", ".contact-form", function (e) {
  if (typeof grecaptcha !== "undefined") {
    var response = grecaptcha.getResponse();
    if (response.length == 0) {
      e.preventDefault();
      alert("Doğrulamayı yapınız.");
    }
  } else {
    // If grecaptcha is not defined, log error and continue form submission
    console.warn(
      "reCAPTCHA not loaded properly. Form will be submitted without verification."
    );
  }
});

$(document).on("submit", ".contact-form-designer", function (e) {
  if (typeof grecaptcha !== "undefined") {
    var response = grecaptcha.getResponse();
    if (response.length == 0) {
      e.preventDefault();
      alert("Doğrulamayı yapınız.");
    }
  } else {
    // If grecaptcha is not defined, log error and continue form submission
    console.warn(
      "reCAPTCHA not loaded properly. Form will be submitted without verification."
    );
  }
});

$("#bcartadd_1340").click(function (e) {
  e.preventDefault();
  var $this = $(this);
  var id = $this.data("id");
  var lang = $this.data("lang");
  $.ajax({
    url: "/ajax/sepete_ekle",
    type: "POST",
    data: { "data[Product][id]": id },
    success: function (data) {
      $(".basket-count").text(data);
      $(".basket-count").removeClass("d-none");

      $(".cart-image").attr("src", "/img/heade_tag__50_red.png");

      swal({
        title: "Teklif Sepetine Ürün Eklendi",
        type: "success",
        timer: 4000,
        html: "&nbsp;",
        focusConfirm: false,
        confirmButtonText: '<i class="fa fa-thumbs-up"></i> Tamam!',
        confirmButtonAriaLabel: " Tamam!",
        footer:
          '<a href="/tr/sepet" style="font-size:14px;text-decoration:none;"><i class="fa fa-tags"></i> Sepete Git</a>',
      }).then((willDelete) => {});
    },
    error: function (xhr, status, error) {
      console.error("AJAX isteği sırasında bir hata oluştu:", error);
    },
  });
});

$(".delete-basket").click(function () {
  var $this = $(this);
  var id = $this.data("id");

  $.ajax({
    url: "/ajax/sepet_sil",
    type: "POST",
    data: "data[Basket][id] =" + id,
    success: function (data) {
      if (data == "no") {
        alert("Başarısız !");
      } else {
        $(".basket-count").text(data);

        if (data == 0) {
          $(".basket-count").addClass("d-none");
          $(".empty-basket").removeClass("d-none");
          $this.closest(".basket-list").remove();
          $(".basket-form").remove();

          $(".cart-image").attr("src", "/img/heade_tag__50.png");
        } else {
          $(".basket-count").removeClass("d-none");
          $(".empty-basket").addClass("d-none");
          $this.closest(".collection-item").remove();
        }
      }
    },
    error: function (e) {},
  });
});

$(".update-count").click(function (e) {
  e.preventDefault();
  var $this = $(this);
  var id = $this.data("id");
  var count = $this.siblings('input[name="count"]').val(); // Doğru input elemanını seçmek

  console.log(count);

  $.ajax({
    url: "/ajax/update_count",
    type: "POST",
    data: {
      id: id,
      count: count,
    },
    success: function (data) {
      swal({
        title: "Ürün Sayısı Güncellendi.",
        type: "success",
        timer: 4000,
        html: "&nbsp;",
        focusConfirm: false,
        confirmButtonText: '<i class="fa fa-thumbs-up"></i> Devam Et!',
        confirmButtonAriaLabel: " Devam Et!",
      }).then((willDelete) => {
        // Başarı durumunda yapılacak işlemler (eğer varsa)
      });
    },
    error: function (xhr, status, error) {
      console.error("AJAX isteği sırasında bir hata oluştu:", error);
    },
  });
});
