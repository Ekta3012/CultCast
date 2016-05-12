'use strict';

/**
 * Controller of the castCultApp
 */
angular.module('castCultApp')
  .controller('UserCtrl', function ($scope, $http, appSetting, localStorageService, $location, $rootScope, toaster) {
      $scope.baseUrl = appSetting.apiBaseUrl;



      $scope.signup = function () {
          $http.post($scope.baseUrl + "api/Accounts/Register", $scope.signupData).then(function (response) {
              console.log(response);
              if (response.status == 200) {
                  $scope.loginData = {};
                  $scope.loginData.Email = $scope.signupData.Email;
                  $scope.loginData.Password = $scope.signupData.Password;
                  $scope.grantAccess();
                  $scope.signupData = "";
                  toaster.pop('success', "Done !!", "Registration Successfull.You are being redireded");
                  //setTimeout(function () {
                  //    $location.path("/");
                  //}, 2000);

              }
          }, function (response) {
              if (response.status == 302) {
                  toaster.pop('error', "Error", "Email already registered.");
              }
              else {
                  toaster.pop('error', "Error", "An Error has occured.Please try again after sometime.");
              }
              

          });
      }

      $scope.grantAccess = function () {
          var data = { "username": $scope.loginData.Email, "password": $scope.loginData.Password, "grant_type": 'password' };
          $http({
              method: 'POST',
              url: $scope.baseUrl + "auth/token",
              headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
              data: data,
              transformRequest: function (obj) {
                  var str = [];
                  for (var p in obj)
                      str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
                  return str.join("&");
              }
          }).then(function (response) {
              if (response.status == 200) {
                  localStorageService.set("token", response.data.access_token);
                  $rootScope.isAuthenticated = true;
                  $http.get($scope.baseUrl + "api/Accounts/GetUser", {
                      headers: { 'Authorization': 'Bearer ' + localStorageService.get("token") }
                  }).then(function (response) {
                      if (response.status == 200) {
                          $rootScope.user = response.data;
                          console.log("Yeah !!")
                          console.log($rootScope.user);
                      }
                  })
                  $location.path("/");
              }

          }, function (error) {
              if (error.data.error_description) {
                  toaster.pop('error', "Error", error.data.error_description);
              }
              else {
                  toaster.pop('error', "Error", "An Error has occured.Please try again after sometime.");
              }
          });
      }


      $scope.getPassword = function () {
          $http.post($scope.baseUrl + "api/Accounts/GetPassword", $scope.forgetPasswordData).then(function (response) {
              if (response.status == 200) {
                  toaster.pop('success', "Done !!", "Password has been sent to the email");
                  //setTimeout(function () {
                  //    $location.path("/");
                  //}, 2000);

              }
          }, function (response) {
              if (response.status == 404) {
                  toaster.pop('error', "Error", "Email not registered.");
              }


          });
      }










  });
