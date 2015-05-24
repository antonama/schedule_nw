angular.module("editor", [
    "ui.router",
    "cfp.loadingBar",
    "checklist-model",
    "ngDragDrop"
]);

moment.locale("ru");


angular.module("editor")
    .directive("availableRooms", function (rfeRooms) {
        return {
            restrict: "A",
            require: "ngModel",
            scope: {
                availableRooms: "=",
                availableRoomsOn: "="
            },
            link: function (scope, elem, attrs, ctrl) {
                scope.$watch("availableRoomsOn", function (nv) {
                    if (nv && nv.type) {
                        rfeRooms.getAllOfType(nv.type).then(function (rooms) {
                            scope.availableRooms = rooms;
                        });
                    }
                })
            }
        }
    });


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

    $stateProvider.state("main.announcements", {
        url: "/announcements",
        views: {
            "": {
                templateUrl: "templates/announcements.html",
                controller: "AnnouncementsCtrl"
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
    .controller("AnnouncementsCtrl", function ($scope, $timeout, rfeGroups, rfeAnnouncements, cfpLoadingBar, iScrolls) {
        $scope.moment = moment;

        $scope.updateDate = null;

        $scope.changeGroups = function (year) {
            return rfeGroups.getGroupsForYear(year).then(function (groups) {
                $scope.groups = groups.sort(function (a, b) {
                    return a.title > b.title ? 1 : -1
                });
                $timeout(function () {
                    iScrolls.get("contentIScroll").refresh();
                }, 250);
            });
        };

        $scope.addItem = function () {
            rfeAnnouncements.save($scope.newAnnouncementItem).then(function () {
                $scope.clear();
                update();
                $scope.newItemIsShown = false;
            });
        };

        $scope.editItem = function (item) {
            $scope.newAnnouncementItem = item;
            $scope.updateDate = item.expireAt;
            $scope.newItemIsShown = true;
            angular.forEach($scope.years, function (yearItem) {
                if (yearItem.number === item.for[0].year) {
                    $scope.selectedYear = yearItem;
                }
            });
            $scope.changeGroups($scope.selectedYear);
            iScrolls.get("contentIScroll").scrollTo(0, 0);
            $timeout(function () {
                iScrolls.get("contentIScroll").refresh();
            }, 250);
        };

        $scope.editNewItem = function () {
            $scope.newItemIsShown = true;
            iScrolls.get("contentIScroll").scrollTo(0, 0);
            $timeout(function () {
                iScrolls.get("contentIScroll").refresh();
            }, 250);
        };

        $scope.deleteItem = function (item) {
            rfeAnnouncements.delete(item).then(function () {
                update();
            });
        };

        function updateGroups () {
            cfpLoadingBar.start();
            rfeGroups.getYears().then(function (years) {
                $scope.years = years.sort(function (a, b) {
                    return a.number - b.number
                });
                $scope.selectedYear = years[0];
                $scope.changeGroups($scope.selectedYear).then(function () {
                    update();
                    cfpLoadingBar.complete();
                });
            });
        }

        function update () {
            rfeAnnouncements.getAll().then(function (announcements) {
                $scope.announcementsList = announcements;
                $timeout(function () {
                    iScrolls.get("contentIScroll").refresh();
                }, 250);
            });
        }

        $scope.clear = function () {
            $scope.newAnnouncementItem = {};
            $scope.updateDate = null;
            $timeout(function () {
                iScrolls.get("contentIScroll").refresh();
            }, 250);
        };

        updateGroups();
        $scope.clear();
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

        $scope.customClassModel = {};
        $scope.onStart = function ($event, u) {
            var draggableScope = angular.element($event.target).scope();
            $scope.customClassModel = {
                title: draggableScope.class.title,
                lecturer: draggableScope.lecturer || draggableScope.lecturer,
                type: draggableScope.type ? draggableScope.type.trim() : null,
                class: draggableScope.class
            }
        }
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
            $scope.availableRoomTypes = types.split(",").map(function (item) {
                return item.trim();
            });
        });

        update();
        clearItem({});
    });


angular.module("editor")
    .controller("ScheduleCtrl", function ($scope, $timeout, cfpLoadingBar, rfeGroups, rfeSchedule, rfeSettings, rfeRooms, iScrolls) {
        $scope.moment = moment;

        $scope.changeGroups = function (year) {
            return rfeGroups.getGroupsForYear(year).then(function (groups) {
                $scope.groups = groups.sort(function (a, b) {
                    return a.title > b.title ? 1 : -1
                });
                $scope.selectedGroup = $scope.groups[0];
                $scope.downloadSchedule($scope.selectedGroup);
            });
        };

        $scope.downloadSchedule = function (group) {
            cfpLoadingBar.start();

            $scope.classesInDay = 0;

            if ($scope.classesInDay) {
                formSchedule(group);
            } else {
                rfeSettings.getItemByUniqueId("maxClassesInDay").then(function (classesInDayDb) {
                    $scope.classesInDay = parseInt(classesInDayDb, 10);
                    formSchedule(group);
                });
            }
        };

        function formSchedule (group) {
            rfeSchedule.getGroupSchedule(group).then(function (schedule) {
                $scope.schedule = [];
                var daysInWeek = 6;

                for (var i = 0; i < daysInWeek; i++) {
                    $scope.schedule[i] = [];
                }

                $scope.schedule.forEach(function (item, index, array) {
                    for (var i = 0; i < $scope.classesInDay; i++) {
                        array[index].push({});
                    }
                });

                schedule.forEach(function (item, index, array) {
                    $scope.schedule[item.day][item.index] = angular.extend(item, {
                        title: item.class.title
                    });
                });
                $timeout(function () {
                    iScrolls.get("contentIScroll").refresh();
                }, 250);
                cfpLoadingBar.complete();
            });
        }

        function update () {
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

        $scope.onDrop = function ($event) {
            var classScope = angular.element($event.toElement).scope();
            $scope.getAvailableRoomsAndSave(classScope);
            $timeout(function () {
                iScrolls.get("contentIScroll").refresh();
            }, 250);
        };

        $scope.removeClass = function (classItem) {
            rfeSchedule.delete(classItem).then(function () {
                $scope.downloadSchedule($scope.selectedGroup);
            });
        };

        $scope.getAvailableRoomsAndSave = function (scope) {
            rfeRooms.getAllOfType(scope.class.type).then(function (rooms) {
                scope.availableRooms = rooms;
                scope.class.room = rooms[0];

                $scope.saveItem(scope.$parent.$index, scope.$index, scope.class);
            });
        };

        $scope.getAvailableRooms = function (scope) {
            rfeRooms.getAllOfType(scope.class.type).then(function (rooms) {
                scope.availableRooms = rooms;
                scope.class.room = rooms[0];
            });
        };

        $scope.saveItem = function (day, index, item) {
            rfeSchedule.save(angular.extend(item, {
                day: day,
                index: index,
                group: $scope.selectedGroup
            })).then(function () {
                $scope.downloadSchedule($scope.selectedGroup);
            });
        };

        update();
    });


angular.module("editor")
    .controller("SettingsCtrl", function ($scope, rfeSettings, cfpLoadingBar) {
        $scope.rfeSettings = rfeSettings;
        cfpLoadingBar.start();

        $scope.saveItem = function (item) {
            rfeSettings.save(item).then(function () {
                update();
            })
        };

        $scope.cancel = function () {
            $scope.buttonsIsShown = false
        };

        $scope.publishScheduleInInternet = function () {
            $scope.publishSchedule.value = $scope.publishSchedule.value ? "true" : "false";
            rfeSettings.save($scope.publishSchedule).then(function () {
                update();
            });
        };

        function update () {
            rfeSettings.getAll().then(function (settings) {
                $scope.settings = settings.filter(function (item) {
                    return item.uniqueId !== 'publishSchedule';
                });

                $scope.publishSchedule = settings.filter(function (item) {
                    return item.uniqueId === 'publishSchedule';
                }).pop();
                $scope.publishSchedule.value = $scope.publishSchedule.value === "true" ? true : false;

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


angular.module("editor")
    .directive("datepicker", function ($timeout, iScrolls) {
        return {
            restrict: "AEC",
            scope: {
                selectedDate: "=",
                updateDate: "="
            },
            link: function (scope, elem, attrs) {
                var $input = elem.pickadate({
                    selectMonths: true,
                    selectYears: 2,
                    firstDay: 1,
                    onSet: function(context) {
                        scope.selectedDate = moment(context.select).add(1, 'day');
                    }
                });

                var picker = $input.pickadate('picker');

                elem.click(function () {
                    $timeout(function () {
                        iScrolls.get("contentIScroll").refresh();
                    }, 1000);
                });

                scope.$watch("updateDate", function (nw) {
                    picker.set("select", nw);
                });
            }
        }
    });