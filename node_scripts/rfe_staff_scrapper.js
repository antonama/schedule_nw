/**
 * Created by Anton on 4/20/2015.
 */

var request = require("request"),
    cheerio = require("cheerio"),
    q = require("q");

var staffUrls = [
    "http://www.rfe.by/chairs/radiophysics/staff",
    "http://www.rfe.by/chairs/kvant/staff",
    "http://www.rfe.by/chairs/phys-el/staff",
    "http://www.rfe.by/chairs/informatics/staff",
    "http://www.rfe.by/chairs/is/staff",
    "http://www.rfe.by/chairs/cyber/staff",
    "http://www.rfe.by/chairs/sis/staff",
    "http://www.rfe.by/chairs/physics/staff"
];

var staff = [],
    single,
    loading = false,
    staffDeffered = q.defer();

function clearSingle () {
    single = {
        avatar: "",
        position: "",
        rank: "",
        name: {
            full: "",
            first: "",
            surname: "",
            patronymic: "",
            initials: ""
        },
        telephones: [],
        email: "",
        address: ""
    };
}

function scrap () {
    loading = true;
    var count = 0;
    staffUrls.forEach(function (value, index, array) {
        request.get(value, function (err, resp, body) {
            var $ = cheerio.load(body);
            processStaff($);
            if (count == array.length - 1) {
                staffDeffered.resolve(staff);
                loading = false;
            }
            count++;
        });
    });
}

function processStaff ($) {
    var staffArray = $(".h-menu + h1 + table").find("tr");
    staffArray.each(function (index, elem) {
        var textNodes = $(this).children().last().text().split("\n");

        clearSingle();

        getAvatar(single, $, this);
        getPosition(single, textNodes);
        getName(single, textNodes);

        single.avatar ? staff.push(single) : null;
    });
}

function getAvatar (single, $, self) {
    var src = $(self).find("td img").attr("src");
    if (src) {
        single.avatar = "http://www.rfe.by" + src;
    }
}

function getPosition (single, textNodes) {
    single.position = textNodes[1].trim();
}

function getName (single, textNodes) {
    var name, first, surname, patronymic;

    textNodes = textNodes.filter(function (item) {
       return item.trim().length > 0
    });
    if (textNodes && textNodes[1]) {
        name = textNodes[1].trim().split(",")[0];
        first = name.split(" ")[1];
        surname = name.split(" ")[0];
        patronymic = name.split(" ")[2];

        single.name.full = name;
        single.name.first = first;
        single.name.surname = surname;
        single.name.patronymic = patronymic;

        single.name.initials = first[0] + ". " + patronymic[0] + "."
    }
}

scrap();

angular.module("editor")
    .service("rfeStaff", function ($q) {
        return {
            getAll: function () {
                return staffDeffered.promise;
            },
            isLoading: function () {
                return loading;
            }
        }
    });