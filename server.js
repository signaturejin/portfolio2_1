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
const { render } = require("ejs");

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
// app.get("/menu/top",(req,res)=>{
//     db.collection("prdlist").find({prd_category:"상의"}).toArray((err,f_result)=>{
//         res.render("shop_menu", {prdData: f_result});
//     });
// });

// test
//async / await -> 동기화작업
app.get("/menu/top",async(req,res)=>{

    //페이징번호가 null값이면 1로, 값이 있다면 해당 값을 변수에 대입(페이징번호)
    //req.query의 값은 string유형이기 때문에 number값으로 변경
    let page_number = (req.query.page == null) ? 1 : Number(req.query.page)
    //한 페이지당 보여줄 데이터갯수
    let per_page = 3;
    //블록당 보여줄 페이징 번호갯수
    let block_count = 2;
    //현재 페이지 블록구하기(결과값이 소수점이므로 올림해줌)
    //ex) 현재 페이지번호: 2 / block_count = 2 -> 현재 페이지블록: 1
    let block_number = Math.ceil(page_number / block_count);
    //세트당 블록의 시작번호 값 구하기
    //ex)현재 블록이 1일 경우: ((1-1)*2)+1 = 1
    //첫번째 블록의 시작번호는 1
    let block_start = ((block_number -1) * block_count) + 1;
    //세트당 블록의 끝번호 값 구하기
    //ex)블록의 첫번째 숫자가 1일 경우: 1 + 2 - 1 = 2
    //첫번째 블록의 페이징 끝 번호는 2
    let block_end = block_start + block_count - 1;

    //db의 prdlist콜렉션에서 상의로 분류된 데이터가 총 몇개인지 가져오는 명령어
    //find까지 써줄때는 countDocuments 대신 count
    //동기화 안해주면 값 이상하게 나옴
    let total_data = await db.collection("prdlist").find({prd_category:"상의"}).count({});
    //위에서 구한 전체데이터값을 통해 총 몇개의 페이징 번호가 만들어져야하는지 구하기
    //ex)총 데이터 수: 6 / 한페이지당 보여줄 데이터 수: 4개 -> 2개
    //데이터ㅁ6개 -> (페이지1)ㅁㅁㅁㅁ / (페이지2)ㅁㅁ
    let paging = Math.ceil(total_data / per_page);
    //블록에서 마지막번호가 페이징의 끝번호보다 크다면 페이징의 끝번호를 강제부여
    //ex)위에서 구한 (페이지1)ㅁㅁㅁㅁ / (페이지2)ㅁㅁ -> (페이지1)ㅁㅁㅁㅁ / (페이지2)ㅁㅁㅁㅁ가 되는건 x
    if(block_end > paging){
        block_end = paging;
    }

    //블록의 총 갯수 구하기(결과값이 소수점이므로 올림해줌)
    //ex)페이징수:2 / 블록당 보여줄 페이징수:2 
    let total_block = Math.ceil(paging / block_count);
    //db에서 꺼내오는 데이터의 시작 순번값 결정
    //ex)현재 페이지가 2일 경우: (2-1)*4 = 4
    let start_from = (page_number - 1) * per_page;

    //db의 prdlist콜렉션에서 category가 상의인 것만 모두 찾아서 정렬한다.
    db.collection("prdlist").find({prd_category:"상의"}).sort({number:1}).skip(start_from).limit(per_page).toArray((err,f_result)=>{
        res.render("shop_menu", {
            //prdlist에서 상의로 분류된 데이터들
            prdData: f_result,
            //페이징 번호의 총 갯수값
            paging: paging,
            //현재 페이지를 알려주는 값
            page_number: page_number,
            //블록에서의 페이지 시작번호값
            block_start: block_start,
            //블록에서의 페이지 끝번호값
            block_end: block_end,
            //블록의 번호 순서값
            block_number: block_number,
            //블록의 총 갯수
            total_block: total_block
        });
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
        res.render("admin_prdlist",{prdData: f_result}, {adminData :req.user});
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
            // form태그에 enctype="multipart/form-data"가 있어야 정상적으로 파일이 첨부됨
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

// 관리자 매장관리페이지 경로 요청
app.get("/admin/storelist",(req,res)=>{
    db.collection("storelist").find().toArray((err,f_result)=>{
        res.render("admin_store", {storeData: f_result}, {adminData :req.user});
    });
});

// db에 매장관련데이터 보내기
app.post("/add/storelist",(req,res)=>{
    db.collection("count").findOne({name:"매장등록"},(err,f_result)=>{
        db.collection("storelist").insertOne({
            // 매장번호
            store_no: f_result.storeCount + 1,
            // 매장명
            store_name: req.body.store_name,
            // 매장 시/도
            store_city: req.body.store_city,
            // 매장 구/군
            store_zone: req.body.store_zone,
            // 매장 우편번호
            store_post_num: req.body.store_post_num,
            // 매장 주소
            store_addr: req.body.store_addr,
            // 매장 번호
            store_tell: req.body.store_tell
        },(err,i_result)=>{
            db.collection("count").updateOne({name:"매장등록"},{$inc:{storeCount:1}},(err,u_result)=>{
                res.redirect("/admin/storelist");
            });
        });
    });
});

// 쇼핑몰 매장 지점 경로 요청
app.get("/store/map",(req,res)=>{
    db.collection("storelist").find().toArray((err,f_result)=>{
        res.render("shop_store_map",{storeData: f_result});
    });
});

// 매장주소 검색기능
app.get("/store/addr_search",(req,res)=>{
    // 시/도만 검색했을 시
    if(req.query.store_city !== "" && req.query.store_zone === ""){
        db.collection("storelist").find({store_city: req.query.store_city}).toArray((err,f_result)=>{
            res.render("shop_store_map", {storeData: f_result});
        });
    }
    // 시/도 & 구/군 둘 다 검색했을 시
    else if(req.query.store_city !== "" && req.query.store_zone !== ""){
        db.collection("storelist").find({store_city: req.query.store_city, store_zone:req.query.store_zone}).toArray((err,f_result)=>{
            res.render("shop_store_map", {storeData: f_result});
        });
    }
    // 둘 다 선택하지 않았을 시
    else {
        res.redirect("/store/map");
    }
});

// 매장명 검색기능
app.get("/store/name_search",(req,res)=>{
    let store_search = [
        {
            $search: {
                index: 'store_search',
                text: {
                    // 내가 입력한 이 값으로
                    query: req.query.store_name,
                    // db에 있는 store_name의 값에서 같은 단어가 포함되어있는 것 찾아옴
                    path: "store_name"
                }
            }
        }
    ]

    db.collection("storelist").aggregate(store_search).toArray((err,a_result)=>{
        res.render("shop_store_map", {storeData: a_result});
    });

});