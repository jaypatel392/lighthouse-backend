const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

const MIGRATIONS_PATH = path.join(__dirname, '..', 'models');

mongoose.connect('mongodb+srv://lhadmin:qLDx3yDUdOW3wSbo@cluster0.z3ios.mongodb.net/lighthouse' , {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log('MongoDB Connected'))
.catch(err => console.log(err));

const modelDirs = fs.readdirSync(MIGRATIONS_PATH);

modelDirs.forEach((model) => {
  console.log(`============ Initializing Model: ${model} ============`);
  require(path.join(MIGRATIONS_PATH, model));
});

module.exports = mongoose;
