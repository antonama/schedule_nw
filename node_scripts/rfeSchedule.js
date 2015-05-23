/**
 * Created by Anton on 5/17/2015.
 */

(function () {
    angular.module("editor")
        .service("rfeSchedule", function ($q) {
            var loading = true;

            return {
                getGroupSchedule: function (group) {
                    var deferred = $q.defer();

                    dbDeferred.promise.then(function () {
                        Schedule
                        .find()
                        .populate({
                            path: 'group',
                            match: {
                                _id: group._id
                            }
                        })
                        .populate("class lecturer")
                        .exec(function (err, found) {
                            var items = found.filter(function (item) {
                                return item.group ? true : false;
                            });
                            items.map(function (item) {
                                return item.toObject();
                            });
                            deferred.resolve(items);
                            loading = false;
                        });
                    });

                    return deferred.promise;
                },
                save: function (item) {
                    var dbItemDeferred = $q.defer();

                    dbDeferred.promise.then(function () {
                        var dbItem = new Schedule(item);
                        angular.forEach(item, function (value, key) {
                            dbItem[key] = value;
                        });
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
                        Schedule.findOneAndRemove(item._id, function (err) {
                            if (!err) {
                                dbItemDeferred.resolve();
                            } else {
                                dbItemDeferred.reject();
                            }
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