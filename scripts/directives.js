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
    });