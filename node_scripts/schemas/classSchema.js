/**
 * Created by Anton on 4/21/2015.
 */

var classSchema = mongoose.Schema({
    title: String,
    types: [String],
    lecturers: [staffSchema]
});