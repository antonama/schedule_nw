/**
 * Created by Anton on 5/17/2015.
 */

(function () {
    angular.module("editor")
        .service("rfeSchedule", function ($q) {
            var loading = true;

            return {
                getGroupSchedule: function (year, groupTitle) {
                    var deferred = $q.defer();
                    //var schedule = [];
                    dbDeferred.promise.then(function () {
                        Schedule.find({
                            group: {
                                year: year,
                                title: groupTitle
                            }
                        }, function (err, found) {
                            deferred.resolve(found);
                            loading = false;
                        })
                    });

                    return deferred.promise;
                },
                save: function (item) {
                    var dbItemDeferred = $q.defer();

                    dbDeferred.promise.then(function () {
                        var dbItem = new Schedule(item);
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