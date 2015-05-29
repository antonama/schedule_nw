/**
 * Created by Anton on 5/28/2015.
 */


(function () {
    angular.module("editor")
        .service("rfePreferences", function ($q) {
            var loading = true;

            return {
                getAllForLecturer: function (lecturer) {
                    var deferred = $q.defer();
                    var settings = [];
                    dbDeferred.promise.then(function () {
                        Preference.find()
                            .where("lecturer").equals(lecturer._id)
                            .exec(function (err, found) {
                                found.forEach(function (item) {
                                    settings.push(item.toObject());
                                });
                                loading = false;
                                deferred.resolve(settings);
                            });
                    });

                    return deferred.promise;
                },
                getAll: function () {
                    var deferred = $q.defer();
                    dbDeferred.promise.then(function () {
                        Preference.find()
                            .populate("lecturer")
                            .exec(function (err, found) {
                                loading = false;
                                deferred.resolve(found.map(function (item) {
                                    return item.toObject();
                                }));
                            });
                    });

                    return deferred.promise;
                },
                save: function (item) {
                    var dbItemDeferred = $q.defer();

                    dbDeferred.promise.then(function () {
                        if (item._id) {
                            Preference.findByIdAndUpdate(item._id, {
                                $set: item
                            }, function (err, item) {
                                if (!err) {
                                    dbItemDeferred.resolve();
                                } else {
                                    dbItemDeferred.reject();
                                }
                            });
                        } else {
                            var dbItem = new Preference(item);
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
                isLoading: function () {
                    return loading;
                }
            }
        });
})();