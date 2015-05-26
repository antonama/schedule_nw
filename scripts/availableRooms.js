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
                                scope.availableRooms = rooms.filter(function (item, index) {
                                    var cleanRoom = true;
                                    schedule.map(function (existingScheduleItem, classIndex) {
                                        if (existingScheduleItem.room && existingScheduleItem.room.title === item.title) {
                                            cleanRoom = false;
                                        }
                                    });
                                    if (nv.room && item.title === nv.room.title) {
                                        cleanRoom = true;
                                    }
                                    return cleanRoom;
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