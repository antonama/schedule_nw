/**
 * Created by Anton on 5/25/2015.
 */

angular.module("editor")
    .factory("solver", function ($rootScope, $q, rfeSchedule) {
        return {
            getUnavailableForLecturer: function (lecturer) {
                var schedule = [];

                if (lecturer) {
                    schedule = rfeSchedule.getScheduleObject();
                    schedule = schedule.filter(function (item) {
                        return item.lecturer && item.lecturer._id.toString() === lecturer._id.toString();
                    });
                }

                return schedule;
            }
        }
    });