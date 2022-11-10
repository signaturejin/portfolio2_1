//시작 전 세팅
const express = require("express");
//데이터베이스의 데이터 입력, 출력을 위한 함수명령어 불러들이는 작업
const MongoClient = require("mongodb").MongoClient;
const moment = require("moment");
//원하는 나라의 시간대로 변경하는 라이브러리 사용
const momentTimezone = require("moment-timezone");

//로그인 검증을 위한 passport 라이브러리 불러들임
const passport = require('passport');
//Strategy(전략) -> 로그인 검증을 하기위한 방법을 쓰기위해 함수를 불러들이는 작업
const LocalStrategy = require('passport-local').Strategy;
//사용자의 로그인 데이터 관리를 위한 세션 생성에 관련된 함수 명령어 사용
const session = require('express-session');

//파일업로드 라이브러리 multer
const multer  = require('multer');

// express함수를 app에 대입
const app = express();
const port = process.env.PORT || 8080;
// const port = 8080;

app.set("view engine","ejs");
app.use(express.urlencoded({extended: true}));
app.use(express.static('html'));

//로그인 기능에 필요한 것
app.use(session({secret : 'secret', resave : true, saveUninitialized: false}));
app.use(passport.initialize());
app.use(passport.session());


MongoClient.connect("mongodb+srv://admin:qwer1234@testdb.qmmqvc3.mongodb.net/?retryWrites=true&w=majority",function(err,result){
    //에러가 발생했을경우 메세지 출력(선택사항)
    if(err) { return console.log(err); }

    //위에서 만든 db변수에 최종연결 ()안에는 mongodb atlas 사이트에서 생성한 데이터베이스 이름
    db = result.db("portfolio2_db");

    //db연결이 제대로 됬다면 서버실행
    app.listen(port,function(){
        console.log("서버연결 성공");
    });
});

//파일첨부 어디에 저장할 것인지에 대한 기능
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        //저장 경로
      cb(null, 'html/upload')
    },
    filename: function (req, file, cb) {
        //한글 안깨지기 위한 명령어
      cb(null, file.originalname = Buffer.from(file.originalname, 'latin1').toString('utf8') )
    }
});
  
const upload = multer({ storage: storage });

//로그인 기능
//실제 로그인 검증하는 경로로 요청 -> function 전에 검증을 위한 passport 실행
//failureRedirect -> 잘못입력했을경우 이동될 경로
//function(req,res){} <-- 여기다가 적는거는 아이디 비번 제대로 입력시 어떤페이지로 이동될 것인지 경로
app.post("/loginCheck",passport.authenticate('local', {failureRedirect : '/fail'}),
function(req,res){
    res.redirect("/"); //로그인 성공시 메인페이지로 이동
});

passport.use(new LocalStrategy({
    usernameField: 'admin_id', //admin_login.ejs에서 입력한 아이디의 name값
    passwordField: 'admin_pass', //admin_login.ejs에서 입력한 비밀번호의 name값
    session: true, //세션을 사용하겠습니까?
    passReqToCallback: false, //아이디와 비번말고도 다른항목들을 더 검사할 것인지 여부
  }, function (admin_id, admin_pass, done) { //id password 작명한거임(입력한 input값 담는 변수)
    // 로그인 제대로 되는지 확인
    console.log(admin_id, admin_pass);
    db.collection('admin').findOne({ adminId: admin_id }, function (err, result) {
      if (err) return done(err)
      //잘못 입력했을 때

      if (!result) return done(null, false, { message: '존재하지않는 아이디입니다.' })
      if (admin_pass == result.adminPass) {
        return done(null, result)
      } else {
        return done(null, false, { message: '비밀번호가 맞지 않습니다.' })
      }
    })
}));

//데이터베이스에 있는 아이디와 비번이 일치하면
//세션을 생성하고 해당 아이디와 비번을 기록하여 저장하는 작업
passport.serializeUser(function (user, done) {
    done(null, user.adminId) //데이터베이스에 있는 아이디가 저장되어있는 프로퍼티 명 기술(user.뒤에)
});
 
//만들어진 세션을 전달해서 다른페이지에서도 해당 세션을 사용할 수 있도록 처리(페이지 접근제한)
passport.deserializeUser(function (admin_id, done) {
    //데이터베이스에 있는 로그인했을때 아이디만 불러와서
    //다른페이지에서도 세션을 사용할 수 있도록 처리
    db.collection("admin").findOne({adminId: admin_id},function(err,result){
        done(null,result); //데이터베이스에서 가지고 온 아이디 -> 세션에 넣어서 다른페이지들에 전달
    });
});

// 메인페이지 경로 요청
app.get("/",(req,res)=>{
    res.render("index");
});

// 메뉴페이지 경로요청
// 상의
app.get("/menu/top",(req,res)=>{
    db.collection("prdlist").find({prd_category:"상의"}).toArray((err,f_result)=>{
        res.render("shop_menu", {prdData: f_result});
    });
});
// 아우터
app.get("/menu/outer",(req,res)=>{
    db.collection("prdlist").find({prd_category:"아우터"}).toArray((err,f_result)=>{
        res.render("shop_menu", {prdData: f_result});
    });
});
// 하의
app.get("/menu/bottom",(req,res)=>{
    db.collection("prdlist").find({prd_category:"하의"}).toArray((err,f_result)=>{
        res.render("shop_menu", {prdData: f_result});
    });
});
// 신발
app.get("/menu/shoes",(req,res)=>{
    db.collection("prdlist").find({prd_category:"신발"}).toArray((err,f_result)=>{
        res.render("shop_menu", {prdData: f_result});
    });
});
// 모자
app.get("/menu/cap",(req,res)=>{
    db.collection("prdlist").find({prd_category:"모자"}).toArray((err,f_result)=>{
        res.render("shop_menu", {prdData: f_result});
    });
});

// 관리자로그인 페이지 경로 요청
app.get("/admin/login",(req,res)=>{
    res.render("admin_login");
});

// 괸리자 로그인 유무확인
app.post("/add/login",passport.authenticate('local', {failureRedirect : '/fail'}),(req,res)=>{
    // 로그인 성공시 아래 주소로 이동
    res.redirect("/admin/prdlist");
});

// 관리자 상품관리페이지 경로 요청
app.get("/admin/prdlist",(req,res)=>{
    db.collection("prdlist").find().toArray((err,f_result)=>{
        res.render("admin_prdlist",{prdData: f_result});
    });
});

// 관리자 상품관리페이지의 상품들 데이터베이스에 보내기
app.post("/add/prdlist",upload.single('prd_img'),(req,res)=>{
    // 파일을 첨부하였을 때
    if(req.file){
        prd_file = req.file.originalname;
    }
    // 파일이 없을 때
    else{
        prd_file = null;
    }

    db.collection("count").findOne({name:"상품등록"},(err,f_result)=>{
        db.collection("prdlist").insertOne({
            // 번호
            prd_no: f_result.prdCount + 1,
            // 이름
            prd_name: req.body.prd_name,
            // 회사
            prd_comp: req.body.prd_comp,
            // 이미지
            // form태그에  enctype="multipart/form-data"가 있어야 정상적으로 파일이 첨부됨
            prd_file: prd_file,
            // 원가
            prd_price: req.body.prd_price,
            // 할인가
            prd_sale_price: req.body.prd_sale_price,
            // 할인률
            prd_percent: req.body.prd_percent,
            // 분류명
            prd_category: req.body.prd_category
        },(err,i_result)=>{
            db.collection("count").updateOne({name:"상품등록"},{$inc:{prdCount:1}},(err,u_result)=>{
                res.redirect("/admin/prdlist");
            });
        });
    });
});