/**
 * Created by Anton on 5/22/2015.
 */

angular.module("editor")
    .controller("AsideClassesCtrl", function ($scope, $timeout, rfeClasses, scheduleService, solver, iScrolls, $rootScope) {
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
            scheduleService.set($scope.customClassModel);
            scheduleService.setMoving(true);
            scheduleService.setReason([]);

            $rootScope.$applyAsync();
        };

        $scope.onEnd = function () {
            scheduleService.setMoving(false);
            scheduleService.setReason([]);
        }
    });