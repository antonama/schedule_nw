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
            }
        }
    });

    $stateProvider.state("main.home", {
        url: "/home",
        views: {
            "": {
                templateUrl: "templates/home.html",
                controller: function ($scope, $timeout, iScrolls, rfeStaff, cfpLoadingBar) {
                    cfpLoadingBar.start();

                    rfeStaff.getAll().then(function (staff) {
                        $scope.staff = staff;
                        $timeout(function () {
                            iScrolls.get("contentIScroll").refresh();
                            cfpLoadingBar.complete();
                        }, 500);
                    });
                }
            },
            "asideView@main": {
                templateUrl: "templates/mainMenu.html"
            }
        }
    });

    $stateProvider.state("main.classes", {
        url: "/classes",
        views: {
            "": {
                templateUrl: "templates/classes.html",
                controller: function ($scope, rfeStaff, cfpLoadingBar) {

                    $scope.classItems = [
                        {
                            title: "Simple title",
                            types: ["lecture", "laboratory", "practic"],
                            lecturers: [{
                                name: {
                                    full: "Vorotnisky Yuri Iosifovich"
                                }
                            },{
                                name: {
                                    full: "Molofeev Dmitry Vladimirovich"
                                }
                            }]
                        },
                        {
                            title: "Simple title, but more length",
                            types: ["lecture", "practic"],
                            lecturers: [{
                                name: {
                                    full: "Molofeev Dmitry Vladimirovich"
                                }
                            }]
                        },
                        {
                            title: "Very long title, because some classes has it and I can't do anything about it",
                            types: ["practic"],
                            lecturers: [{
                                name: {
                                    full: "Vorotnisky Yuri Iosifovich"
                                }
                            }]
                        }
                    ]
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
                }
            }
        }
    });
});