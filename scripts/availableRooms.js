/**
 * Created by Anton on 5/24/2015.
 */

angular.module("editor")
    .directive("availableRooms", function ($q, rfeRooms, rfeSchedule) {
        return {
            restrict: "A",
            scope: {
                availableRooms: "=",
                availableRoomsOn: "=",
                selectedRoom: "=",
                roomDay: "@",
                roomIndex: "@"
            },
            link: function (scope, elem, attrs) {
                scope.$watch("availableRoomsOn", function (nv) {
                    if (nv && nv.type) {
                        rfeRooms.getAllOfType(nv.type).then(function (rooms) {
                            rfeSchedule.getAllOfDayClass(scope.roomDay, scope.roomIndex).then(function (schedule) {
                                var deprecated = {};
                                schedule.forEach(function (item) {
                                    if (item.lecturer.name.full !== nv.lecturer.name.full && item.room) {
                                        deprecated[item.room.title] = true
                                    }
                                });
                                scope.availableRooms = rooms.filter(function (item, index) {
                                    return !(item.title in deprecated);
                                });
                                if (nv.room) {
                                    scope.availableRooms.forEach(function (item) {
                                        if (nv.room.title === item.title) {
                                            scope.selectedRoom = item;
                                        }
                                    });
                                } else {
                                    scope.selectedRoom = {};
                                }
                            });
                        });
                    }
                })
            }
        }
    });
