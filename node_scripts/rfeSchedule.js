/**
 * Created by Anton on 5/17/2015.
 */

(function () {
    var db = mongoose.createConnection('mongodb://anton.abramovich:9875321Velvifoz@ds053139.mongolab.com:53139/schedule');
    var dbDeferred = q.defer();
    var Schedule;
    db.once('open', function () {
        dbDeferred.resolve();
        Schedule = db.model("Schedule", scheduleSchema);
    });

    angular.module("editor")
        .service("rfeSchedule", function ($q) {
            var loading = true;

            return {
                getGroupSchedule: function (year, groupTitle) {
                    Schedule.find({
                        group: {
                            year: year,
                            title: groupTitle
                        }
                    }, function (err, found) {
                        console.log(found.toObject());
                        loading = false;
                    })
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