'use strict';

/**
 * Controller of the castCultApp
 */
angular.module('castCultApp')
  .controller('getPost', function ($scope, $http, appSetting, $routeParams, localStorageService, toaster) {
      $scope.baseUrl = appSetting.apiBaseUrl;
      var id = $routeParams.id;
      $http.get($scope.baseUrl + "api/Posts/GetPost/" + id).then(function (response) {
          if (response.status == 200) {
              //console.log(response);
              $scope.post = response.data;

          }
      })
      $scope.comment = {};

      $scope.postComment = function () {
          $scope.comment.PostId = id;
          $http.post($scope.baseUrl + "api/Posts/PostComment", $scope.comment, {
              headers: { 'Authorization': 'Bearer ' + localStorageService.get("token") }
          }).then(function (response) {
              if (response.status == 200) {
                  toaster.pop('success', "Done !!", "Your Comment has been Posted");
                  $scope.comment = {};
                  $http.get($scope.baseUrl + "api/Posts/GetPostComments/" + id).then(function (response) {
                      if (response.status == 200) {
                          //console.log(response);
                          $scope.post.Comments = response.data;
                         

                      }
                  })

              }
          })
          }






  });
