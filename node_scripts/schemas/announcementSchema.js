/**
 * Created by Anton on 5/23/2015.
 */

var announcementSchema = mongoose.Schema({
    body: String,
    expireAt: Date,
    for: [{type: mongoose.Schema.Types.ObjectId, ref: 'Group'}]
});