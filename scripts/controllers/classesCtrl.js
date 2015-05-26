/**
 * Created by Anton on 5/22/2015.
 */

angular.module("editor")
    .controller("ClassesCtrl", function ($scope, $timeout, iScrolls, rfeClasses, rfeGroups, rfeSettings) {

        $scope.selectedYears = [];
        rfeGroups.getYears().then(function (years) {
            $scope.years = years.sort(function (a, b) {
                return a.number - b.number
            });
        });

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

            $scope.editingItem = false;
        };

        $scope.clearItem({
            show: false
        });

        $scope.saveItem = function () {
            rfeClasses.save($scope.newClassItem).then(function () {
                $scope.clearItem({
                    show: true
                });
            }).finally(function () {
                update();
            })
        };

        rfeSettings.getItemByUniqueId("classesTypes").then(function (types) {
            $scope.availableClassTypes = types.split(",");
        });

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

        $scope.deleteItem = function (item) {
            rfeClasses.delete(item).then(function () {
                update();
            })
        };

        $scope.editItem = function (classItem) {
            $scope.clearItem({
                show: true
            });
            $scope.editingItem = true;
            $scope.newClassItem = angular.copy(classItem);
            iScrolls.get("contentIScroll").scrollTo(0, 0);
            $timeout(function () {
                iScrolls.get("contentIScroll").refresh();
            }, 500);
        };

        $scope.deleteLecturerFromClass = function (lecturer, $index) {
            $scope.newClassItem.lecturers.splice($index, 1);
        };
    });