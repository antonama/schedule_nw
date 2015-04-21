/**
 * Created by Anton on 19.04.2015.
 */

angular.module("editor")

.directive("asideIscroll",
    function (iScrolls) {
        return function (scope, elem, attrs) {
            var asideIscroll = new IScroll(elem.get(0), {
                mouseWheel: true,
                scrollbars: true,
                fadeScrollbars: true,
                interactiveScrollbars: true,
                bounce: false,
                disableMouse: true
            });
            iScrolls.set("asideIScroll", asideIscroll);
        }
    })

.directive("contentIscroll",
    function ($rootScope, $timeout, iScrolls) {

        $rootScope.$on("$stateChangeSuccess", function () {
            $timeout(function () {
                iScrolls.get("contentIScroll").refresh();
            });
        });

        return function (scope, elem, attrs) {
            var contentIscroll = new IScroll(elem.get(0), {
                mouseWheel: true,
                scrollbars: true,
                fadeScrollbars: true,
                interactiveScrollbars: true,
                bounce: false,
                disableMouse: true,
                keyBindings: {
                    pageUp: 33,
                    pageDown: 34,
                    end: 35,
                    home: 36,
                    left: 37,
                    up: 38,
                    right: 39,
                    down: 40
                }
            });
            iScrolls.set("contentIScroll", contentIscroll);
        }
    })

.directive("fuzzyStaff", function (rfeStaff) {
        var fuse;

        return {
            restrict: "A",
            scope: {
                fuzzyStaff: "=",
                originalItems: "=",
                ngModel: "="
            },
            link: function (scope, elem, attrs) {
                elem.attr("disabled", "");

                var unwatch = scope.$watch("originalItems", function (newValue) {
                    if (newValue && newValue.length) {
                        unwatch();

                        elem.removeAttr("disabled");

                        fuse = new Fuse(scope.originalItems, {
                            keys: ["name.full"],
                            threshold: 0.4
                        });

                        scope.$watch("ngModel", function (newValue) {
                            if (newValue && fuse) {
                                scope.fuzzyStaff = fuse.search(elem.val());
                            } else {
                                scope.fuzzyStaff = scope.originalItems;
                            }
                        });
                    }
                });
            }
        }
    });