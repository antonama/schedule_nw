/**
 * Created by Anton on 5/22/2015.
 */

angular.module("editor")
    .controller("AsideClassesCtrl", function ($scope, $timeout, rfeClasses, solver, iScrolls, $rootScope) {
        $scope.$on("yearSelected", function (event, year) {
            rfeClasses.getAllForYear(year).then(function (classes) {
                $scope.classItems = classes;

                $timeout(function () {
                    iScrolls.get("asideIScroll").refresh();
                }, 500);
            });
        });

        $scope.$watch("searchExpr", function () {
            if (iScrolls.get("asideIScroll")) {
                $timeout(function () {
                    iScrolls.get("asideIScroll").refresh();
                }, 250);
            }
        });

        $scope.customClassModel = {};
        $scope.onStart = function ($event) {
            var draggableScope = angular.element($event.target).scope();
            $scope.customClassModel = {
                title: draggableScope.class.title,
                lecturer: draggableScope.lecturer,
                type: draggableScope.type ? draggableScope.type.trim() : null,
                class: draggableScope.class
            };
            //$rootScope.$broadcast("rfeLecturerTimeFindStart", $scope.customClassModel);
            //solver.getUnavailableForLecturer(draggableScope.lecturer);
        };

        $scope.onEnd = function ($event) {
            $rootScope.$broadcast("rfeLecturerTimeFindClear");
        }
    });