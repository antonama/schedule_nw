angular.module("editor", [
    "ui.router",
    "cfp.loadingBar",
    "checklist-model",
    "ngDragDrop"
]);



angular.module("editor")

.directive("asideIscroll",
    function (iScrolls) {
        return function (scope, elem, attrs) {
            var asideIscroll = new IScroll(elem.get(0), {
                mouseWheel: true,
                scrollbars: true,
                fadeScrollbars: true,
                interactiveScrollbars: true,
                bounce: false,
                disableMouse: true
            });
            iScrolls.set("asideIScroll", asideIscroll);
        }
    })

.directive("contentIscroll",
    function ($rootScope, $timeout, iScrolls) {

        $rootScope.$on("$stateChangeSuccess", function () {
            $timeout(function () {
                iScrolls.get("contentIScroll").refresh();
            });
        });

        return function (scope, elem, attrs) {
            var contentIscroll = new IScroll(elem.get(0), {
                mouseWheel: true,
                scrollbars: true,
                fadeScrollbars: true,
                interactiveScrollbars: true,
                bounce: false,
                disableMouse: true
            });
            iScrolls.set("contentIScroll", contentIscroll);
        }
    })

.directive("fuzzy", function ($document, $parse) {
        return {
            restrict: "A",
            scope: {
                fuzzy: "=",
                originalItems: "=",
                ngModel: "=",
                keys: "@"
            },
            link: function (scope, elem, attrs) {
                var fuse;

                elem.attr("disabled", "");

                var unwatch = scope.$watch("originalItems", function (newValue) {
                    if (newValue && newValue.length) {
                        unwatch();

                        elem.removeAttr("disabled");

                        fuse = new Fuse(scope.originalItems, {
                            keys: $parse(scope.keys)(),
                            threshold: 0.4
                        });

                        scope.$watch("ngModel", function (newValue) {
                            if (newValue && fuse) {
                                scope.fuzzy = fuse.search(elem.val());
                            } else {
                                scope.fuzzy = scope.originalItems;
                            }
                        });

                        $($document).keyup(function (e) {
                           
                            if (e.keyCode == 27) {
                                scope.ngModel = "";
                                scope.$apply();
                            }
                        })
                    }
                });
            }
        }
    });
angular.module('editor')
.config(function ($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise("/home");

    $stateProvider.state("main", {
        abstract: true,
        views: {
            "": {
                templateUrl: "templates/main.html",
                controller: function ($scope, $history) {
                    $scope.$history = $history;
                }
            }
        }
    });

    $stateProvider.state("main.home", {
        url: "/home",
        views: {
            "": {
                templateUrl: "templates/home.html",
                controller: function ($scope, $timeout, iScrolls, rfeStaff, cfpLoadingBar) {
                    cfpLoadingBar.start();

                    rfeStaff.getAll().then(function (staff) {
                        $scope.staff = staff;
                        $timeout(function () {
                            iScrolls.get("contentIScroll").refresh();
                            cfpLoadingBar.complete();
                        }, 500);
                    });
                }
            },
            "asideView@main": {
                templateUrl: "templates/mainMenu.html"
            }
        }
    });

    $stateProvider.state("main.classes", {
        url: "/classes",
        views: {
            "": {
                templateUrl: "templates/classes.html",
                controller: function ($scope, $timeout, iScrolls, rfeClasses) {

                    $scope.$watch("newItemIsShown", function () {
                        if (iScrolls.get("contentIScroll")) {
                            $timeout(function () {
                                iScrolls.get("contentIScroll").refresh();
                            }, 250);
                        }
                    });

                    $scope.$watch("searchExpr", function () {
                        if (iScrolls.get("contentIScroll")) {
                            $timeout(function () {
                                iScrolls.get("contentIScroll").refresh();
                            }, 250);
                        }
                    });

                    $scope.clearItem = function (options) {
                        options.show ? $scope.newItemIsShown = true : $scope.newItemIsShown = false;

                        $scope.newClassItem = {
                            title: "",
                            types: [],
                            lecturers: []
                        };
                    };

                    $scope.clearItem({
                        show: false
                    });

                    $scope.saveItem = function () {
                        rfeClasses.save($scope.newClassItem).then(function () {
                            $scope.clearItem({
                                show: true
                            });
                        }, function () {
                            console.log("error")
                        }).finally(function () {
                            update();
                        })
                    };

                    $scope.availableClassTypes = ["lecture", "laboratory", "practic", "seminar"];

                    function update() {
                        rfeClasses.getAll().then(function (classes) {
                            $scope.classItems = classes;
                            $scope.filteredClassItems = classes;

                            $timeout(function () {
                                iScrolls.get("contentIScroll").refresh();
                            }, 250);
                            $scope.$applyAsync();
                        });
                    }

                    update();

                    $scope.searchExpr = "";

                    $scope.onDrop = function () {
                        $scope.newClassItem.lecturers.push($scope.lecturer);
                        $timeout(function () {
                            iScrolls.get("contentIScroll").refresh();
                        }, 250);
                    };
                }
            },
            "asideView@main": {
                templateUrl: "templates/lecturersList.html",
                controller: function ($scope, $timeout, iScrolls, cfpLoadingBar, rfeStaff) {
                    cfpLoadingBar.start();

                    rfeStaff.getAll().then(function (staff) {
                        $scope.staffItems = staff;
                        $scope.filteredStaffItems = staff;

                        $timeout(function () {
                            iScrolls.get("asideIScroll").refresh();
                            cfpLoadingBar.complete();
                        }, 500);
                    });

                    $scope.searchExpr = "";

                    $scope.$watch("searchExpr", function () {
                        if (iScrolls.get("asideIScroll")) {
                            $timeout(function () {
                                iScrolls.get("asideIScroll").refresh();
                            }, 250);
                        }
                    });
                }
            }
        }
    });
});


angular.module("editor").service("iScrolls", function () {
    var self = this;

    this.map = {};

    return {
        get: function (name) {
            return self.map[name];
        },
        set: function (name, instance) {
            self.map[name] = instance;
        }
    };
})
.service("$history", function ($rootScope, $state, $location) {

        var backClicked = false,
            forwardClicked = false,
            historyStates = {
                current: {},
                previous: [],
                next: [],
                length: 0
            };

        var unwatchFirstState = $rootScope.$watch(function () {
            return $state.current;
        }, function (newValue) {
            if (newValue) {
                historyStates.current = newValue;
                historyStates.length++;
                unwatchFirstState();
            }
        });

        $rootScope.$on('$stateChangeSuccess', function (ev, to) {
            if (!backClicked && !forwardClicked) {
                historyStates.previous.push(historyStates.current);
                historyStates.next = [];
                historyStates.current = to;
            } else if (backClicked) {
                historyStates.next.push(historyStates.current);
                historyStates.current = historyStates.previous.pop();
                backClicked = false;
            } else {
                historyStates.previous.push(historyStates.current);
                historyStates.current = historyStates.next.pop();
                forwardClicked = false;
            }
        });

        return angular.extend(historyStates, {
            hasPrevious: function () {
                return !!historyStates.previous.length;
            },
            hasNext: function () {
                return !!historyStates.next.length
            },
            back: function () {
                if (!!historyStates.previous.length) {
                    $location.path(historyStates.previous[historyStates.previous.length - 1].url);
                    backClicked = true;
                }
            },
            forward: function () {
                if (!!historyStates.next.length) {
                    $location.path(historyStates.next[historyStates.next.length - 1].url);
                    forwardClicked = true;
                }
            }
        });
    });


angular.module("editor")
.directive("collapsible", function ($timeout, iScrolls) {
        return {
            restrict: "A",
            link: function (scope, elem, attrs) {
                elem.collapsible({
                    accordion : false
                });

                elem.find("li").on("click", function () {
                    $timeout(function () {
                        iScrolls.get("asideIScroll").refresh();
                    }, 500);
                })
            }
        }
    });