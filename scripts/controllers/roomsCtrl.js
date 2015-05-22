/**
 * Created by Anton on 5/22/2015.
 */

angular.module("editor")
    .controller("RoomsCtrl", function ($scope, rfeRooms, cfpLoadingBar) {
        cfpLoadingBar.start();

        $scope.saveItem = function () {
            rfeRooms.save($scope.newRoomItem).then(function () {
                update();
                clearItem({saveAddress: true});
            })
        };

        function update () {
            rfeRooms.getAll().then(function (rooms) {
                $scope.rooms = rooms;
                cfpLoadingBar.complete();
            });
        }

        function clearItem(options) {
            options.saveAddress ?
                $scope.newRoomItem = {
                    title: "",
                    address: $scope.newRoomItem.address
                } :
                $scope.newRoomItem = {
                    title: "",
                    address: ""
                }
        }

        update();
        clearItem({});
    });