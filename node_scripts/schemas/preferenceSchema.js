/**
 * Created by Anton on 5/28/2015.
 */

var preferenceSchema = mongoose.Schema({
    lecturer: [{type: mongoose.Schema.Types.ObjectId, ref: 'Staff'}],
    dos: [{
        day: Number,
        index: Number
    }]
});
