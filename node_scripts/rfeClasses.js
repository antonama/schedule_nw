/**
 * Created by Anton on 4/20/2015.
 */

(function () {
    var db = mongoose.createConnection('mongodb://anton.abramovich:9875321Velvifoz@ds041327.mongolab.com:41327/classes');
    var dbDeferred = q.defer();
    var Class;
    db.once('open', function () {
        dbDeferred.resolve();
        Class = db.model("Class", classSchema);
    });

    angular.module("editor")
        .service("rfeClasses", function ($q) {
            var loading = true;

            return {
                getAll: function () {
                    var deferred = $q.defer();

                    dbDeferred.promise.then(function () {
                        Class.find(function (err, found) {
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
                        var dbItem = new Class(item);
                        dbItem.save(function (err) {
                            if (!err) {
                                dbItemDeferred.resolve();
                            } else {
                                dbItemDeferred.reject();
                            }
                        })
                    });

                    return dbItemDeferred.promise;
                }
            }
        });
})();