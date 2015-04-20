/**
 * Created by Anton on 19.04.2015.
 */

angular.module("editor")
.directive("collapsible", function ($timeout, iScrolls) {
        return {
            restrict: "A",
            link: function (scope, elem, attrs) {
                elem.collapsible({
                    accordion : false
                });

                elem.find("li").on("click", function () {
                    $timeout(function () {
                        iScrolls.getIScroll("asideIScroll").refresh();
                    }, 500);
                })
            }
        }
    });