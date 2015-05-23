/**
 * Created by Anton on 5/22/2015.
 */

angular.module("editor")
    .controller("RoomsCtrl", function ($scope, rfeRooms, rfeSettings, cfpLoadingBar) {
        cfpLoadingBar.start();

        $scope.saveItem = function () {
            rfeRooms.save($scope.newRoomItem).then(function () {
                update();
                clearItem();
            })
        };

        $scope.deleteItem = function (item) {
            rfeRooms.delete(item).then(function () {
                update();
            })
        };

        function update () {
            rfeRooms.getAll().then(function (rooms) {
                $scope.rooms = rooms;
                cfpLoadingBar.complete();
            });
        }

        function clearItem() {
            $scope.newRoomItem = {
                title: "",
                types: []
            }
        }

        rfeSettings.getItemByUniqueId("classesTypes").then(function (types) {
            $scope.availableRoomTypes = types.split(",");
        });

        update();
        clearItem({});
    });