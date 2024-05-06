// npm install mongodb@5 -> 몽고 디비 5버전으로 설치

const {MongoClient, ObjectId} = require('mongodb');
const url = process.env.DB_URL;

// 이 부분만 export 하는 이유는 db 변수는 변수가 완성되기까지 시간이 좀 오래 걸림.
// 그래서 먼저 연결하고 그 뒤에 디비에 담는 거임. db를 같이 exports 하면 뭔가 안될 수가 있음.
let connectDB = new MongoClient(url).connect();

module.exports = connectDB;