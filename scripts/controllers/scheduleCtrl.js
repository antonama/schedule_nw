/**
 * Created by Anton on 5/22/2015.
 */

angular.module("editor")
    .controller("ScheduleCtrl", function ($scope, $rootScope, $timeout, $q, cfpLoadingBar, rfeGroups, rfeSchedule, rfeSettings, rfeRooms, solver, iScrolls) {
        $scope.moment = moment;

        $scope.changeGroups = function (year) {
            $rootScope.$broadcast("yearSelected", year || year.number);

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
            var classScope = angular.element($event.toElement).scope(),
                day,
                index,
                dndItem;

            if (!classScope.dupe) {
                day = classScope.$parent.$index;
                index = classScope.$index;
                dndItem = classScope.dndDragItem;
            } else {
                day = classScope.$parent.$parent.$index;
                index = classScope.$parent.$index;
                dndItem = classScope.dndDragItem;
            }
            var newItem;
            checkTimeSlot(day, index, $scope.selectedGroup, dndItem, angular.copy(classScope.class)).then(function () {
                if (!classScope.dupe) {
                    $scope.saveItem(classScope.$parent.$index, classScope.$index, classScope.dndDragItem);
                } else {
                    $scope.saveItem(classScope.$parent.$parent.$index, classScope.$parent.$index, classScope.dndDragItem);
                }
                classScope.class.push(newItem);
                $timeout(function () {
                    iScrolls.get("contentIScroll").refresh();
                }, 250);
            }, function (reason) {
                alert(reason);
            });
            newItem = classScope.class.pop();
        };

        $scope.removeClass = function (classItem) {
            rfeSchedule.delete(classItem).then(function () {
                $scope.downloadSchedule($scope.selectedGroup);
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

        function checkTimeSlot(day, index, group, futureClass, existingClass) {
            var deferred = $q.defer();
            if (existingClass.length === 3) {
                deferred.reject("Too many classes at that time");
            } else {
                $q.when(solver.getUnavailableForLecturer(futureClass.lecturer)).then(function (time) {
                    var breakFe = false;
                    if (time && time.length) {
                        time.forEach(function (item) {
                            if (item.day === day && item.index === index && !breakFe) {
                                if (existingClass.length === 1) {
                                    if (group.year === item.group.year && group.title !== item.group.title) {
                                        if (item.lecturer.name.full === futureClass.lecturer.name.full &&
                                            item.class.title === futureClass.class.title &&
                                            item.type !== futureClass.type) {
                                            breakFe = true;
                                            deferred.reject("Lecturer " + item.lecturer.name.surname + " " + item.lecturer.name.initials
                                                            + " works with " + item.group.title + " group of year " + item.group.year
                                                            + " on " + item.class.title + ", " + item.type);
                                        } else if (item.type === futureClass.type) {
                                            breakFe = true;
                                            deferred.resolve();
                                        } else {
                                            breakFe = true;
                                            deferred.reject("Group " + item.group.title + " of " + item.group.year + " year already work at this time");
                                        }
                                    } else if (group.year !== item.group.year) {
                                        breakFe = true;
                                        deferred.reject("Group " + item.group.title + " of " + item.group.year + " year already work at this time");
                                    }
                                } else {
                                    if (item.lecturer.name.full !== futureClass.lecturer.name.full &&
                                        item.class.title === futureClass.class.title) {
                                        breakFe = true;
                                        deferred.resolve();
                                    } else {
                                        deferred.reject("One lecturer can't teach the same class at the same time");
                                    }
                                }
                            } else if (!breakFe) {
                                if (existingClass.length === 1) {
                                    deferred.resolve();
                                } else {
                                    if (existingClass[0].lecturer.name.full !== futureClass.lecturer.name.full &&
                                        existingClass[0].class.title === futureClass.class.title) {
                                        deferred.resolve();
                                    } else {
                                        deferred.reject("Already taken");
                                    }
                                }
                                breakFe = true;
                            }
                        });
                    } else if (time && !time.length) {
                        if (existingClass.length !== 1) {
                            if (existingClass[0].lecturer.name.full !== futureClass.lecturer.name.full &&
                                existingClass[0].class.title === futureClass.class.title) {
                                breakFe = true;
                                deferred.resolve();
                            } else {
                                deferred.reject("Already taken");
                            }
                        } else {
                            if (existingClass.length === 1) {
                                deferred.resolve();
                            } else {
                                deferred.reject("Already taken");
                            }
                        }
                    } else {
                        if (existingClass.length === 1) {
                            deferred.resolve();
                        } else {
                            deferred.reject("Already taken");
                        }
                    }
                });
            }
            return deferred.promise;
        }

        //var unavailableTimeForLecturer,
        //    dndClass;
        //$scope.$on("rfeLecturerTimeFindEnd", function (event, schedule) {
        //    unavailableTimeForLecturer = schedule;
        //});
        //$scope.$on("rfeLecturerTimeFindStart", function (event, classItem) {
        //    dndClass = classItem;
        //});
        //$scope.$on("rfeLecturerTimeFindClear", function (event) {
        //    unavailableTimeForLecturer = null;
        //    dndClass = null;
        //});
        //$scope.isLecturerAvailable = function (day, index, classItem) {
        //    var available = false;
        //
        //    if (classItem[0] && classItem[0].class && dndClass && dndClass.class) {
        //        if (dndClass.class.title === classItem[0].class.title &&
        //            dndClass.lecturer.name.full !== classItem[0].lecturer.name.full) {
        //            available = true;
        //        }
        //    }
        //
        //    if (classItem && classItem.length === 2) available = false;
        //
        //    var deprecated = true;
        //    if (classItem && !classItem.length && unavailableTimeForLecturer) {
        //        unavailableTimeForLecturer.forEach(function (item) {
        //            if (item.day === day && item.index === index) {
        //                if (dndClass.class.title === item.class.title && dndClass.type === item.type) {
        //                    available = true;
        //                }
        //            } else if (deprecated) {
        //                deprecated = false;
        //            }
        //        });
        //        if (!deprecated) {
        //            available = true;
        //        }
        //    }
        //
        //    return available;
        //};

        update();
    });