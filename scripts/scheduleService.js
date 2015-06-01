angular.module("editor").factory("scheduleService", function (rfeSchedule, solver) {
    var self = this;

    this.dndItem = {};

    this.reason = "";

    return {
        get: function () {
            return self.dndItem;
        },
        set: function (item) {
            self.dndItem = item;
        },
        check: function (day, index, group, existingClass) {
            return checkTimeSlot(day, index, group, self.dndItem, existingClass);
        },
        getReason: function () {
            return self.reason;
        },
        setReason: function (reason) {
            self.reason = reason;
        }
    };

    function checkTimeSlot(day, index, group, futureClass, existingClass) {
        var available = true;
        //if (existingClass.length === 3) {
        //    deferred.reject("Слишком много предметов в это время");
        //} else {
        //    $q.when(solver.getUnavailableForLecturer(futureClass.lecturer)).then(function (time) {
        //        var breakFe = false;
        //        if (time && time.length) {
        //            time.forEach(function (item) {
        //                if (item.day === day && item.index === index && !breakFe) {
        //                    if (existingClass.length === 1) {
        //                        if (group.year === item.group.year && group.title !== item.group.title) {
        //                            if (item.lecturer.name.full === futureClass.lecturer.name.full &&
        //                                item.class.title === futureClass.class.title &&
        //                                item.type !== futureClass.type) {
        //                                breakFe = true;
        //                                deferred.reject("Lecturer " + item.lecturer.name.surname + " " + item.lecturer.name.initials
        //                                + " works with " + item.group.title + " group of year " + item.group.year
        //                                + " on " + item.class.title + ", " + item.type);
        //                            } else if (item.type === futureClass.type) {
        //                                breakFe = true;
        //                                deferred.resolve();
        //                            } else {
        //                                breakFe = true;
        //                                deferred.reject("Group " + item.group.title + " of " + item.group.year + " year already work at this time");
        //                            }
        //                        } else if (group.year !== item.group.year) {
        //                            breakFe = true;
        //                            deferred.reject("Group " + item.group.title + " of " + item.group.year + " year already work at this time");
        //                        }
        //                    } else {
        //                        if (item.lecturer.name.full !== futureClass.lecturer.name.full &&
        //                            item.class.title === futureClass.class.title) {
        //                            breakFe = true;
        //                            deferred.resolve();
        //                        } else {
        //                            deferred.reject("One lecturer can't teach the same class at the same time");
        //                        }
        //                    }
        //                } else if (!breakFe) {
        //                    if (existingClass.length === 1) {
        //                        deferred.resolve();
        //                    } else {
        //                        if (existingClass[0].lecturer.name.full !== futureClass.lecturer.name.full &&
        //                            existingClass[0].class.title === futureClass.class.title) {
        //                            deferred.resolve();
        //                        } else {
        //                            deferred.reject("Already taken");
        //                        }
        //                    }
        //                    breakFe = true;
        //                }
        //            });
        //        } else if (time && !time.length) {
        //            if (existingClass.length !== 1) {
        //                if (existingClass[0].lecturer.name.full !== futureClass.lecturer.name.full &&
        //                    existingClass[0].class.title === futureClass.class.title) {
        //                    breakFe = true;
        //                    deferred.resolve();
        //                } else {
        //                    deferred.reject("Already taken");
        //                }
        //            } else {
        //                if (existingClass.length === 1) {
        //                    deferred.resolve();
        //                } else {
        //                    deferred.reject("Already taken");
        //                }
        //            }
        //        } else {
        //            if (existingClass.length === 1) {
        //                deferred.resolve();
        //            } else {
        //                deferred.reject("Already taken");
        //            }
        //        }
        //    });
        //}
        if (futureClass) {
            if (existingClass.length === 2) {
                available = false;
                self.reason = "Слишком много предметов в это время";
            } else if (!existingClass.length) {
                var unavailableTime = solver.getUnavailableForLecturer(futureClass.lecturer);
                if (unavailableTime.length) {
                    var blockers = unavailableTime.filter(function (item) {
                        return item.day === day && item.index === index && item.class.title !== futureClass.title;
                    });
                    if (blockers.length) {
                        available = false;
                    }
                } else {

                }
            } else {
                if (existingClass && futureClass && futureClass.class) {
                    if (existingClass[0].class.title !== futureClass.class.title) {
                        available = false;
                        self.reason = "Таймслот занят";
                    } else if (existingClass[0].class.title === futureClass.class.title &&
                        existingClass[0].lecturer._id.toString() === futureClass.lecturer._id.toString()) {
                        available = false;
                        self.reason = "Преподаватель уже ведет данное занятие";
                    }
                }
            }
        }

        return available;
    }
});