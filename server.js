// express 라이브러리를 사용하겠다는 뜻. 이제 express 문법으로 서버를 쉽게 제작할 수 있음.
const express = require('express')
const app = express()

// method override 사용하는 셋팅 법
// _edit?_method=PUT 이렇게 ejs에서 사용하면 put을 사용할 수 있음.
const methodOverride = require('method-override');
app.use(methodOverride('_method'));

// 이걸 적어야 img, css, js jpg 와 같은 static 파일들, 변동 사항이 없는 파일들을 쓰고 싶으면 이걸 적어줘야함.
app.use(express.static(__dirname + '/public'))

// ejs 셋팅하는 법
app.set('view engine', 'ejs')

//user가 데이터를 보내면 그걸 꺼내쓰는게 좀 귀찮음. 
// 그래서 요청.body를 쉽게 꺼내서 쓸 수 있게 필수적으로 추가하는 코드 2줄임.
app.use(express.json())
app.use(express.urlencoded({extended:true}))


// passport 라이브러리 셋팅하기
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local');

app.use(passport.initialize());
app.use(session({
    secret : '암호화에 쓸 비번', // 세션의 document id를 암호화해서 유저에게 보낼때 그때 사용할 비번, 이거 털리면 개인정보 다 털림
    resave : false, // 유저가 서버로 요청을 할때마다 세션을 갱신할건지, 보통 false로 해둠
    saveUninitialized : false, // 로그인 안해도 세션을 만들 것인지, 보통 false로 해둠.
}));
app.use(passport.session());



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
    응답.sendFile(__dirname + '/index.html');
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
    res.render('detail.ejs', {title : result.title, content : result.content, id : id})
})

app.get('/detail/:id/modify', async(req, res)=>{
    const id = req.params.id;
    let result = await db.collection('post').findOne({_id : new ObjectId(id)})
    res.render('modify.ejs', {title : result.title, content : result.content, id : id})
})

app.post('/detail/:id/modify', async(req, res)=>{
    try{
        const id = req.params.id; 

        await db.collection('post').updateOne({_id : new ObjectId(id)}, {$set : {title : req.body.title, content : req.body.content}});
        res.redirect('/detail/'+id);
    }catch(e){
        console.log(e);
    }
    
})

// form 태그를 써서 Put, delete 요청하는 법
// npm install method-override
// $inc, $mul, $unset : 필드값 삭제해줌. 근데 이거는 거의 안씀.
// 여러개의 document를 수정하고 싶으면 updateMany
// like 항목이 10이상인 document를 수정하고 싶다면 {like : {$ge : 10}} 
// 이렇게 쓰면 10 이상의 like를 찾아라 라고 필터링 할 수 있음. $lte(10이하), $ne(10이 아닌것) 이렇게도 쓸 수 있음.

// 삭제 기능은 우리 한번 ajax를 써봅시다 핳하
// a, form 태그는 새로 고침이 된다는 단점이 있음. ajax를 쓰면 새로 고침 ㄴㄴ
// app.post('/abc', async(req, res)=>{
//     console.log('안녕');
//     console.log(req.body);
// })

// url parameter로 데이터 전송 가능
// query string은 /abc?데이터이름=데이터값 과 같이 데이터 전송 가능함.
// ex) fetch('/abc?age=20&name=홍길동')
// req.body, req.params, req.query 이렇게 3개가 있음.
app.delete('/list/delete', async(req,res)=>{
    try{
        const id = req.query.docid;
        await db.collection('post').deleteOne({_id : new ObjectId(id)});
        res.send('삭제 완료'); //ajax 요청 사용시 응답.redirect, 응답.render는 사용하지 않는게 좋음.
        // 왜냐하면 새로고침을 하지 않기 위해서임. ajax를 쓰는 이유는 새로고침을 하지 않기 위함이니까.
    }catch(e){
        console.log(e);
    }
})
//fetch에서 delete를 쓸때 body에 정보를 보내면 잘 안가는 경우가 있음.

// 거의 모든 상황의 에러 처리를 다룰 수 있는 template
// fetch('/URL')
// .then((r)=>{
//     if(r.status == 200){
//         return r.json()
//     }else{
//         // 서버가 에러코드 전송시 실행할 코드
//         alert('에러남')
//     }
// })
// .then((result)=>{
//     // 성공시 실행할 코드
// }).catch((error)=>{
//     // 인터넷 문제 등으로 실패시 실행할 코드
//     console.log(error)
// })


// axios 라이브러리
// axios.get('/URL').then((r) => {console.log(r)}).catch(()=> 에러시 실행할 코드)


// app.get('/list/1', async (요청, 응답)=>{
//     let result = await db.collection('post').find().limit(5).toArray();
//     let now = new Date();
//     응답.render('list.ejs', {글목록 : result, 시간 : now})
// })

// app.get('/list/2', async (요청, 응답)=>{
//     let result = await db.collection('post').find().skip(5).limit(5).toArray();
//     let now = new Date();
//     응답.render('list.ejs', {글목록 : result, 시간 : now})
// })

// app.get('/list/3', async (요청, 응답)=>{
//     let result = await db.collection('post').find().skip(10).limit(5).toArray();
//     let now = new Date();
//     응답.render('list.ejs', {글목록 : result, 시간 : now})
// })

// skip은 성능이 않좋으니까 1000번째 페이지와 같이 너무 많은 skip은 하지 않도록 하기.
// // 아니면 다른 페이지네이션 방법도 있음.
// app.get('/list/:id', async (요청, 응답)=>{
//     let result = await db.collection('post').find().skip((요청.params.id-1) * 5).limit(5).toArray();
//     let now = new Date();
//     응답.render('list.ejs', {글목록 : result, 시간 : now})
// })

// 이런 식으로 페이지 네이션 하면 빠르지만 다음 페이지를 통해서만 넘어갈 수 있음.
// app.get('/list/:id', async (요청, 응답)=>{
//     let result = await db.collection('post')
//     .find({_id : {$gt : 방금본마지막 게시물_id 보다 큰 도큐먼트를 5개만 컷트 해서 가져와 주세요}})
//     .skip((요청.params.id-1) * 5).limit(5).toArray();
//     let now = new Date();
//     응답.render('list.ejs', {글목록 : result, 시간 : now})
// })

// 1. 회원가입은 유저가 회원가입을 하면 아이디/비번 저장해서
// 2. 로그인 하면 서버는 디비와 비교해서 입장권을 유저에게 발급
// 3. 그러면 서버에 get/post 요청시 입장권을 같이 줘서 서버가 입장권을 확인하고 데이터를 줌.
// 이름 : kim, 로그인 날짜 : 20xx.xx.xx 이거는 브라우저의 쿠키 저장소에 저장을 함.
// 서버는 이 쿠키 저장소에 입장권을 만들어 넣어줌.
// 방식은 session과 token 두 가지가 있음.
// 1. session 방식은 입장권에 세션 id 밖에 없음. 아이디 + 로그인 날짜 + 유효기간 + 세션 아이디 이렇게 저장
// 그리고 세션 아이디만 유저에게 전달. 그러면 나중에 유저가 세션 아이디를 주면 유효기간이 지나지 않았을때 데이터 보내줌.
// 이렇게 하면 엄격하게 유저의 로그인 상태를 체크할 수 있음. 단, DB쨩이 힘들어함.
// 그래서 redis를 많이 씀.

// JSon Web Token 방식은 일단 유저가 로그인을 성공하면 유저에게 입장권을 발급해주는데 입장권에 아이디, 로그인 날짜, 유효기간 등을 적어서
// 암호화를 하고 유저에게 다시 보냄. 그러면 유저가 이 입장권을 서버에게 다시 주면 서버가 그걸 보고 별 이상이 없으면 통과 시키는 거임.
// 그래서 암호화하는 방식이기 때문에 jwt에서 사용하는 암호 방식을 들키면 안된다는 것.

// OAuth는 뭐냐면 유저가 a 사이트에 로그인하면 사용권한이 있을 텐데 내가 b 사이트에 회원정보를 a 사이트의 것을 대여하고 싶을때
// 사용하는 것을 말함. 즉, 소셜 로그인을 말하는 것.
// 코딩 애플에 구글 로그인을 하고 싶다면 구글로 로그인을 해서 그거를 코딩 애플 서버로 알림을 전송하고 코딩애플 사이트는 구글 서버에게
// 유저의 정보를 요청해서 받아들이고 그걸 이용해서 세션 혹은 토큰을 만들어 사용하는 것임.

// session 방식
// 1. 가입 기능
// 2. 로그인 기능
// 3. 로그인 완료시 세션 만들기 => passport.serializeUser()
// 4. 로그인 완료시 유저에게 입장권 보내줌
// 구현을 쉽게 해줄 수 있는 라이브러리가 passport임.
// npm install express-session passport passport-local
// 23번줄에 passport 기본 셋팅이 시작

app.get('/signup', async(req,res)=>{
    res.render('signup.ejs');
})

app.post('/signup', async(req, res)=>{
    try{
        await db.collection('user').insertOne({username : req.body.username, password : req.body.password});
        res.status(200).redirect('/');
    }catch(e){
        console.log(e);
    }
})

passport.use(new LocalStrategy(async(입력한아이디, 입력한비번, cb)=>{
    // 참고로 아이디/비번 외에 다른 것도 제출받아서 검증 가능함. passReqToCallback 옵션 찾아보기.
    try{
        let result = await db.collection('user').findOne({username : 입력한아이디});
        if(!result){
            return cb(null, false, {message : '아이디 DB에 없음'}); // 회원인증 실패시 false라는 거임
        }
        if(result.password == 입력한비번){
            return cb(null, result)
        }else{
            return cb(null, false, {message : '비번 불일치'});
        }
    }catch(e){
        console.log(e);
    }
}))

// 이제 앞으로 passport.authenticate('local')()을 쓰면 이 위의 코드가 실행이되서 아이디와 비밀번호를 비교해줌

app.post('/login', async(req, res, next)=>{
    // error : 비교 작업이 에러가 날때, user : 비교 작업이 성공시 로그인한 유저 정보, info : 비교 실패시 그 이유
    passport.authenticate('local', (error, user, info)=>{
        if(error) return res.status(500).json(error);
        if(!user) return res.status(401).json(info.message);
        req.logIn(user, (err)=>{
            if(err) return next(err);
            res.redirect('/');
        })
    })(req, res, next)
})