// inner 영역의 텍스트 웨이브
//필요한 태그 생성
const inner_top = document.querySelector(".inner_top");
const text = document.querySelectorAll(".inner_top > span");

// 스크롤을 할 때마다
window.addEventListener("scroll",()=>{
    //스크롤바의 시작위치값을 변수에 대입
    let scTop = window.scrollY;
    //inner_top 영역의 시작위치값을 변수에 대입
    let inner_start = inner_top.offsetTop;
    //스크롤바의 시작위치값이 inner_top 영역에 근접할 때
    //클래스 이름을 붙여줌
    if(scTop >= inner_start - 450){
        text.forEach((item,index)=>{
            item.classList.add("ani_start");
        });
    }
});