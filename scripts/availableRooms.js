/**
 * Created by Anton on 5/24/2015.
 */

angular.module("editor")
    .directive("availableRooms", function (rfeRooms) {
        return {
            restrict: "A",
            scope: {
                availableRooms: "=",
                availableRoomsOn: "=",
                selectedRoom: "="
            },
            link: function (scope, elem, attrs) {
                scope.$watch("availableRoomsOn", function (nv) {
                    if (nv && nv.type) {
                        rfeRooms.getAllOfType(nv.type).then(function (rooms) {
                            scope.availableRooms = rooms;
                            if (nv.room) {
                                rooms.forEach(function (item) {
                                    if (nv.room.title === item.title) {
                                        scope.selectedRoom = item;
                                    }
                                });
                            } else {
                                scope.selectedRoom = rooms[0];
                            }
                        });
                    }
                })
            }
        }
    });