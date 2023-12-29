$(function () {
  $("#navbarToggle").blur(function (event) {
    var screenWidth = window.innerWidth;
    if (screenWidth < 768) {
      $("#collapsable-nav").collapse('hide');
    }
  });
});

(function (global) {
  var dc = {};

  var homeHtmlUrl = "snippets/home-snippet.html";
  var allCategoriesUrl = "https://coursera-jhu-default-rtdb.firebaseio.com/categories.json";
  var categoriesTitleHtml = "snippets/categories-title-snippet.html";
  var categoryHtml = "snippets/category-snippet.html";
  var menuItemsUrl = "https://coursera-jhu-default-rtdb.firebaseio.com/menu_items.json";
  var menuItemsTitleHtml = "snippets/menu-items-title.html";
  var menuItemHtml = "snippets/menu-item.html";

  // Convenience function for inserting innerHTML for 'select'
  var insertHtml = function (selector, html) {
    var targetElem = document.querySelector(selector);
    targetElem.innerHTML = html;
  };

  // Show loading icon inside element identified by 'selector'.
  var showLoading = function (selector) {
    var html = "<div class='text-center'>";
    html += "<img src='images/ajax-loader.gif'></div>";
    insertHtml(selector, html);
  };

  // Return substitute of '{{propName}}'
  // with propValue in given 'string'
  var insertProperty = function (string, propName, propValue) {
    var propToReplace = "{{" + propName + "}}";
    string = string.replace(new RegExp(propToReplace, "g"), propValue);
    return string;
  };

  // Remove the class 'active' from home and switch to Menu button
  var switchMenuToActive = function () {
    var classes = document.querySelector("#navHomeButton").className;
    classes = classes.replace(new RegExp("active", "g"), "");
    document.querySelector("#navHomeButton").className = classes;

    classes = document.querySelector("#navMenuButton").className;
    if (classes.indexOf("active") === -1) {
      classes += " active";
      document.querySelector("#navMenuButton").className = classes;
    }
  };

  // Global variable to store the chosen category and image
  var chosenCategory;
  var chosenMenuImage;
  var chosenSpecialsImage;

  // On page load (before images or CSS)
  document.addEventListener("DOMContentLoaded", function (event) {
    showLoading("#main-content");
    $ajaxUtils.sendGetRequest(
      allCategoriesUrl,
      buildAndShowHomeHTML,
      true
    );
  });

  // Builds HTML for the home page based on categories array
  // returned from the server.
  function buildAndShowHomeHTML(categories) {
    $ajaxUtils.sendGetRequest(
      homeHtmlUrl,
      function (homeHtml) {
        chosenCategory = chooseRandomCategory(categories);
        chosenMenuImage = getRandomImage(); // Get a random image for menu
        chosenSpecialsImage = getRandomImage(); // Get a random image for specials

        var homeHtmlToInsertIntoMainPage = insertProperty(homeHtml, 'randomCategoryShortName', chosenCategory.short_name);
        homeHtmlToInsertIntoMainPage = insertProperty(homeHtmlToInsertIntoMainPage, 'menuImage', chosenMenuImage);
        homeHtmlToInsertIntoMainPage = insertProperty(homeHtmlToInsertIntoMainPage, 'specialsImage', chosenSpecialsImage);

        insertHtml("#main-content", homeHtmlToInsertIntoMainPage);

        // Adding click event for the Specials tile
        document.getElementById('specialsTile').addEventListener('click', function () {
          showLoading("#main-content");
          chosenCategory = chooseRandomCategory(categories); // Choose a new category
          chosenMenuImage = getRandomImage(); // Get a new random image for menu
          chosenSpecialsImage = getRandomImage(); // Get a new random image for specials
          loadSingleCategory(chosenCategory.short_name);
        });

        // Adding click event for the restaurant logo to go back to the home page
        document.getElementById('logo').addEventListener('click', function () {
          showLoading("#main-content");
          insertHtml("#main-content", homeHtmlToInsertIntoMainPage);
        });
      },
      false
    );
  }

  // Function to get a random image from the 'images' folder
  function getRandomImage() {
    var imageFolder = 'images/';
    var imageFiles = ['image1.jpg', 'image2.jpg', 'image3.jpg', /* add more image filenames */];
    var randomImageIndex = Math.floor(Math.random() * imageFiles.length);
    return imageFolder + imageFiles[randomImageIndex];
  }

  // ... (existing code)
})(window);
