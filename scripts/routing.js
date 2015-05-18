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
                templateUrl: "templates/groups.html",
                controller: function ($scope, $timeout, rfeGroups, cfpLoadingBar, iScrolls) {
                    cfpLoadingBar.start();

                    $scope.newGroupItem = {
                        title: '',
                        year: ''
                    };

                    $scope.saveItem = function () {
                        rfeGroups.save($scope.newGroupItem).then(function () {
                            update();
                            //clearItem({saveAddress: true});
                        })
                    };

                    function update () {
                        rfeGroups.getYears().then(function (years) {
                            $scope.years = years;
                            cfpLoadingBar.complete();

                            $timeout(function () {
                                iScrolls.get("contentIScroll").refresh();
                                cfpLoadingBar.complete();
                            }, 500);
                        });
                    }

                    update();
                }
            }
        }
    });

    $stateProvider.state("main.schedule", {
        url: "/schedule",
        views: {
            "": {
                templateUrl: "templates/schedule.html",
                controller: function ($scope, $timeout, cfpLoadingBar, rfeGroups, rfeSchedule, iScrolls) {
                    cfpLoadingBar.start();

                    var daysInWeek = 6;
                    $scope.moment = moment;

                    $scope.changeGroups = function (year) {
                        return rfeGroups.getGroupsForYear(year).then(function (groups) {
                            $scope.groups = groups.sort(function (a, b) {
                                return a.title > b.title ? 1 : -1
                            });
                            $scope.selectedGroup = $scope.groups[0];
                            $scope.downloadSchedule($scope.selectedYear, $scope.selectedGroup);
                        });
                    };

                    $scope.downloadSchedule = function (year, group) {
                        $scope.schedule = [];
                        for (var i = 0; i < daysInWeek; i++) {
                            $scope.schedule[i] = [];
                        }

                        rfeSchedule.getGroupSchedule(year, group).then(function (schedule) {
                            schedule.forEach(function (day, index) {
                                $scope.schedule[index] = day.filter(function (item, itemIndex) {
                                    return index === itemIndex;
                                }).pop();
                            });
                            $scope.schedule.forEach(function (item, index, array) {
                                array[index].push({});
                            });
                        });
                    };

                    $scope.addItem = function (day) {
                        day.push({});
                        $timeout(function () {
                            iScrolls.get("contentIScroll").refresh();
                            cfpLoadingBar.complete();
                        }, 500);
                    };

                    rfeGroups.getYears().then(function (years) {
                        $scope.years = years.sort(function (a, b) {
                            return a.number - b.number
                        });
                        $scope.selectedYear = years[0];
                        $scope.changeGroups($scope.selectedYear).then(function () {
                            cfpLoadingBar.complete();
                        });
                    });
                }
            },
            "asideView@main": {
                templateUrl: "templates/asideClasses.html",
                controller: function ($scope, $timeout, rfeClasses, iScrolls) {
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
                }
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