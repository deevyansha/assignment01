const mongoose = require('mongoose');

const mon = mongoose.connect('mongodb+srv://admin:admin@cluster0.oiiu8zo.mongodb.net/test002?retryWrites=true&w=majority', {
  useNewUrlParser: true,
  useUnifiedTopology: true,

}).then(() => {
  console.log('MongoDB Atlas connected successfully!');
}).catch((error) => {
  console.log('Error connecting to MongoDB Atlas: ', error);
});
