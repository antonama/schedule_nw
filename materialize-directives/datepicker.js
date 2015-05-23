/**
 * Created by Anton on 5/23/2015.
 */

angular.module("editor")
    .directive("datepicker", function ($timeout, iScrolls) {
        return {
            restrict: "AEC",
            scope: {
                selectedDate: "=",
                updateDate: "="
            },
            link: function (scope, elem, attrs) {
                var $input = elem.pickadate({
                    selectMonths: true, // Creates a dropdown to control month
                    selectYears: 2, // Creates a dropdown of 15 years to control year
                    firstDay: 1,
                    onSet: function(context) {
                        scope.selectedDate = context.select;
                    }
                    //monthsFull: ['Январь', 'Февраль', 'Март', 'Аперль', 'Май', 'Июнь', 'Июль', 'Август',
                    //    'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'],
                    //weekdaysShort: ['Пон', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'],
                    //today: 'сегодня',
                    //clear: 'очистить',
                    //formatSubmit: 'd mmmm, yyyy'
                });

                var picker = $input.pickadate('picker');

                elem.click(function () {
                    $timeout(function () {
                        iScrolls.get("contentIScroll").refresh();
                    }, 1000);
                });

                scope.$watch("updateDate", function (nw) {
                    picker.set("select", nw);
                });
            }
        }
    });