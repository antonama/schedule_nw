angular.module('editor')
.config(function ($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise("/home");

    $stateProvider.state("main", {
        abstract: true,
        views: {
            "": {
                templateUrl: "templates/main.html",
                controller: function ($scope, $history) {
                    $scope.$history = $history;
                }
            }
        }
    });

    $stateProvider.state("main.home", {
        url: "/home",
        views: {
            "": {
                templateUrl: "templates/home.html",
                controller: function ($scope, $timeout, iScrolls, rfeStaff, cfpLoadingBar) {
                    cfpLoadingBar.start();

                    rfeStaff.getAll().then(function (staff) {
                        $scope.staff = staff;
                        $timeout(function () {
                            iScrolls.get("contentIScroll").refresh();
                            cfpLoadingBar.complete();
                        }, 500);
                    });
                }
            },
            "asideView@main": {
                templateUrl: "templates/mainMenu.html"
            }
        }
    });

    $stateProvider.state("main.classes", {
        url: "/classes",
        views: {
            "": {
                templateUrl: "templates/classes.html",
                controller: function ($scope, $timeout, iScrolls, rfeClasses) {

                    $scope.$watch("newItemIsShown", function () {
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
                            $timeout(function () {
                                iScrolls.get("contentIScroll").refresh();
                            }, 250);
                            $scope.$applyAsync();
                        });
                    }

                    update();

                    $scope.filteredClassItems = $scope.classItems;
                    $scope.searchExpr = "";

                    $scope.onDrop = function () {
                        $scope.newClassItem.lecturers.push($scope.lecturer);
                        $timeout(function () {
                            iScrolls.get("contentIScroll").refresh();
                        }, 250);
                    }
                }
            },
            "asideView@main": {
                templateUrl: "templates/lecturersList.html",
                controller: function ($scope, $timeout, iScrolls, cfpLoadingBar, rfeStaff) {
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

                    $scope.onStartDragging = function () {
                        $("body").addClass("drag-active");
                    };

                    $scope.onStopDragging = function () {
                        $("body").removeClass("drag-active");
                    };
                }
            }
        }
    });
});