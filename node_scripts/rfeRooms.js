/**
 * Created by Anton on 4/22/2015.
 */

(function () {
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
                delete: function (item) {
                    var dbItemDeferred = $q.defer();

                    dbDeferred.promise.then(function () {
                        Room.findOneAndRemove({
                            _id: item._id
                        }, function (err) {
                            if (!err) {
                                dbItemDeferred.resolve();
                            } else {
                                dbItemDeferred.reject();
                            }
                        })
                    });

                    return dbItemDeferred.promise;
                },
                getAllOfType: function (type) {
                    var dbItemDeferred = $q.defer();

                    dbDeferred.promise.then(function () {
                        Room.find({
                            types: { $in: [type] }
                        }, function (err, found) {
                            dbItemDeferred.resolve(found.map(function (item) {
                                return item.toObject();
                            }));
                        });
                    });

                    return dbItemDeferred.promise;
                },
                isLoading: function () {
                    return loading;
                }
            }
        });
})();