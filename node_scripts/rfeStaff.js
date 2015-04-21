/**
 * Created by Anton on 4/20/2015.
 */

(function () {
    var db = mongoose.createConnection('mongodb://anton.abramovich:9875321Velvifoz@ds031691.mongolab.com:31691/staff');
    var dbDeferred = q.defer();
    var Staff;
    db.once('open', function () {
        dbDeferred.resolve();
        Staff = db.model("Staff", staffSchema);
    });

    angular.module("editor")
        .service("rfeStaff", function ($q) {
            var loading = true;

            var staff = [];

            return {
                getAll: function () {
                    var deferred = $q.defer();
                    dbDeferred.promise.then(function () {
                        if (!staff.length) {
                            Staff.find(function (err, found) {
                                found.forEach(function (item) {
                                    staff.push(item.toObject());
                                });
                                loading = false;
                                deferred.resolve(staff);
                            })
                        } else {
                            deferred.resolve(staff);
                        }
                    });

                    return deferred.promise;
                },
                isLoading: function () {
                    return loading;
                }
            }
        });
})();