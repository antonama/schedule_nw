/**
 * Created by Anton on 19.04.2015.
 */

angular.module("editor")

.directive("iscroll",
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
            iScrolls.setIScroll("asideIScroll", asideIscroll);
        }
    })

//.directive("backButton", function () {
//        return function (scope, elem) {
//            elem.bind('click', goBack);
//
//            function goBack() {
//                history.back();
//                scope.$apply();
//            }
//        }
//    })
//.directive("forwardButton", function () {
//    return function (scope, elem) {
//        elem.bind('click', goBack);
//
//        function goBack() {
//            history.forward();
//            scope.$apply();
//        }
//    }
//});