// express 라이브러리를 사용하겠다는 뜻. 이제 express 문법으로 서버를 쉽게 제작할 수 있음.
const express = require('express')
const app = express()

// 이걸 적어야 img, css, js jpg 와 같은 static 파일들, 변동 사항이 없는 파일들을 쓰고 싶으면 이걸 적어줘야함.
app.use(express.static(__dirname + '/public'))

// ejs 셋팅하는 법
app.set('view engine', 'ejs')

//user가 데이터를 보내면 그걸 꺼내쓰는게 좀 귀찮음. 
// 그래서 요청.body를 쉽게 꺼내서 쓸 수 있게 필수적으로 추가하는 코드 2줄임.
app.use(express.json())
app.use(express.urlencoded({extended:true}))


// npm install mongodb@5 -> 몽고 디비 5버전으로 설치
// mongodb+srv://easy:AvPGFnjzf5jurNfe@cluster0.t4jbogm.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
// mongodb+srv://easy:<password>@cluster0.t4jbogm.mongodb.net/
const {MongoClient, ObjectId} = require('mongodb');
let db;
const url = 'mongodb+srv://easy:AvPGFnjzf5jurNfe@cluster0.t4jbogm.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';
new MongoClient(url).connect()
.then((client)=>{
    console.log('DB 연결 성공')
    db = client.db('forum');
    // 내 컴퓨터의 port를 오픈하는 방법.
    //ip주소 + port 번호를 통해서 인터넷에 들어올 수 있음.
    // db 연결이 성공해야 서버를 띄우는게 맞는 순서
    app.listen(8080, ()=>{
        console.log('http://localhost:8080에서 서버 실행중')
    })
}).catch((err)=>{
    console.log(err)
})








// 간단한 서버 기능임, 누가 메인페이지에 접속하면 반갑다는 응답을 보내줌.
// 컴퓨터는 외부 컴퓨터들과 자유롭게 통신할 수 있게 되어 있지만 웹 서비스에 접속은 평상시에 접속할 수가 없음.
// 그래서 구멍을 뚫어놓으면 그 구멍에 맞춰서 들어가 접속하는 거임.
app.get('/', (요청, 응답)=>{
    응답.send('반갑다')
})

//콜백 함수 : 함수 안에 들어간 함수를 말함.
// 누가 /shop 접속시 app.get() 함수 실행됨. 그 다음 콜백함수 실행됨.
//콜백 함수를 사용할 수 있는 곳만 사용가능함.
// 아무튼 결론은 콜백함수라는 것.
app.get('/news', (요청, 응답)=>{
    db.collection('post').insertOne({title : '어쩌구'})
    // 응답.send('오늘 황사 개쩜')
})

app.get('/shop', (요청, 응답)=>{
    응답.send('쇼핑페이지임')
})

//유저에게 html 파일을 보내주는 방법
app.get('/pretty', (요청, 응답)=>{
    // 현재 프로젝트의 절대 경로를 입력하는 방식임
    응답.sendFile(__dirname + '/index.html')
})

app.get('/intro', (요청, 응답)=>{
    응답.sendFile(__dirname + '/introduction.html')
})


// 대용량과 입출력을 위해서 db를 사용.
// 관계형 데이터 베이스 vs 비관계형 데이터 베이스
// 데이터의 정확도가 중요하다 -> 보통 관계형 데이터베이스
// 다양한 형식으로 데이터를 저장하고 싶다 -> 비관계형 데이터 베이스
// 보통 비관계형 데이터베이스는 빠르게 입출력이 가능. 근데 나중에 데이터를 수정하거나 삭제할 때는 좀 그럼.
// 근데 경향만 이렇구나~ 정도.
// 몽고디비는 테이블 정의 필요없고 SQL 몰라도 되고 정규화도 안해도 됨.
// 몽고디비는 컴퓨터에 직접 설치하거나 클라우드 호스팅받거나 두가지가 있음.
// 무료 티어, 서울 지역 선택, DB 접속용 아이디 생성, DB 접속용 IP 등록
// document 1개는 엑셀의 행 1개와 같음


// 컬렉션의 모든 도큐먼트들을 출력하는 방법, 그냥 외우면 됨.
// 참고로 await은 정해진 곳만 붙일 수 있음. promise를 뱉는 곳.
// 참고22 무슨 DB를 써도 다 비슷비슷함.
app.get('/list', async (요청, 응답)=>{
    let result = await db.collection('post').find().toArray();
    let now = new Date();
    // 서버에서 콘솔.로그를 쓰면 터미널에서 출력됨.
    // 자바스크립트는 처리가 오래걸리는 코드로 처리완료 기다리지 않고 바로 다음줄을 실행함.
    // console.log(result)
    // ejs는 원래 views 파일 안에 넣기로 강제되기 때문에 그냥 이렇게 써도 됨.
    응답.render('list.ejs', {글목록 : result, 시간 : now})
    // 미리 데이터를 이렇게 처리해서 유저들에게 짠하고 보여주는게 서버사이드렌더링
})

// 서버는 누가 요청을 보내면 그걸 처리해주는 프로그램일 뿐임.
// 유저가 서버에게 요청을 한다고 했는데 요청을 형식에 맞춰서 보내야 처리를 해줄 수 있음.
// 1. method(GET, POST, PUT, UPDATE, DELETE), 2. url(endpoint)를 잘 기입해야 서버가 이 요청을 받아서 처리할 수 있음.
// API 프로그램 사용법, 서버 기능을 멋있게 부르는 방법
// 유저가 서버에게 요청을 보낸다고 했는데 대체 어떻게 보내는데?
// -> 누구나 알고 있는 get 요청, post 요청은 유저가 서버로 데이터 전송할 수 있음.
// 유저는 어떤 url, method 적어야 하는지 모르는데?, 보통 웹 페이지에 숨겨놓음.

//REST API
// 1. 일관성 있는 Url이 좋음
// 2. 유저에게 서버 역할 맡기지 않기
// 3. 요청끼리 서로 의존성이 있으면 안됨
// 4. 서버 자료들, 요청들은 캐싱이 가능해야함. 자주 수신되는 자료들은 요청X
// 5, 6.은 있지만 딱히 몰라도 됨.

// 좋은 url 작명 관습
// 동사보다는 명사 위주로
// 띄어쓰기는 언더바_대신 대시-기호
// 파일 확장자 쓰지 말기 (.html 이런거)
// 하위문서들을 뜻할 땐 / 기호를 사용함. (하위폴더같은 느낌)

// 글 작성 기능
// 1. 글작성페이지에서 글써서 서버로 전송
// 2. 서버는 글을 검사
// 3. 이상없으면 DB에 저장
app.get('/write', (요청, 응답)=>{
    응답.render('write.ejs')
})
app.post('/add', async(요청, 응답)=>{
    try{

        if(요청.body.title == '' || 요청.body.content == ''){
            응답.render('alert.ejs', {error:'내용을 입력해 주세요!'});
        }else{   
            // post라는 컬렉션에 하나의 도큐먼트를 만들어주는 거임.
            await db.collection('post').insertOne({title : 요청.body.title, content : 요청.body.content});
            // 서버 기능 실행이 끝나면 항상 응답해주기
            응답.redirect('/list');
        }
    } catch(e){
        console.log(e)
        응답.status(500).send('서버에 에러남.')
    }

    // //에러시 다른 코드 실행은 try/catch
    // try{
    //     여기 코드 실행해보고 안되면
    // }catch(e){
    //     이 코드를 실행해 주세요
    // }

})

// 유저가 : 뒤에 아무 거나 입력한다면
app.get('/detail/:id', async(req,res)=>{
    const id = req.params.id;
    let result = await db.collection('post').findOne({_id : new ObjectId(id)})
    res.render('detail.ejs', {title : result.title, content : result.content})
})