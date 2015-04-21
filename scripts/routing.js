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
            },
            "asideView@main": {
                templateUrl: "templates/mainMenu.html"
            }
        }
    });

    $stateProvider.state("main.home", {
        url: "/home",
        views: {
            "": {
                templateUrl: "templates/home.html"
            }
        }
    });

    $stateProvider.state("main.staff", {
        url: "/staff",
        views: {
            "": {
                templateUrl: "templates/staff.html",
                controller: function ($scope, $timeout, iScrolls, rfeStaff, cfpLoadingBar) {
                    cfpLoadingBar.start();

                    $scope.deleteItem = function (person) {
                        rfeStaff.delete(person).then(function () {
                            update();
                        });
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
                }
            }
        }
    });

    $stateProvider.state("main.groups", {
        url: "/groups",
        views: {
            "": {
                templateUrl: "templates/groups.html"
            }
        }
    });

    $stateProvider.state("main.rooms", {
        url: "/rooms",
        views: {
            "": {
                templateUrl: "templates/rooms.html",
                controller: function ($scope, rfeRooms, cfpLoadingBar) {
                    cfpLoadingBar.start();

                    $scope.saveItem = function () {
                        rfeRooms.save($scope.newRoomItem).then(function () {
                            update();
                            clearItem({saveAddress: true});
                        })
                    };

                    function update () {
                        rfeRooms.getAll().then(function (rooms) {
                            $scope.rooms = rooms;
                            cfpLoadingBar.complete();
                        });
                    }

                    function clearItem(options) {
                        options.saveAddress ?
                        $scope.newRoomItem = {
                            title: "",
                            address: $scope.newRoomItem.address
                        } :
                        $scope.newRoomItem = {
                            title: "",
                            address: ""
                        }
                    }

                    update();
                    clearItem({});
                }
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

                    $scope.$watch("searchExpr", function () {
                        if (iScrolls.get("asideIScroll")) {
                            $timeout(function () {
                                iScrolls.get("asideIScroll").refresh();
                            }, 250);
                        }
                    });
                }
            }
        }
    });
});