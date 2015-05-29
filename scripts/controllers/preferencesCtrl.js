/**
 * Created by Anton on 5/28/2015.
 */

angular.module("editor")
    .controller("PreferencesCtrl", function ($scope, $timeout, rfePreferences, rfeSettings, iScrolls, cfpLoadingBar) {
        cfpLoadingBar.start();

        $scope.moment = moment;

        rfePreferences.getAll().then(function (preferences) {
            $scope.filteredPreferenceItems = preferences;
            $scope.preferences = preferences;

            cfpLoadingBar.complete();
            $scope.clear();
        });

        rfeSettings.getItemByUniqueId("maxClassesInDay").then(function (classesInDayDb) {
            $scope.classesInDay = parseInt(classesInDayDb, 10);
            $timeout(function () {
                iScrolls.get("contentIScroll").refresh();
            }, 250);
        });

        $scope.clear = function () {
            $scope.newItemIsShown = false;
            $scope.newPreferenceItem = {};
            $timeout(function () {
                iScrolls.get("contentIScroll").refresh();
            }, 250);
        };

        $scope.edit = function (item) {
            $scope.newItemIsShown = true;
            $scope.newPreferenceItem = item || {
                    lecturer: {},
                    dos: []
                };
            $timeout(function () {
                iScrolls.get("contentIScroll").refresh();
            }, 250);
        }

    });