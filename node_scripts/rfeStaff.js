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
        .service("rfeStaff", function ($q, rfeSettings) {
            var loading = true;

            return {
                getAll: function () {
                    var deferred = $q.defer();
                    var staff = [];
                    dbDeferred.promise.then(function () {
                        Staff.find(function (err, found) {
                            found.forEach(function (item) {
                                staff.push(item.toObject());
                            });
                            loading = false;
                            deferred.resolve(staff);
                        })
                    });

                    return deferred.promise;
                },
                delete: function (item) {
                    var deferred = $q.defer();

                    dbDeferred.promise.then(function () {
                        Staff.findOneAndRemove({
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
                },
                save: function (item) {
                    var dbItemDeferred = $q.defer();

                    createInitials(item);
                    createFull(item);
                    createAvatar(item).then(function () {
                        dbDeferred.promise.then(function () {
                            if (item._id) {
                                Staff.findById(item._id, function (err, itemToUpdate) {
                                    if (!err) {
                                        angular.forEach(item, function (value, key) {
                                            if (key.indexOf("_") < 0) {
                                                itemToUpdate[key] = value;
                                            }
                                        });
                                        itemToUpdate.save(function (err) {
                                            if (!err) {
                                                dbItemDeferred.resolve();
                                            } else {
                                                dbItemDeferred.reject();
                                            }
                                        });
                                    }
                                });
                            } else {
                                var dbItem = new Staff(item);
                                dbItem.save(function (err) {
                                    if (!err) {
                                        dbItemDeferred.resolve();
                                    } else {
                                        dbItemDeferred.reject();
                                    }
                                });
                            }
                        });
                    });

                    function createInitials (person) {
                        person.name.initials = person.name.first.charAt(0) + ". " + person.name.patronymic.charAt(0) + ".";
                    }

                    function createFull (person) {
                        person.name.full = person.name.surname.trim() + " " + person.name.first.trim() + " " + person.name.patronymic.trim();
                    }

                    function createAvatar (item) {
                        return rfeSettings.getItemByUniqueId("defaultAvatar").then(function (avatarUrl) {
                            item.avatar = item.avatar ? item.avatar : avatarUrl;
                        });
                    }

                    return dbItemDeferred.promise;
                },
                isLoading: function () {
                    return loading;
                }
            }
        });
})();