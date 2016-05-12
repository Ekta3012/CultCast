'use strict';

/**
 * Controller of the castCultApp
 */
angular.module('castCultApp')
  .controller('getUserPosts', function ($scope, $http, appSetting, localStorageService, $location, $rootScope) {

      $scope.baseUrl = appSetting.apiBaseUrl;
      $scope.pageNo = 1;

      $scope.getPosts = function () {
          $http.get($scope.baseUrl + "api/Posts/GetUserPosts?pageNo=1", {
              headers: { 'Authorization': 'Bearer ' + localStorageService.get("token") }
          }).then(function (response) {
              if (response.status == 200) {
                  $scope.posts = response.data;
                  $scope.currentPost = $scope.posts;
              }
          })
      }

      $scope.loadMore = function (pageNo) {
          $scope.pageNo += 1;
          $http.get($scope.baseUrl + "api/Posts/GetUserPosts?pageNo=" + $scope.pageNo
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
