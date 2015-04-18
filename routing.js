angular.module('sample').config(
    function ($stateProvider, $urlRouterProvider) {

        $urlRouterProvider.otherwise("/");

        $stateProvider.state("main", {
            url: "/",
            views: {
                header: { templateUrl: "header.html" },
                aside: { templateUrl: "aside.html" }
            }
        })
    })
