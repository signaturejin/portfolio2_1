//필요한 태그 및 변수 생성
const slide_box = document.querySelectorAll(".view .slide_box");
const slide_btn = document.querySelectorAll(".slide_btn_set .slide_btn");
let slide_num = 0;

//반복문을 이용해서 클릭기능 부여
slide_btn.forEach((item,index)=>{
    item.addEventListener("click",(e)=>{
        //페이지 이동 방지
        e.preventDefault();
        //활성화 전 전부 비활성화
        slide_box.forEach((item,index)=>{
            item.style.opacity = "0";
            item.style.zIndex = "2";
            slide_btn[index].classList.remove("on");
        });
        // 활성화
        slide_box[index].style.opacity = "1";
        slide_box[index].style.zIndex = "3";
        item.classList.add("on");
    });
});

//자동 슬라이드 기능
let auto_slide = setInterval(()=>{

    if(slide_num == slide_box.length - 1){
        slide_num = 0;
    }
    else{
        slide_num++;
    }
    //활성화 전 전부 비활성화
    slide_box.forEach((item,index)=>{
        item.style.opacity = "0";
        item.style.zIndex = "2";
        slide_btn[index].classList.remove("on");
    });
    // 활성화
    slide_box[slide_num].style.opacity = "1";
    slide_box[slide_num].style.zIndex = "3";
    slide_btn[slide_num].classList.add("on");

},5000);