/**
 * Created by Anton on 4/21/2015.
 */

var staffSchema = mongoose.Schema({
    avatar: String,
    position: String,
    rank: String,
    name: {
        full: String,
        first: String,
        surname: String,
        patronymic: String,
        initials: String
    },
    telephones: [String],
    email: {
        type: String
    },
    address: String
});