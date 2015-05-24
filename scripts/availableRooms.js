/**
 * Created by Anton on 5/24/2015.
 */

angular.module("editor")
    .directive("availableRooms", function (rfeRooms) {
        return {
            restrict: "A",
            require: "ngModel",
            scope: {
                availableRooms: "=",
                availableRoomsOn: "="
            },
            link: function (scope, elem, attrs, ctrl) {
                scope.$watch("availableRoomsOn", function (nv) {
                    if (nv && nv.type) {
                        rfeRooms.getAllOfType(nv.type).then(function (rooms) {
                            scope.availableRooms = rooms;
                        });
                    }
                })
            }
        }
    });