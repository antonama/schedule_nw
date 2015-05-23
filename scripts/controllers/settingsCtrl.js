/**
 * Created by Anton on 5/22/2015.
 */

angular.module("editor")
    .controller("SettingsCtrl", function ($scope, rfeSettings, cfpLoadingBar) {
        cfpLoadingBar.start();

        $scope.saveItem = function (item) {
            rfeSettings.save(item).then(function () {
                update();
            })
        };

        $scope.cancel = function () {
            $scope.buttonsIsShown = false
        };

        function update () {
            rfeSettings.getAll().then(function (settings) {
                $scope.settings = settings;
                cfpLoadingBar.complete();
            });
        }

        update();
    });