/**
 * Created by Anton on 19.04.2015.
 */

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