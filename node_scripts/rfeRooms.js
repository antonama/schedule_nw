/**
 * Created by Anton on 4/22/2015.
 */

(function () {
    var db = mongoose.createConnection('mongodb://anton.abramovich:9875321Velvifoz@ds053130.mongolab.com:53130/rooms');
    var dbDeferred = q.defer();
    var Room;
    db.once('open', function () {
        dbDeferred.resolve();
        Room = db.model("Room", roomSchema);
    });

    angular.module("editor")
        .service("rfeRooms", function ($q) {
            var loading = true;

            return {
                getAll: function () {
                    var deferred = $q.defer();
                    var rooms = [];
                    dbDeferred.promise.then(function () {
                        Room.find(function (err, found) {
                            found.forEach(function (item) {
                                rooms.push(item.toObject());
                            });
                            loading = false;
                            deferred.resolve(rooms);
                        })
                    });

                    return deferred.promise;
                },
                save: function (item) {
                    var dbItemDeferred = $q.defer();

                    dbDeferred.promise.then(function () {
                        var dbItem = new Room(item);
                        dbItem.save(function (err) {
                            if (!err) {
                                dbItemDeferred.resolve();
                            } else {
                                dbItemDeferred.reject();
                            }
                        })
                    });

                    return dbItemDeferred.promise;
                },
                isLoading: function () {
                    return loading;
                }
            }
        });
})();