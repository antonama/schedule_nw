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
                        .populate("class lecturer room")
                        .exec(function (err, found) {
                            var items = found.filter(function (item) {
                                return item.group ? true : false;
                            });
                            items = items.map(function (item) {
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
                        if (item._id) {
                            Schedule.findByIdAndUpdate(item._id, {
                                $set: item
                            }, function (err, itemToUpdate) {
                                if (!err) {
                                    dbItemDeferred.resolve();
                                } else {
                                    dbItemDeferred.reject();
                                }
                            });
                        } else {
                            var dbItem = new Schedule(item);
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
                    var dbItemDeferred = $q.defer();

                    dbDeferred.promise.then(function () {
                        Schedule.findOneAndRemove({
                            _id: item._id
                        }, function (err) {
                            if (!err) {
                                dbItemDeferred.resolve();
                            } else {
                                dbItemDeferred.reject();
                            }
                        });
                    });

                    return dbItemDeferred.promise;
                },
                getUnavailableForLecturer: function (lecturer) {
                    var dbItemDeferred = $q.defer();

                    dbDeferred.promise.then(function () {
                        Schedule
                            .find()
                            .where("lecturer").equals(lecturer._id)
                            .populate("class lecturer group")
                            .exec(function (err, found) {
                                if (!err) {
                                    dbItemDeferred.resolve(found.map(function (item) {
                                        return item.toObject();
                                    }));
                                } else {
                                    dbItemDeferred.reject();
                                }
                            });
                    });

                    return dbItemDeferred.promise;
                },
                getAllOfDayClass: function (day, index) {
                    var dbItemDeferred = $q.defer();

                    dbDeferred.promise.then(function () {
                        Schedule
                            .find()
                            .where("day").equals(day)
                            .where("index").equals(index)
                            .populate("room lecturer")
                            .exec(function (err, found) {
                                if (!err) {
                                    dbItemDeferred.resolve(found.map(function (item) {
                                        return item.toObject();
                                    }));
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