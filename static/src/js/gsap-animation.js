gsap.registerPlugin(ScrollTrigger, SplitText);
gsap.config({
  nullTargetWarn: false,
  trialWarn: false,
});
/*----  Functions  ----*/
function pbmit_img_animation() {
  const boxes = gsap.utils.toArray(
    ".pbmit-animation-style1,.pbmit-animation-style2,.pbmit-animation-style3,.pbmit-animation-style4,.pbmit-animation-style5,.pbmit-animation-style6,.pbmit-animation-style7"
  );
  boxes.forEach((img) => {
    gsap.to(img, {
      scrollTrigger: {
        trigger: img,
        start: "top 70%",
        end: "bottom bottom",
        toggleClass: "active",
        once: true,
      },
    });
  });
}

// function getpercentage(x, y, elm) {
//   elm.find(".pbmit-fid-inner").html(y + "/" + x);
//   var cal = Math.round((y * 100) / x);
//   return cal;
// }

function pbmit_title_animation() {
  console.log("running");
  ScrollTrigger.matchMedia({
    "(min-width: 1025px)": function () {
      var pbmit_var = jQuery(".pbmit-heading, .pbmit-heading-subheading");
      if (!pbmit_var.length) {
        return;
      }
      const quotes = document.querySelectorAll(
        ".pbmit-heading-subheading .pbmit-title, .pbmit-heading .pbmit-title"
      );

      quotes.forEach((quote) => {
        //Reset if needed
        if (quote.animation) {
          quote.animation.progress(1).kill();
          quote.split.revert();
        }

        var getclass = quote.closest(
          ".pbmit-heading-subheading, .pbmit-heading"
        ).className;
        var animation = getclass.split("animation-");
        if (animation[1] == "style4") return;

        quote.split = new SplitText(quote, {
          type: "lines,words,chars",
          linesClass: "split-line",
        });

        gsap.set(quote, { perspective: 400 });
        if (animation[1] == "style1") {
          gsap.set(quote.split.chars, {
            opacity: 0,
            y: "90%",
            rotateX: "-40deg",
          });
        }
        if (animation[1] == "style2") {
          gsap.set(quote.split.chars, {
            opacity: 0,
            x: "50",
          });
        }
        if (animation[1] == "style3") {
          gsap.set(quote.split.chars, {
            opacity: 0,
          });
        }
        quote.animation = gsap.to(quote.split.chars, {
          scrollTrigger: {
            trigger: quote,
            start: "top 90%",
          },
          x: "0",
          y: "0",
          rotateX: "0",
          opacity: 1,
          duration: 1,
          ease: Back.easeOut,
          stagger: 0.02,
        });
      });
    },
  });
}

function pbmit_extend_section() {
  const pbmit_elm = gsap.utils.toArray(".pbmit-extend-animation");
  if (pbmit_elm.length == 0) return;
  ScrollTrigger.matchMedia({
    "(min-width: 1200px)": function () {
      pbmit_elm.forEach((section) => {
        let tl = gsap.timeline({
          scrollTrigger: {
            trigger: section,
            start: "top 50%",
            end: "+=400px",
            scrub: 1,
          },
          defaults: { ease: "none" },
        });
        tl.fromTo(
          section,
          { clipPath: "inset(0% 5% 0% 5% round 30px)" },
          { clipPath: "inset(0% 0% 0% 0% round 0px)", duration: 1.5 }
        );
      });
    },
  });
}

function pbmit_animate_custom_text() {
  jQuery("#js-rotating").Morphext({
    animation: "flipInX",
    speed: 3000,
  });
}

function pbmit_ihbox_move() {
  var pbmit_var = jQuery(".pbmit-move-sofa");
  if (!pbmit_var.length) {
    return;
  }
  ScrollTrigger.matchMedia({
    "(min-width: 1200px)": function () {
      gsap.set(".pbmit-move-sofa", { yPercent: 20 });

      gsap.to(".pbmit-move-sofa", {
        yPercent: -50,
        scrollTrigger: {
          scrub: true,
          start: () => "top top",
          end: () => "bottom top",
          scrub: 2,
        },
      });
    },
    "(max-width:1200px)": function () {
      ScrollTrigger.getAll().forEach((scrub) => scrub.kill(true));
    },
  });
}

function pbmit_sticky() {
  ScrollTrigger.matchMedia({
    "(min-width: 1200px)": function () {
      let pbmit_sticky_container = jQuery(".pbmit-sticky-col");
      let section = pbmit_sticky_container.closest("section");
      if (!section[0]) {
        section = pbmit_sticky_container.closest(".pbmit-sticky-section");
      }
      let tl = gsap.timeline({
        scrollTrigger: {
          pin: pbmit_sticky_container,
          scrub: 1,
          start: "top top",
          trigger: section,
          end: () => "+=" + (section.height() + 150 - window.innerHeight),
          invalidateOnRefresh: true,
        },
        defaults: { ease: "none", duration: 1 },
      });
    },
  });
}

var pbmit_active_hover = function () {
  var pbmit_var = jQuery(
    ".pbmit-element-portfolio-style-4,.pbmit-element-static-box-style-2"
  );

  if (!pbmit_var.length) {
    return;
  }

  pbmit_var.each(function () {
    var pbmit_Class =
      ".swiper-hover-slide-nav .swiper-slide,.pbmit-hover-inner li";
    jQuery(this).find(pbmit_Class).first().addClass("pbmit-active");
    jQuery(this)
      .find(pbmit_Class)
      .on("mouseover", function () {
        jQuery(this)
          .addClass("pbmit-active")
          .siblings()
          .removeClass("pbmit-active");
      });
  });
};

var pbmit_staticbox_hover_slide = function () {
  if (typeof Swiper !== "undefined") {
    var pbmit_hover = new Swiper(".pbmit-static-image", {
      speed: 6000,
      effect: "fade",
    });
    jQuery(".pbmit-main-static-slider li").on("mouseover", function (e) {
      e.preventDefault();
      var myindex = jQuery(this).index();
      pbmit_hover.slideTo(myindex, 1000, false);
    });
  }
};

function pbmit_staticbox_hover() {
  var pbmit_var = jQuery(".pbmit-element-static-box-style-1");
  if (!pbmit_var.length) {
    return;
  }
  pbmit_var.each(function () {
    var pbmit_Class =
      " .swiper-static-slide-nav li, .pbmit-hover-inner li, .pbmit-static-box-style-1";
    jQuery(this).find(pbmit_Class).first().addClass("pbmit-active");
    jQuery(this)
      .find(pbmit_Class)
      .on("mouseover", function () {
        jQuery(this)
          .addClass("pbmit-active")
          .siblings()
          .removeClass("pbmit-active");
      });
  });
}

function pbmit_set_tooltip() {
  $("[data-cursor-tooltip]").each(function () {
    var thisele = $(this);
    var thisele_html = thisele.find(".pbminfotech-box-content").html();
    thisele.attr("data-cursor-tooltip", thisele_html);
  });
}

ScrollTrigger.matchMedia({
  "(max-width: 1200px)": function () {
    ScrollTrigger.getAll().forEach((t) => t.kill());
  },
});

// on ready
jQuery(document).ready(function () {
  pbmit_title_animation();
  pbmit_ihbox_move();
  pbmit_active_hover();
  pbmit_staticbox_hover_slide();
  pbmit_staticbox_hover();
});

// on resize
jQuery(window).resize(function () {
  pbmit_title_animation();
  pbmit_img_animation();
});

// on load
jQuery(window).on("load", function () {
  pbmit_extend_section();
  pbmit_img_animation();
  pbmit_sticky();
  pbmit_animate_custom_text();

  jQuery("[data-magnetic]").each(function () {
    new Magnetic(this);
  });
  gsap.delayedCall(1, () =>
    ScrollTrigger.getAll().forEach((t) => {
      t.refresh();
    })
  );

  setTimeout(cleaning, 500);
  function cleaning() {
    ScrollTrigger.refresh();
  }
});
