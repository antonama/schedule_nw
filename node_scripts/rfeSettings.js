/**
 * Created by Anton on 5/22/2015.
 */

(function () {
    var db = mongoose.createConnection('mongodb://anton.abramovich:9875321Velvifoz@ds037262.mongolab.com:37262/settings');
    var dbDeferred = q.defer();
    var Settings;
    db.once('open', function () {
        dbDeferred.resolve();
        Settings = db.model("Settings", settingsSchema);
    });

    angular.module("editor")
        .service("rfeSettings", function ($q) {
            var loading = true;

            return {
                getAll: function () {
                    var deferred = $q.defer();
                    var settings = [];
                    dbDeferred.promise.then(function () {
                        Settings.find(function (err, found) {
                            found.forEach(function (item) {
                                settings.push(item.toObject());
                            });
                            loading = false;
                            deferred.resolve(settings);
                        })
                    });

                    return deferred.promise;
                },
                save: function (item) {
                    var dbItemDeferred = $q.defer();

                    dbDeferred.promise.then(function () {
                        var dbItem = new Settings(item);
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
                getItemByUniqueId: function (id) {
                    var dbItemDeferred = $q.defer();

                    dbDeferred.promise.then(function () {
                        Settings.find({
                            uniqueId: id
                        }, function (err, item) {
                            if (!err) {
                                dbItemDeferred.resolve(item[0].toObject().value);
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