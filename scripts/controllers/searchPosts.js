'use strict';

/**
 * Controller of the castCultApp
 */
angular.module('castCultApp')
  .controller('searchPosts', function ($scope, $http, appSetting, $routeParams, $location) {
      $scope.pageNo = 1;
      $scope.baseUrl = appSetting.apiBaseUrl;
      var query = $routeParams.query;
      $scope.query = query;
      var searchObject = $location.search();
      $http.get($scope.baseUrl + "api/Posts/SearchGeneralPosts?query=" + $scope.query + "&pageNo=1").then(function (response) {
          if (response.status == 200) {
              $scope.posts = response.data;
              $scope.currentPost = $scope.posts;

          }
      })

      $scope.loadMore = function (pageNo) {
          $scope.pageNo += 1;
          $http.get($scope.baseUrl + "api/Posts/SearchGeneralPosts?query=" + $scope.query + "&pageNo=" + $scope.pageNo
          ).then(function (response) {
              if (response.status == 200) {
                  $scope.currentPost = response.data;
                  for (var i = 0; i < response.data.length; i++) {
                      $scope.posts.push(response.data[i]);
                  }

                  //console.log($scope.posts)

              }
          })
      }

      $scope.goToPost = function (postId) {
          $location.path("/post/" + postId);
      }






  });
