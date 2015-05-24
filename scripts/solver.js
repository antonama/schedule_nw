/**
 * Created by Anton on 5/25/2015.
 */

angular.module("editor")
    .factory("solver", function ($rootScope, rfeSchedule) {
        return {
            getUnavailableForLecturer: function (lecturer) {
                rfeSchedule.getUnavailableForLecturer(lecturer).then(function (schedule) {
                    $rootScope.$broadcast("rfeLecturerTimeFindEnd", schedule);
                });
            }
        }
    });