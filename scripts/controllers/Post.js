'use strict';

/**
 * Controller of the castCultApp
 */
angular.module('castCultApp')
  .controller('PostCtrl', function ($scope, $http, appSetting, localStorageService, $location, $rootScope, toaster) {
      $scope.showStatus = false;
      $scope.baseUrl = appSetting.apiBaseUrl;
      $scope.tvseries = "";
      $scope.$watch('post.Tvseries', function (newValue, oldValue) {
          if (newValue) {
              $http.get($scope.baseUrl + "api/TvSeries/GetTvSeriesCharacters?id=" + newValue.originalObject.Id).then(function (response) {
                  $scope.characters = response.data.Cast;
                  $scope.showStatus = false;
              })
          }
      });


      $scope.getPosts = function () {
          console.log('Bearer ' + localStorageService.get("token"));
          $http.get($scope.baseUrl + "api/Posts/GetUserPosts", {
              headers: { 'Authorization': 'Bearer ' + localStorageService.get("token") }
          }).then(function (response) {
              if (response.status == 200) {
                  $scope.posts = response.data;
                 
              }
          })
      }

     

      $scope.addPost = function (post) {
          
          var post = {};
          post.Title = $scope.post.Title;
          post.Character = $scope.post.Character.originalObject.Character;
          post.CharacterImage = $scope.post.Character.originalObject.ProfilePath;
          post.TVSeries = $scope.post.Tvseries.originalObject.OriginalName;
          post.TVSeriesImage = $scope.post.Tvseries.originalObject.PosterPath;
          post.Title = $scope.post.Title;
          //post.Keywords = $scope.post.Tags.split(",");
          post.Content = $scope.post.postContent;
          if (post.Character != '' && post.TVSeries != '') {
              $http.post($scope.baseUrl + "api/Posts/Post", post, {
                  headers: { 'Authorization': 'Bearer ' + localStorageService.get("token") }
              }).then(function (response) {
                  if (response.status == 200) {
                      toaster.pop('success', "Done !!", "Your Post has been published");
                      $scope.post = {};
                  }
              })
          }
      }
  });
