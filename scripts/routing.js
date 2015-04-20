angular.module('editor')
.config(function ($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise("/home");

    $stateProvider.state("main", {
        abstract: true,
        templateUrl: "templates/main.html",
        controller: function ($scope, $history) {
            $scope.$history = $history;
        }
    });

    $stateProvider.state("main.home", {
        url: "/home",
        controller: function ($scope, $timeout, iScrolls, rfeStaff, cfpLoadingBar) {
            cfpLoadingBar.start();

            rfeStaff.getAll().then(function (staff) {
                $scope.staff = staff;
                $timeout(function () {
                    iScrolls.get("contentIScroll").refresh();
                    cfpLoadingBar.complete();
                }, 500);
            });
        },
        templateUrl: "templates/home.html"
    });

    $stateProvider.state("main.custom", {
        url: "/custom",
        template: "<div>custom</div>"
    });

        $stateProvider.state("main.custom2", {
            url: "/custom2",
            template: "<div>custom2</div>"
        });

        $stateProvider.state("main.custom3", {
            url: "/custom3",
            template: "<div>custom3</div>"
        });

        $stateProvider.state("main.custom4", {
            url: "/custom4",
            template: "<div>custom4</div>"
        });
});