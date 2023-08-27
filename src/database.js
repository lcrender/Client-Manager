const mongoose = require('mongoose');
//const MONGODB_URI = process.env.MONGODB_URI;

const { NOTES_APP_MONGODB_HOST, NOTES_APP_MONGODB_DATABASE } = process.env;
// const MONGODB_URI = `mongodb+srv://${NOTES_APP_MONGODB_HOST}/${NOTES_APP_MONGODB_DATABASE}`;
const MONGODB_URI = `mongodb+srv://lcrender:a3dniBMlZyuglYyt@cluster0.glfs4lv.mongodb.net/test`;



mongoose.set('strictQuery', false);
mongoose.connect(MONGODB_URI, {
})
    .then(db => console.log("Database Connected"))
    .catch(err => console.log(err))