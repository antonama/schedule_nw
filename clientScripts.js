angular.module("editor", ["ui.router"]);

angular.module('editor')
.config(function ($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise("/home");

    $stateProvider.state("main", {
        abstract: true,
        templateUrl: "templates/main.html"
    });

    $stateProvider.state("main.home", {
        url: "/home",
        templateUrl: "templates/home.html"
    });

    $stateProvider.state("main.custom", {
        url: "/custom",
        template: "<div>custom</div>"
    });
});


angular.module("editor")
.directive("collapsible", function () {
        return {
            restrict: "A",
            link: function (scope, elem, attrs) {
                elem.collapsible({
                    accordion : false
                });
            }
        }
    });