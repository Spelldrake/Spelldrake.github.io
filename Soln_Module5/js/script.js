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
  var menuItemsUrl = "https://coursera-jhu-default-rtdb.firebaseio.com/menu_items/";
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

  // Global variable to store the chosen category
  var chosenCategory;

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
        var chosenCategoryShortName = chosenCategory.short_name;

        var homeHtmlToInsertIntoMainPage = insertProperty(homeHtml, 'randomCategoryShortName', chosenCategoryShortName);

        insertHtml("#main-content", homeHtmlToInsertIntoMainPage);

        // Adding click event for the Specials tile
        document.getElementById('specialsTile').addEventListener('click', function () {
          showLoading("#main-content");
          chosenCategory = chooseRandomCategory(categories); // Choose a new category
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

  // Load a single category page based on the category short name
  function loadSingleCategory(categoryShortName) {
    $ajaxUtils.sendGetRequest(
      menuItemsUrl + categoryShortName + ".json",
      function (categoryData) {
        $ajaxUtils.sendGetRequest(
          menuItemsTitleHtml,
          function (menuItemsTitleHtml) {
            $ajaxUtils.sendGetRequest(
              menuItemHtml,
              function (menuItemHtml) {
                switchMenuToActive();

                var menuItemsViewHtml =
                  buildMenuItemsViewHtml(categoryData, menuItemsTitleHtml, menuItemHtml);
                insertHtml("#main-content", menuItemsViewHtml);
              },
              false
            );
          },
          false
        );
      },
      true
    );
  }

  // Given array of category objects, returns a random category object.
  function chooseRandomCategory(categories) {
    var randomArrayIndex = Math.floor(Math.random() * categories.length);
    return categories[randomArrayIndex];
  }

  // ... (existing code)
})(window);
