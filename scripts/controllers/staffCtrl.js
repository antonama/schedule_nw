/**
 * Created by Anton on 5/22/2015.
 */

angular.module("editor")
    .controller("StaffCtrl", function ($scope, $timeout, iScrolls, rfeStaff, cfpLoadingBar, rfeSettings) {
        cfpLoadingBar.start();

        $scope.deleteItem = function (person) {
            rfeStaff.delete(person).then(function () {
                update();
            });
        };

        $scope.editItem = function (person) {
            $scope.clearItem({
                show: true
            });
            $scope.newStaffItem = angular.copy(person);
            iScrolls.get("contentIScroll").scrollTo(0, 0);
            $timeout(function () {
                iScrolls.get("contentIScroll").refresh();
                cfpLoadingBar.complete();
            }, 500);
        };

        function update () {
            rfeStaff.getAll().then(function (staff) {
                $scope.filteredStaffItems = staff;
                $scope.staffItems = staff;

                $timeout(function () {
                    iScrolls.get("contentIScroll").refresh();
                    cfpLoadingBar.complete();
                }, 500);
            });
        }

        update();
        $scope.searchExpr = "";
        $scope.$watch("searchExpr", function () {
            if (iScrolls.get("contentIScroll")) {
                $timeout(function () {
                    iScrolls.get("contentIScroll").refresh();
                }, 250);
            }
        });

        $scope.$watch("newItemIsShown", function () {
            if (iScrolls.get("contentIScroll")) {
                $timeout(function () {
                    iScrolls.get("contentIScroll").refresh();
                }, 250);
            }
        });

        $scope.saveItem = function () {
            rfeStaff.save($scope.newStaffItem).then(function () {
                $scope.clearItem({
                    show: false
                });
            }).finally(function () {
                update();
            })
        };

        $scope.clearItem = function (options) {
            options.show ? $scope.newItemIsShown = true : $scope.newItemIsShown = false;

            $scope.newStaffItem = {
                name: {
                    full: "",
                    first: "",
                    surname: "",
                    patronymic: "",
                    initials: ""
                },
                position: "",
                rank: "",
                avatar: ""
            };
        };

        $scope.clearItem({
            show: false
        });
    });