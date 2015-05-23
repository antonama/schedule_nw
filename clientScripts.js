angular.module("editor", [
    "ui.router",
    "cfp.loadingBar",
    "checklist-model",
    "ngDragDrop"
]);



angular.module("editor")

.directive("asideIscroll",
    function (iScrolls) {
        return function (scope, elem, attrs) {
            var asideIscroll = new IScroll(elem.get(0), {
                mouseWheel: true,
                scrollbars: true,
                fadeScrollbars: true,
                interactiveScrollbars: true,
                bounce: false,
                disableMouse: true
            });
            iScrolls.set("asideIScroll", asideIscroll);
        }
    })

.directive("contentIscroll",
    function ($rootScope, $timeout, iScrolls) {

        $rootScope.$on("$stateChangeSuccess", function () {
            $timeout(function () {
                iScrolls.get("contentIScroll").refresh();
            });
        });

        return function (scope, elem, attrs) {
            var contentIscroll = new IScroll(elem.get(0), {
                mouseWheel: true,
                scrollbars: true,
                fadeScrollbars: true,
                interactiveScrollbars: true,
                bounce: false,
                disableMouse: true
            });
            iScrolls.set("contentIScroll", contentIscroll);
        }
    })

.directive("fuzzy", function ($document, $parse) {
        return {
            restrict: "A",
            scope: {
                fuzzy: "=",
                originalItems: "=",
                ngModel: "=",
                keys: "@"
            },
            link: function (scope, elem, attrs) {
                var fuse;

                var blocked = true;
                elem.attr("disabled", "");

                var unwatchNgModel = angular.noop;
                scope.$watch("originalItems", function (newValue) {
                    if (newValue && newValue.length) {
                        unwatchNgModel();

                        blocked ? elem.removeAttr("disabled") : angular.noop;
                        blocked = false;

                        fuse = new Fuse(scope.originalItems, {
                            keys: $parse(scope.keys)(),
                            threshold: 0.4
                        });

                        unwatchNgModel = scope.$watch("ngModel", function (newValue) {
                            if (newValue && fuse) {
                                scope.fuzzy = fuse.search(elem.val());
                            } else {
                                scope.fuzzy = scope.originalItems;
                            }
                        });

                        $($document).keyup(function (e) {
                           
                            if (e.keyCode == 27) {
                                scope.ngModel = "";
                                scope.$apply();
                            }
                        })
                    }
                });
            }
        }
    });
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
                controller: "StaffCtrl"
            }
        }
    });

    $stateProvider.state("main.groups", {
        url: "/groups",
        views: {
            "": {
                templateUrl: "templates/groups.html",
                controller: "GroupsCtrl"
            }
        }
    });

    $stateProvider.state("main.schedule", {
        url: "/schedule",
        views: {
            "": {
                templateUrl: "templates/schedule.html",
                controller: "ScheduleCtrl"
            },
            "asideView@main": {
                templateUrl: "templates/asideClasses.html",
                controller: "AsideClassesCtrl"
            }
        }
    });

    $stateProvider.state("main.rooms", {
        url: "/rooms",
        views: {
            "": {
                templateUrl: "templates/rooms.html",
                controller: "RoomsCtrl"
            }
        }
    });

    $stateProvider.state("main.classes", {
        url: "/classes",
        views: {
            "": {
                templateUrl: "templates/classes.html",
                controller: "ClassesCtrl"
            },
            "asideView@main": {
                templateUrl: "templates/lecturersList.html",
                controller: "AsideLecturersCtrl"
            }
        }
    });

    $stateProvider.state("main.settings", {
            url: "/settings",
            views: {
                "": {
                    templateUrl: "templates/settings.html",
                    controller: "SettingsCtrl"
                }
            }
        });
});


angular.module("editor").service("iScrolls", function () {
    var self = this;

    this.map = {};

    return {
        get: function (name) {
            return self.map[name];
        },
        set: function (name, instance) {
            self.map[name] = instance;
        }
    };
})
.service("$history", function ($rootScope, $state, $location) {

        var backClicked = false,
            forwardClicked = false,
            historyStates = {
                current: {},
                previous: [],
                next: [],
                length: 0
            };

        var unwatchFirstState = $rootScope.$watch(function () {
            return $state.current;
        }, function (newValue) {
            if (newValue) {
                historyStates.current = newValue;
                historyStates.length++;
                unwatchFirstState();
            }
        });

        $rootScope.$on('$stateChangeSuccess', function (ev, to) {
            if (!backClicked && !forwardClicked) {
                historyStates.previous.push(historyStates.current);
                historyStates.next = [];
                historyStates.current = to;
            } else if (backClicked) {
                historyStates.next.push(historyStates.current);
                historyStates.current = historyStates.previous.pop();
                backClicked = false;
            } else {
                historyStates.previous.push(historyStates.current);
                historyStates.current = historyStates.next.pop();
                forwardClicked = false;
            }
        });

        return angular.extend(historyStates, {
            hasPrevious: function () {
                return !!historyStates.previous.length;
            },
            hasNext: function () {
                return !!historyStates.next.length
            },
            back: function () {
                if (!!historyStates.previous.length) {
                    $location.path(historyStates.previous[historyStates.previous.length - 1].url);
                    backClicked = true;
                }
            },
            forward: function () {
                if (!!historyStates.next.length) {
                    $location.path(historyStates.next[historyStates.next.length - 1].url);
                    forwardClicked = true;
                }
            }
        });
    });


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


angular.module("editor")
    .controller("ClassesCtrl", function ($scope, $timeout, iScrolls, rfeClasses, rfeSettings) {

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


angular.module("editor")
    .controller("GroupsCtrl", function ($scope, $timeout, rfeGroups, cfpLoadingBar, iScrolls) {
        cfpLoadingBar.start();

        $scope.newGroupItem = {
            title: '',
            year: ''
        };

        $scope.saveItem = function () {
            rfeGroups.save($scope.newGroupItem).then(function () {
                update();
               
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
    });


angular.module("editor")
.controller("mainMenuCtrl", function ($scope, $state, $timeout, $rootScope, iScrolls) {
        $scope.$state = $state;
        $rootScope.$on("$stateChangeSuccess", function () {
            iScrolls.get("asideIScroll").scrollTo(0, 0);
            $timeout(function () {
                iScrolls.get("asideIScroll").refresh();
            }, 250)
        });
    });


angular.module("editor")
    .controller("RoomsCtrl", function ($scope, rfeRooms, rfeSettings, cfpLoadingBar) {
        cfpLoadingBar.start();

        $scope.saveItem = function () {
            rfeRooms.save($scope.newRoomItem).then(function () {
                update();
                clearItem();
            })
        };

        $scope.deleteItem = function (item) {
            rfeRooms.delete(item).then(function () {
                update();
            })
        };

        function update () {
            rfeRooms.getAll().then(function (rooms) {
                $scope.rooms = rooms;
                cfpLoadingBar.complete();
            });
        }

        function clearItem() {
            $scope.newRoomItem = {
                title: "",
                types: []
            }
        }

        rfeSettings.getItemByUniqueId("classesTypes").then(function (types) {
            $scope.availableRoomTypes = types.split(",");
        });

        update();
        clearItem({});
    });


angular.module("editor")
    .controller("ScheduleCtrl", function ($scope, $timeout, cfpLoadingBar, rfeGroups, rfeSchedule, rfeSettings, iScrolls) {
        cfpLoadingBar.start();

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
            var daysInWeek = 6;
            rfeSettings.getItemByUniqueId("maxClassesInDay").then(function (classesInDay) {
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
                        for (var i = 0; i < parseeInt(classesInDay, 10); classesInDay++) {
                            array[index].push({});
                        }
                    });
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
    });


angular.module("editor")
    .controller("SettingsCtrl", function ($scope, rfeSettings, cfpLoadingBar) {
        cfpLoadingBar.start();

        $scope.saveItem = function (item) {
            rfeSettings.save(item).then(function () {
                update();
            })
        };

        $scope.cancel = function () {
            $scope.buttonsIsShown = false
        };

        function update () {
            rfeSettings.getAll().then(function (settings) {
                $scope.settings = settings;
                cfpLoadingBar.complete();
            });
        }

        update();
    });


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


angular.module("editor")
.directive("collapsible", function ($timeout, iScrolls) {
        return {
            restrict: "A",
            link: function (scope, elem, attrs) {
                elem.collapsible({
                    accordion : false
                });

                elem.find("li").on("click", function () {
                    $timeout(function () {
                        iScrolls.get("asideIScroll").refresh();
                    }, 500);
                })
            }
        }
    });