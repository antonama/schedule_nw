/**
 * Created by Anton on 5/22/2015.
 */

angular.module("editor")
    .controller("AsideClassesCtrl", function ($scope, $timeout, rfeClasses, iScrolls) {
        rfeClasses.getAll().then(function (classes) {
            $scope.classItems = classes;

            $timeout(function () {
                iScrolls.get("asideIScroll").refresh();
            }, 500);
        });

        $scope.$watch("searchExpr", function () {
            if (iScrolls.get("asideIScroll")) {
                $timeout(function () {
                    iScrolls.get("asideIScroll").refresh();
                }, 250);
            }
        });
    });