/**
 * Created by Anton on 5/22/2015.
 */

angular.module("editor")
    .controller("SettingsCtrl", function ($scope, rfeSettings, cfpLoadingBar) {
        $scope.rfeSettings = rfeSettings;
        cfpLoadingBar.start();

        $scope.saveItem = function (item) {
            rfeSettings.save(item).then(function () {
                update();
            })
        };

        $scope.cancel = function () {
            $scope.buttonsIsShown = false
        };

        $scope.publishScheduleInInternet = function () {
            $scope.publishSchedule.value = $scope.publishSchedule.value ? "true" : "false";
            rfeSettings.save($scope.publishSchedule).then(function () {
                update();
            });
        };

        function update () {
            rfeSettings.getAll().then(function (settings) {
                $scope.settings = settings.filter(function (item) {
                    return item.uniqueId !== 'publishSchedule';
                });

                $scope.publishSchedule = settings.filter(function (item) {
                    return item.uniqueId === 'publishSchedule';
                }).pop();
                $scope.publishSchedule.value = $scope.publishSchedule.value === "true" ? true : false;

                cfpLoadingBar.complete();
            });
        }

        update();
    });