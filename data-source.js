require('dotenv').config();

var { DataSource } =require('typeorm');

const AppDataSource = new DataSource({
    "type": "mongodb",
    "url": "mongodb+srv://admin:Tram250399@cluster0.rjpbb2k.mongodb.net/nodejs-31-database",
    "useNewUrlParser": true,
    "synchronize": true,
    "logging": true,
    "entities": ["src/entity/*.*"]
  });
module.exports ={ AppDataSource };