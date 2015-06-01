angular.module("editor").factory("scheduleService", function (rfeSchedule, solver) {
    var self = this;

    this.dndItem = {};

    this.reasons = [];

    this.moving = false;

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
        getReason: function (day, index, classItem, group) {
            return self.reasons.filter(function (item) {
                return item.day === day && item.index === index
            }).pop();
        },
        setReason: function (reason) {
            self.reasons = reason;
        },
        setMoving: function (moving) {
            self.moving = moving;
        },
        isMoving: function () {
            return self.moving;
        }
    };

    function checkTimeSlot(day, index, group, futureClass, existingClass) {
        var available = true;

        if (futureClass) {
            if (existingClass.length === 2) {
                available = false;
                self.reasons.push({
                    day: existingClass[0].day,
                    index: existingClass[0].index,
                    text: "Слишком много занятий в это время"
                });
            } else if (!existingClass.length) {
                var unavailableTime = solver.getUnavailableForLecturer(futureClass.lecturer);
                if (unavailableTime.length) {
                    var blockers = unavailableTime.filter(function (item) {
                        return item.day === day && item.index === index &&
                            (item.class.title === futureClass.title && item.type !== futureClass.type);
                    });
                    if (blockers.length) {
                        available = false;
                        self.reasons.push({
                            day: blockers[0].day,
                            index: blockers[0].index,
                            text: "Преподаватель ведет занятие \"" + blockers[0].class.title + "\" у группы " + blockers[0].group.title + " курса " + blockers[0].group.year
                        });
                    }
                } else {

                }
            } else {
                if (existingClass && futureClass && futureClass.class) {
                    if (existingClass[0].title !== futureClass.title) {
                        available = false;
                        self.reasons.push({
                            day: existingClass[0].day,
                            index: existingClass[0].index,
                            text: "Таймслот занят"
                        });
                    } else if (existingClass[0].title === futureClass.title &&
                        existingClass[0].lecturer._id.toString() === futureClass.lecturer._id.toString()) {
                        available = false;
                        self.reasons.push({
                            day: existingClass[0].day,
                            index: existingClass[0].index,
                            text: "Преподаватель уже ведет данное занятие"
                        });
                    }
                }
            }
        }

        return available;
    }
});