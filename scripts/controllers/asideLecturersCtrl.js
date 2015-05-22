/**
 * Created by Anton on 5/22/2015.
 */

angular.module("editor")
    .controller("AsideLecturersCtrl", function ($scope, $timeout, iScrolls, cfpLoadingBar, rfeStaff) {
        cfpLoadingBar.start();

        rfeStaff.getAll().then(function (staff) {
            $scope.staffItems = staff;
            $scope.filteredStaffItems = staff;

            $timeout(function () {
                iScrolls.get("asideIScroll").refresh();
                cfpLoadingBar.complete();
            }, 500);
        });

        $scope.searchExpr = "";

        $scope.$watch("searchExpr", function () {
            if (iScrolls.get("asideIScroll")) {
                $timeout(function () {
                    iScrolls.get("asideIScroll").refresh();
                }, 250);
            }
        });
    });