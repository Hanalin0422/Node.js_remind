const router = require('express').Router();
let connectDB = require('./../database')

let db;
connectDB.then((client)=>{
    console.log('DB 연결 성공')
    db = client.db('forum');
}).catch((err)=>{
    console.log(err)
})



// API를 다른 파일로 빼고 싶으면 routes라는 폴더를 하나 생성
router.get('/shirts', async(req, res)=>{
    await db.collection('post').find().toArray()
    res.send('셔츠파는 페이지임');
})
router.get('/pants', (req, res)=>{
    res.send('바지파는 페이지임')
})

module.exports = router;