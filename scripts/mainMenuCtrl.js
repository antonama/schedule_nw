/**
 * Created by Anton on 4/22/2015.
 */

angular.module("editor")
.controller("mainMenuCtrl", function ($scope, $state, $rootScope, iScrolls) {
        $scope.$state = $state;
        $rootScope.$on("$stateChangeSuccess", function () {
            iScrolls.get("asideIScroll").scrollTo(0, 0);
        });
    });