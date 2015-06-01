/**
 * Created by Anton on 5/22/2015.
 */

angular.module("editor")
    .controller("ScheduleCtrl", function ($scope, $rootScope, $timeout, $q, cfpLoadingBar, rfeGroups, rfeSchedule, rfeSettings, rfeRooms, scheduleService, solver, iScrolls) {
        $scope.moment = moment;

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
            //var classScope = angular.element($event.toElement).scope(),
            //    day,
            //    index,
            //    dndItem;
            //
            //if (!classScope.dupe) {
            //    day = classScope.$parent.$index;
            //    index = classScope.$index;
            //    dndItem = classScope.dndDragItem;
            //} else {
            //    day = classScope.$parent.$parent.$index;
            //    index = classScope.$parent.$index;
            //    dndItem = classScope.dndDragItem;
            //}
            //var newItem;
            //checkTimeSlot(day, index, $scope.selectedGroup, dndItem, angular.copy(classScope.class)).then(function () {
            //    if (!classScope.dupe) {
            //        $scope.saveItem(classScope.$parent.$index, classScope.$index, classScope.dndDragItem);
            //    } else {
            //        $scope.saveItem(classScope.$parent.$parent.$index, classScope.$parent.$index, classScope.dndDragItem);
            //    }
            //    classScope.class.push(newItem);
            //    $timeout(function () {
            //        iScrolls.get("contentIScroll").refresh();
            //    }, 250);
            //}, function (reason) {
            //    alert(reason);
            //});
            //newItem = classScope.class.pop();
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

        $scope.isAvailable = function (day, index, group, existingClass) {
            return scheduleService.check(day, index, group, existingClass);
        };

        update();
    });

angular.module("editor").controller("ClassItemCtrl", function ($scope, scheduleService) {
    $scope.$watchCollection(function () {
        return scheduleService.get()
    }, function (newValue, oldValue) {
        $scope.isAvailable = scheduleService.check($scope.$parent.$index, $scope.$index, $scope.selectedGroup, $scope.class);
    });
});