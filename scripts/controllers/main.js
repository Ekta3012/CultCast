'use strict';

/**
 * @ngdoc function
 * @name castCultApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the castCultApp
 */
angular.module('castCultApp')
  .controller('MainCtrl', function ($scope, localStorageService, $http, appSetting, $location, toaster) {
      $scope.baseUrl = appSetting.apiBaseUrl;
      $scope.getPosts = function () {
          $scope.pageNo = 1;
          $scope.posts = [];
          $http.get($scope.baseUrl + "api/Posts/GetGeneralPosts?pageNo=1"
          ).then(function (response) {
              if (response.status == 200) {
                  $scope.posts = response.data;
                  $scope.currentPost = $scope.posts;
                  //console.log($scope.posts)
                  
              }
          })
      }

      $scope.loadMore = function (pageNo) {
          $scope.pageNo += 1;
          $http.get($scope.baseUrl + "api/Posts/GetGeneralPosts?pageNo=" + $scope.pageNo
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
     
      $scope.getPosts();

  });
