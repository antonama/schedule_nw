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