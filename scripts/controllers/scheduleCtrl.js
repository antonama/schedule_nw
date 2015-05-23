/**
 * Created by Anton on 5/22/2015.
 */

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