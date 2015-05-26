/**
 * Created by Anton on 5/25/2015.
 */

angular.module("editor")
    .factory("solver", function ($rootScope, $q, rfeSchedule) {
        return {
            getUnavailableForLecturer: function (lecturer) {
                if (lecturer) {
                    return rfeSchedule.getUnavailableForLecturer(lecturer);
                } else {
                    return $q.when(null);
                }
            }
        }
    });