'use strict';

/**
 * @ngdoc overview
 * @name castCultApp
 * @description
 * # castCultApp
 *
 * Main module of the application.
 */

var app = angular
  .module('castCultApp', [
    'ngRoute', 'angucomplete', 'summernote', 'LocalStorageModule', 'ngSanitize', 'angular-loading-bar', 'toaster', 'ngAnimate','ngLetterAvatar'
  ]);
app.run(function (localStorageService, $location, $rootScope, $http, appSetting) {
    if (!localStorageService.get("token")) {
        $rootScope.isAuthenticated = false;
    }
    else {
        $rootScope.isAuthenticated = true;
        $http.get(appSetting.apiBaseUrl + "api/Accounts/GetUser", {
            headers: { 'Authorization': 'Bearer ' + localStorageService.get("token") }
        }).then(function (response) {
            if (response.status == 200) {
                $rootScope.user = response.data;

            }
        })
    }
    $rootScope.logOut = function () {
        localStorageService.clearAll();
        $rootScope.isAuthenticated = false;
        $location.path("/");

    }
    $rootScope.search = function (query) {
        $location.path("/search/" + query);

    }

})
app.filter('ellipsis', function () {
    return function (text, length) {
        if (text.length > length) {
            return text.substr(0, length) + "<a href='#'>...</a>";
        }
        return text;
    }
});

var apiBase = "http://ec2-52-38-224-62.us-west-2.compute.amazonaws.com:82/";
//var apiBase = "http://localhost:51598/";
app.value("appSetting", {
    "apiBaseUrl": apiBase
});

app.config(function ($routeProvider) {
    $routeProvider
      .when('/', {
          templateUrl: 'views/main.html',
          controller: 'MainCtrl',
          controllerAs: 'main'
      })
        .when('/post/:id', {
            templateUrl: 'views/post.html',
            controller: 'getPost'

        })
        .when('/search/:query', {
            templateUrl: 'views/search.html',
            controller: 'searchPosts'
        })
      .when('/about', {
          templateUrl: 'views/about.html',
          controller: 'AboutCtrl',
          controllerAs: 'about'
      })
        .when('/seeposts', {
            templateUrl: 'views/seeposts.html',
            controller: 'getUserPosts',
            resolve: {
                "check": function ($rootScope, $location) {
                    if (!$rootScope.isAuthenticated) {
                        $location.path("login");
                    }
                }
            }
        })
      .when('/addpost', {
          templateUrl: 'views/addpost.html',
          controller: 'PostCtrl',
          controllerAs: 'post',
          resolve: {
              "check": function ($rootScope, $location) {
                  if (!$rootScope.isAuthenticated) {
                      $location.path("login");
                  }
              }
          }
      })
      .when('/login', {
          templateUrl: 'views/login.html',
          controller: 'UserCtrl',
          controllerAs: 'login',
          resolve: {
              "check": function ($rootScope, $location) {
                  if ($rootScope.isAuthenticated) {
                      $location.path("/");
                  }
              }
          }
      })
        .when('/signup', {
            templateUrl: 'views/signup.html',
            controller: 'UserCtrl',
            controllerAs: 'about',
            resolve: {
                "check": function ($rootScope, $location) {
                    if ($rootScope.isAuthenticated) {
                        $location.path("/");
                    }
                }
            }
        })
      .otherwise({
          redirectTo: '/'
      });
});
