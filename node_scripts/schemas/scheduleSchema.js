/**
 * Created by Anton on 5/17/2015.
 */

var scheduleSchema = mongoose.Schema({
    class: {type: mongoose.Schema.Types.ObjectId, ref: 'Class'},
    group: {type: mongoose.Schema.Types.ObjectId, ref: 'Group'},
    room: {type: mongoose.Schema.Types.ObjectId, ref: 'Room'},
    lecturer: {type: mongoose.Schema.Types.ObjectId, ref: 'Staff'},
    day: { type: Number, min: 0, max: 5},
    index: { type: Number, min: 0, max: 9},
    type: String
});