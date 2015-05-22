/**
 * Created by Anton on 5/22/2015.
 */

angular.module("editor")
    .controller("ClassesCtrl", function ($scope, $timeout, iScrolls, rfeClasses) {

        $scope.$watch("newItemIsShown", function () {
            if (iScrolls.get("contentIScroll")) {
                $timeout(function () {
                    iScrolls.get("contentIScroll").refresh();
                }, 250);
            }
        });

        $scope.$watch("searchExpr", function () {
            if (iScrolls.get("contentIScroll")) {
                $timeout(function () {
                    iScrolls.get("contentIScroll").refresh();
                }, 250);
            }
        });

        $scope.clearItem = function (options) {
            options.show ? $scope.newItemIsShown = true : $scope.newItemIsShown = false;

            $scope.newClassItem = {
                title: "",
                types: [],
                lecturers: []
            };
        };

        $scope.clearItem({
            show: false
        });

        $scope.saveItem = function () {
            rfeClasses.save($scope.newClassItem).then(function () {
                $scope.clearItem({
                    show: true
                });
            }, function () {
                console.log("error")
            }).finally(function () {
                update();
            })
        };

        $scope.availableClassTypes = ["lecture", "laboratory", "practic", "seminar"];

        function update() {
            rfeClasses.getAll().then(function (classes) {
                $scope.classItems = classes;
                $scope.filteredClassItems = classes;

                $timeout(function () {
                    iScrolls.get("contentIScroll").refresh();
                }, 250);
                $scope.$applyAsync();
            });
        }

        update();

        $scope.searchExpr = "";

        $scope.onDrop = function () {
            $scope.newClassItem.lecturers.push($scope.lecturer);
            $timeout(function () {
                iScrolls.get("contentIScroll").refresh();
            }, 250);
        };
    });