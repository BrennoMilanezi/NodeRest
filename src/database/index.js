const mongoose = require('mongoose');

const URI_PRODUCAO = "mongodb"
const URI_TESTE = "mongodb://localhost/noderest"

mongoose.connect(URI_TESTE, {useNewUrlParser: true, useUnifiedTopology: true});
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.Promise = global.Promise;

module.exports = mongoose;