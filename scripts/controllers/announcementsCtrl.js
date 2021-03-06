/**
 * Created by Anton on 5/23/2015.
 */

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