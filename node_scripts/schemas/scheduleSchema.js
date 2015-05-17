/**
 * Created by Anton on 5/17/2015.
 */

var scheduleSchema = mongoose.Schema({
    class: [classSchema],
    group: [groupSchema],
    room: [roomSchema],
    day: { type: Number, min: 0, max: 5},
    index: { type: Number, min: 0, max: 9}
});