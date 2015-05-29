/**
 * Created by Anton on 5/23/2015.
 */

var db = mongoose.createConnection('mongodb://anton.abramovich:9875321Velvifoz@ds053139.mongolab.com:53139/schedule');
var dbDeferred = q.defer();

var Schedule,
    Class,
    Group,
    Room,
    Settings,
    Staff,
    Announcement,
    Preference;

db.once('open', function () {
    Schedule = db.model("Schedule", scheduleSchema);
    Class = db.model("Class", classSchema);
    Group = db.model("Group", groupSchema);
    Room = db.model("Room", roomSchema);
    Settings = db.model("Settings", settingsSchema);
    Staff = db.model("Staff", staffSchema);
    Preference = db.model("Preference", preferenceSchema);

    Announcement = db.model("Announcement", announcementSchema);
    Announcement.collection.createIndex( { "expireAt": 1 }, { expireAfterSeconds: 0 }, function () {} );

    dbDeferred.resolve();
});