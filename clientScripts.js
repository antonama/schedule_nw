angular.module("editor", [
    "ui.router",
    "cfp.loadingBar",
    "checklist-model",
    "ngDragDrop"
]);

moment.locale("ru");


angular.module("editor")
    .directive("availableRooms", function ($q, rfeRooms, rfeSchedule) {
        return {
            restrict: "A",
            scope: {
                availableRooms: "=",
                availableRoomsOn: "=",
                selectedRoom: "=",
                roomDay: "@",
                roomIndex: "@"
            },
            link: function (scope, elem, attrs) {
                scope.$watch("availableRoomsOn", function (nv) {
                    if (nv && nv.type) {
                        rfeRooms.getAllOfType(nv.type).then(function (rooms) {
                            rfeSchedule.getAllOfDayClass(scope.roomDay, scope.roomIndex).then(function (schedule) {
                                var deprecated = {};
                                schedule.forEach(function (item) {
                                    if (item.lecturer && item.lecturer.name.full !== nv.lecturer.name.full && item.room) {
                                        deprecated[item.room.title] = true
                                    }
                                });
                                scope.availableRooms = rooms.filter(function (item, index) {
                                    return !(item.title in deprecated);
                                });
                                if (nv.room) {
                                    scope.availableRooms.forEach(function (item) {
                                        if (nv.room.title === item.title) {
                                            scope.selectedRoom = item;
                                        }
                                    });
                                } else {
                                    scope.selectedRoom = {};
                                }
                            });
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
                    } else if (newValue && newValue.length === 0) {
                        scope.fuzzy = [];
                    }
                });
            }
        }
    })
.filter('range', function() {
    return function(input, total) {
        total = parseInt(total);
        for (var i=0; i<total; i++)
            input.push(i);
        return input;
    };
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

    $stateProvider.state("main.preferences", {
        url: "/preferences",
        views: {
            "": {
                templateUrl: "templates/preferences.html",
                controller: "PreferencesCtrl"
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
angular.module("editor").factory("scheduleService", function (rfeSchedule, solver) {
    var self = this;

    this.dndItem = {};

    this.reasons = [];

    this.moving = false;

    return {
        get: function () {
            return self.dndItem;
        },
        set: function (item) {
            self.dndItem = item;
        },
        check: function (day, index, group, existingClass) {
            return checkTimeSlot(day, index, group, self.dndItem, existingClass);
        },
        getReason: function (day, index, classItem, group) {
            return self.reasons.filter(function (item) {
                return item.day === day && item.index === index
            }).pop();
        },
        setReason: function (reason) {
            self.reasons = reason;
        },
        setMoving: function (moving) {
            self.moving = moving;
        },
        isMoving: function () {
            return self.moving;
        }
    };

    function checkTimeSlot(day, index, group, futureClass, existingClass) {
        var available = true;

        if (futureClass) {
            if (existingClass.length === 2) {
                available = false;
                self.reasons.push({
                    day: existingClass[0].day,
                    index: existingClass[0].index,
                    text: "Слишком много занятий в это время"
                });
            } else if (!existingClass.length) {
                var unavailableTime = solver.getUnavailableForLecturer(futureClass.lecturer);
                if (unavailableTime.length) {
                    var blockers = unavailableTime.filter(function (item) {
                        return item.day === day && item.index === index &&
                            (item.class.title === futureClass.title && item.type !== futureClass.type);
                    });
                    if (blockers.length) {
                        available = false;
                        self.reasons.push({
                            day: blockers[0].day,
                            index: blockers[0].index,
                            text: "Преподаватель ведет занятие \"" + blockers[0].class.title + "\" у группы " + blockers[0].group.title + " курса " + blockers[0].group.year
                        });
                    }
                } else {

                }
            } else {
                if (existingClass && futureClass && futureClass.class) {
                    if (existingClass[0].title !== futureClass.title) {
                        available = false;
                        self.reasons.push({
                            day: existingClass[0].day,
                            index: existingClass[0].index,
                            text: "Таймслот занят"
                        });
                    } else if (existingClass[0].title === futureClass.title &&
                        existingClass[0].lecturer._id.toString() === futureClass.lecturer._id.toString()) {
                        available = false;
                        self.reasons.push({
                            day: existingClass[0].day,
                            index: existingClass[0].index,
                            text: "Преподаватель уже ведет данное занятие"
                        });
                    }
                }
            }
        }

        return available;
    }
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
    .factory("solver", function ($rootScope, $q, rfeSchedule) {
        return {
            getUnavailableForLecturer: function (lecturer) {
                var schedule = [];

                if (lecturer) {
                    schedule = rfeSchedule.getScheduleObject();
                    schedule = schedule.filter(function (item) {
                        return item.lecturer && item.lecturer._id.toString() === lecturer._id.toString();
                    });
                }

                return schedule;
            }
        }
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
                if (yearItem === item.for[0].year) {
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
                $scope.years = Object.keys(years).map(function (item) {
                    return parseInt(item, 10);
                });
                $scope.selectedYear = $scope.years[0];
                $scope.changeGroups($scope.selectedYear).then(function () {
                    update();
                    cfpLoadingBar.complete();
                });
            });
        }

        function update () {
            cfpLoadingBar.start();

            rfeAnnouncements.getAll().then(function (announcements) {
                $scope.announcementsList = announcements;
                if (!announcements.length) {
                    $scope.filteredAnnouncementItems = [];
                }
                cfpLoadingBar.complete();

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
    .controller("ClassesCtrl", function ($scope, $timeout, iScrolls, rfeClasses, rfeGroups, rfeSettings) {

        $scope.selectedYears = [];
        rfeGroups.getYears().then(function (years) {
            $scope.years = Object.keys(years).map(function (item) {
                return parseInt(item, 10);
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


angular.module("editor")
    .controller("GroupsCtrl", function ($scope, $timeout, rfeGroups, cfpLoadingBar, iScrolls) {
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
            cfpLoadingBar.start();

            rfeGroups.getYears().then(function (years) {
                $scope.years = years;
                cfpLoadingBar.complete();

                $timeout(function () {
                    iScrolls.get("contentIScroll").refresh();
                    cfpLoadingBar.complete();
                }, 500);
            });
        }

        $scope.delete = function (item) {
            rfeGroups.delete(item).then(function () {
                update();
            });
        };

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
    .controller("PreferencesCtrl", function ($scope, $timeout, rfePreferences, rfeSettings, iScrolls, cfpLoadingBar) {
        cfpLoadingBar.start();

        $scope.moment = moment;

        rfePreferences.getAll().then(function (preferences) {
            $scope.filteredPreferenceItems = preferences;
            $scope.preferences = preferences;

            cfpLoadingBar.complete();
            $scope.clear();
        });

        rfeSettings.getItemByUniqueId("maxClassesInDay").then(function (classesInDayDb) {
            $scope.classesInDay = parseInt(classesInDayDb, 10);
            $timeout(function () {
                iScrolls.get("contentIScroll").refresh();
            }, 250);
        });

        $scope.clear = function () {
            $scope.newItemIsShown = false;
            $scope.newPreferenceItem = {};
            $timeout(function () {
                iScrolls.get("contentIScroll").refresh();
            }, 250);
        };

        $scope.edit = function (item) {
            $scope.newItemIsShown = true;
            $scope.newPreferenceItem = item || {
                    lecturer: {},
                    dos: []
                };
            $timeout(function () {
                iScrolls.get("contentIScroll").refresh();
            }, 250);
        }

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
    .controller("ScheduleCtrl", function ($scope, $rootScope, $timeout, $q, cfpLoadingBar, rfeGroups, rfeSchedule, rfeSettings, rfeRooms, scheduleService, solver, iScrolls) {
        $scope.moment = moment;
        $scope.scheduleService = scheduleService;

        $scope.changeGroups = function (year) {
            $rootScope.$broadcast("yearSelected", year);

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
                        array[index].push([]);
                    }
                });

                schedule.forEach(function (item, index, array) {
                    $scope.schedule[item.day][item.index].push(angular.extend(item, {
                        title: item.class.title
                    }));
                });
                $timeout(function () {
                    iScrolls.get("contentIScroll").refresh();
                }, 250);
                cfpLoadingBar.complete();
            });
        }

        function update () {
            rfeGroups.getYears().then(function (years) {
                $scope.years = Object.keys(years).map(function (item) {
                    return parseInt(item, 10);
                });
                $scope.selectedYear = $scope.years[0];
                $scope.changeGroups($scope.selectedYear).then(function () {
                    cfpLoadingBar.complete();
                });
            });
        }

        $scope.onDrop = function ($event) {
            var classScope = angular.element($event.toElement).scope(),
                day,
                index,
                dndItem;

            if (!classScope.dupe) {
                day = classScope.$parent.$index;
                index = classScope.$index;
            } else {
                day = classScope.$parent.$parent.$index;
                index = classScope.$parent.$index;
            }
            dndItem = classScope.dndDragItem;
            classScope.class.pop();
            var reason = scheduleService.getReason(day, index, classScope.class[0], $scope.selectedGroup);
            if (!reason) {
                $scope.saveItem(day, index, dndItem).then(function () {
                    scheduleService.setReason([]);
                });
            } else {
                alert(reason.text);
                scheduleService.setReason([]);
            }
        };

        $scope.removeClass = function (classItem) {
            rfeSchedule.delete(classItem).then(function () {
                $scope.downloadSchedule($scope.selectedGroup);
            });
        };

        $scope.saveItem = function (day, index, item) {
            return rfeSchedule.save(angular.extend(item, {
                day: day,
                index: index,
                group: $scope.selectedGroup
            })).then(function () {
                $scope.downloadSchedule($scope.selectedGroup);
            });
        };

        $scope.isAvailable = function (day, index, existingClass) {
            return scheduleService.check(day, index, $scope.selectedGroup, existingClass);
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