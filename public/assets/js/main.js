// $(document).ready(function () {
//   const sidebarToggle = document.querySelector(".sidebar-toggle");

//   function sidebarCollapse(e) {
//     e.preventDefault();

//     document.querySelector(".sidebar").classList.toggle("collapsed");
//     document.querySelector(".contents").classList.toggle("expanded");
//   }
//   $(".sidebar-toggle").click(function () {
//     console.log("Tuiaans");
//   });

//   if (sidebarToggle) {
//     sidebarToggle.addEventListener("click", sidebarCollapse);
//   }

//   /* sidebar nav events */
//   $(".sidebar_nav .has-child ul").hide();
//   $(".sidebar_nav .has-child.open ul").show();
//   $(".sidebar_nav .has-child >a").on("click", function (e) {
//     e.preventDefault();
//     $(this).parent().next("has-child").slideUp();
//     $(this).parent().parent().children(".has-child").children("ul").slideUp();
//     $(this).parent().parent().children(".has-child").removeClass("open");
//     console.log($(this).next());
//     if ($(this).next().is(":visible")) {
//       $(this).parent().removeClass("open");
//     } else {
//       $(this).parent().addClass("open");
//       $(this).next().slideDown();
//     }
//   });

//   /* Header mobile view */
//   $(window)
//     .bind("resize", function () {
//       var screenSize = window.innerWidth;
//       if ($(this).width() <= 767.98) {
//         $(".navbar-right__menu").appendTo(".mobile-author-actions");
//         $(".search-form").appendTo(".mobile-search");
//         $(".contents").addClass("expanded");
//         $(".sidebar ").addClass("collapsed");
//       }
//     })
//     .trigger("resize");

//   $(window)
//     .bind("resize", function () {
//       var screenSize = window.innerWidth;
//       if ($(this).width() > 767.98) {
//         $(".atbd-mail-sidebar").addClass("show");
//       }
//     })
//     .trigger("resize");
//   $(window)
//     .bind("resize", function () {
//       var screenSize = window.innerWidth;
//       if ($(this).width() <= 991) {
//         $(".sidebar").addClass("collapsed");
//         $(".sidebar-toggle").on("click", function () {
//           $(".overlay-dark-sidebar").toggleClass("show");
//         });
//         $(".overlay-dark-sidebar").on("click", function () {
//           console.log($(this));
//           $(this).removeClass("show");
//           $(".sidebar").addClass("collapsed");
//         });
//       }
//     })
//     .trigger("resize");
// });
