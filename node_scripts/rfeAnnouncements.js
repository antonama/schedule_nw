/**
 * Created by Anton on 5/23/2015.
 */

(function () {
    angular.module("editor")
        .service("rfeAnnouncements", function ($q) {
            var loading = true;

            return {
                getAll: function () {
                    var deferred = $q.defer();

                    dbDeferred.promise.then(function () {
                        Announcement
                            .find()
                            .populate("for")
                            .exec(function (err, found) {
                                var announcements = [];
                                found.forEach(function (item) {
                                    announcements.push(item.toObject());
                                });
                                loading = false;
                                deferred.resolve(announcements);
                            });
                    });

                    return deferred.promise;
                },
                isLoading: function () {
                    return loading;
                },
                save: function (item) {
                    var dbItemDeferred = $q.defer();

                    dbDeferred.promise.then(function () {
                        if (item._id) {
                            Announcement.findById(item._id, function (err, itemToUpdate) {
                                if (!err) {
                                    angular.forEach(item, function (value, key) {
                                        if (key.indexOf("_") < 0) {
                                            itemToUpdate[key] = value;
                                        }
                                    });
                                    itemToUpdate.save(function (err) {
                                        if (!err) {
                                            dbItemDeferred.resolve();
                                        } else {
                                            dbItemDeferred.reject();
                                        }
                                    });
                                }
                            });
                        } else {
                            var dbItem = new Announcement(item);
                            dbItem.save(function (err) {
                                if (!err) {
                                    dbItemDeferred.resolve();
                                } else {
                                    dbItemDeferred.reject();
                                }
                            });
                        }
                    });

                    return dbItemDeferred.promise;
                },
                delete: function (item) {
                    var deferred = $q.defer();
                    dbDeferred.promise.then(function () {
                        Announcement.findOneAndRemove({
                            _id: item._id
                        }, function (err, item) {
                            if (!err) {
                                deferred.resolve();
                            } else {
                                deferred.reject();
                            }
                        });
                    });

                    return deferred.promise;
                }
            }
        });
})();