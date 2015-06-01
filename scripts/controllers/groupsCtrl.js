/**
 * Created by Anton on 5/22/2015.
 */

angular.module("editor")
    .controller("GroupsCtrl", function ($scope, $timeout, rfeGroups, cfpLoadingBar, iScrolls) {
        $scope.newGroupItem = {
            title: '',
            year: ''
        };

        $scope.saveItem = function () {
            rfeGroups.save($scope.newGroupItem).then(function () {
                update();
            })
        };

        function update () {
            cfpLoadingBar.start();

            rfeGroups.getYears().then(function (years) {
                $scope.years = years;
                cfpLoadingBar.complete();

                $timeout(function () {
                    iScrolls.get("contentIScroll").refresh();
                    cfpLoadingBar.complete();
                }, 500);
            });
        }

        $scope.delete = function (item) {
            rfeGroups.delete(item).then(function () {
                update();
            });
        };

        update();
    });