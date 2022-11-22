//필요한 태그 생성
const carousel_box = document.querySelector(".carousel_box");
const prev_btn = document.querySelector(".carousel_btn_set .prev_btn");
const next_btn = document.querySelector(".carousel_btn_set .next_btn");

//화면사이즈에 따라 바뀌는 margin값
//처음 바뀌는 margin값
let first_margin;
//요소 하나가 뒤로 오면서 밀리기 때문에 다시 margin값 설정
let set_margin;

//브라우저 화면 창에 따른 margin값 변경 조건문
let browser_size = ()=>{
    if(window.matchMedia("screen and (min-width:1201px)").matches){
        //prev_btn 클릭할 때 처음 적용되는 margin 값
        first_margin = "-50%";
        //요소 하나가 뒤로 가 밀리기 때문에 원래 요소가 나오게 하기위한 margin 값
        set_margin = "-25%";
    }
    else if(window.matchMedia("screen and (max-width:1200px) and (min-width:1025px)").matches){
        first_margin = "-66.666%";
        set_margin = "-33.333%";
    }
    else if(window.matchMedia("screen and (max-width:1024px) and (min-width:541px)").matches){
        first_margin = "-100%";
        set_margin = "-50%";
    }
    else if(window.matchMedia("screen and (max-width:540px)").matches){
        first_margin = "-200%";
        set_margin = "-100%";
    }
    //위 브라우저 사이즈 체크를 끝낸 후 원위치 margin값 설정
    carousel_box.style.marginLeft = set_margin;
}

//함수 호출해야 실행가능
window.addEventListener("load",()=>{
    browser_size();
});
window.addEventListener("resize",()=>{
    browser_size();
});

//prev_btn 클릭 시 마진값 0으로 고정시키고 원위치 마진값으로 재이동
prev_btn.addEventListener("click",()=>{
    //여기서 transition을 붙이는 이유는 원위치 시킬 땐 눈에 안띄게 하기 위함
    carousel_box.style.transition = "all 0.5s";
    //마진값 0으로 고정
    carousel_box.style.marginLeft = "0";
    //마지막번째 요소를 첫번째로 옮기기 위해 변수에 대입
    let last_img = carousel_box.lastElementChild;

    //순서가 위 기능과 꼬이지 않기 위해 7초 뒤에 아래 기능 실행
    setTimeout(()=>{
        //마지막번째 요소를 첫번째로 보내줌
        carousel_box.prepend(last_img);
        //원위치를 시켜야하기 때문에 눈에 띄지않도록 위에서 붙인 transition 없애줌
        carousel_box.style.transition = "none";
        //원위치 시키는 마진값 설정
        carousel_box.style.marginLeft = set_margin;
    },700);
});

//next_btn 클릭 시 첫 마진값으로 이동 후 원위치 마진값으로 재이동
next_btn.addEventListener("click",()=>{
    //여기서 transition을 붙이는 이유는 원위치 시킬 땐 눈에 안띄게 하기 위함
    carousel_box.style.transition = "all 0.5s";
    //첫번째 마진값 설정
    carousel_box.style.marginLeft = first_margin;
    //영역에서 밀린 첫번째 요소를 맨 뒤로 옮기기 위한 변수 대입
    let first_img = carousel_box.firstElementChild;

    //순서가 위 기능과 꼬이지 않기 위해 7초 뒤에 아래 기능 실행
    setTimeout(()=>{
        //위에서 선택한 첫번째 요소를 이미지를 감싸고있는 영역의
        //맨 마지막에 넣어줌
        carousel_box.append(first_img);
        //원위치를 시켜야하기 때문에 눈에 띄지않도록 위에서 붙인 transition 없애줌
        carousel_box.style.transition = "none";
        //원위치 시키는 마진값 설정
        carousel_box.style.marginLeft = set_margin;
    },700);
});