/**
 * Created by Anton on 5/22/2015.
 */

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
            var classScope = angular.element($event.toElement).scope();
            if (!classScope.dupe) {
                $scope.saveItem(classScope.$parent.$index, classScope.$index, classScope.dndDragItem);
            } else {
                $scope.saveItem(classScope.$parent.$parent.$index, classScope.$parent.$index, classScope.dndDragItem);
            }
            //$scope.saveItem();
            $timeout(function () {
                iScrolls.get("contentIScroll").refresh();
            }, 250);
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

        var unavailableTimeForLecturer;
        $scope.$on("rfeLecturerTimeFindEnd", function (event, schedule) {
            unavailableTimeForLecturer = schedule;
        });
        $scope.isLecturerAvailable = function (day, index, classItem) {
            var available = false;
            if (unavailableTimeForLecturer && classItem.length && classItem[0].lecturer) {
                unavailableTimeForLecturer.forEach(function (item, index) {
                    if (classItem[0].lecturer.name.full !== item.lecturer.name.full) {
                        available = true;
                    }
                    if (item.class.title !== classItem[0].class.title) {
                        available = false;
                    }
                });
            } else if (unavailableTimeForLecturer && !classItem.length) {
                for (var i = 0; i < unavailableTimeForLecturer.length; i++) {
                    if (unavailableTimeForLecturer[i].day === day && unavailableTimeForLecturer[i].index === index) {
                        available = false;
                        break;
                    } else {
                        available = true;
                        break;
                    }
                }
            } else {
                available = true;
            }
            return available;
        };

        update();
    });