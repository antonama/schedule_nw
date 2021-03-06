/**
 * Created by Anton on 4/20/2015.
 */

(function () {
    angular.module("editor")
        .service("rfeClasses", function ($q) {
            var loading = true;

            return {
                getAll: function () {
                    var deferred = $q.defer();

                    dbDeferred.promise.then(function () {
                        Class.find()
                            .populate("lecturers")
                            .exec(function (err, found) {
                                var classes = [];
                                found.forEach(function (item) {
                                    classes.push(item.toObject());
                                });
                                loading = false;
                                deferred.resolve(classes);
                            })
                    });

                    return deferred.promise;
                },
                getAllForYear: function (year) {
                    var deferred = $q.defer();

                    dbDeferred.promise.then(function () {
                        Class.find()
                            .where("years").in([year])
                            .populate("lecturers")
                            .exec(function (err, found) {
                                var classes = [];
                                found.forEach(function (item) {
                                    classes.push(item.toObject());
                                });
                                loading = false;
                                deferred.resolve(classes);
                            })
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
                            Class.findByIdAndUpdate(item._id, {
                                $set: item
                            }, function (err, item) {
                                if (!err) {
                                    dbItemDeferred.resolve();
                                } else {
                                    dbItemDeferred.reject();
                                }
                            });
                        } else {
                            var dbItem = new Class(item);
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
                        Class.findOneAndRemove({
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