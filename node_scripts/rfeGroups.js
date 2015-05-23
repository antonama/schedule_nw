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
                    var groups = [];
                    dbDeferred.promise.then(function () {
                        Group.find(function (err, found) {
                            found.forEach(function (item) {
                                groups.push(item.toObject());
                            });
                            loading = false;
                            deferred.resolve(groups);
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
                    var years = [];
                    dbDeferred.promise.then(function () {
                        Group.aggregate([
                            {$group: {
                                _id: "$year",
                                groups: { $push: {title: '$title'} }
                            }}
                        ], function (err, found) {
                            found.forEach(function (item) {
                                years.push({
                                    number: item._id,
                                    groups: item.groups
                                });
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
                            year: year.number ? year.number : year
                        }, function (err, found) {
                            found.forEach(function (item) {
                                groups.push(item.toObject());
                            });
                            loading = false;
                            deferred.resolve(groups);
                        });
                    });

                    return deferred.promise;
                }
            }
        });
})();