/**
 * Created by Anton on 5/17/2015.
 */

(function () {
    angular.module("editor")
        .service("rfeGroups", function ($q) {
            var loading = true;

            return {
                getAll: function () {
                    var deferred = $q.defer();
                    dbDeferred.promise.then(function () {
                        Group.find(function (err, found) {
                            loading = false;
                            deferred.resolve(found.map(function (item) {
                                return item.toObject();
                            }));
                        })
                    });

                    return deferred.promise;
                },
                save: function (item) {
                    var dbItemDeferred = $q.defer();

                    dbDeferred.promise.then(function () {
                        var dbItem = new Group(item);
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
                },
                getYears: function () {
                    var deferred = $q.defer();
                    var years = {};
                    dbDeferred.promise.then(function () {
                        Group.find(function (err, found) {
                            found.forEach(function (item, index) {
                                if (!years[item.year]) {
                                    years[item.year] = [];
                                }
                                years[item.year].push(item.toObject());
                            });
                            loading = false;
                            deferred.resolve(years);
                        });
                    });

                    return deferred.promise;
                },
                getGroupsForYear: function (year) {
                    var deferred = $q.defer();
                    var groups = [];
                    dbDeferred.promise.then(function () {
                        Group.find({
                            year: year
                        }, function (err, found) {
                            found.forEach(function (item) {
                                groups.push(item.toObject());
                            });
                            loading = false;
                            deferred.resolve(groups);
                        });
                    });

                    return deferred.promise;
                },
                delete: function (item) {
                    var deferred = $q.defer();
                    dbDeferred.promise.then(function () {
                        Group.findOneAndRemove({
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