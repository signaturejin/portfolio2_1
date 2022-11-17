// 필요한 태그 생성
const header = document.querySelector("#header");
// const gnb = document.querySelectorAll(".gnb > li > a");
const sub_menu = document.querySelectorAll(".sub_menu");
const sub_menu_board = document.querySelector(".sub_menu_board");

//조건문 활용해서 브라우저 창 사이즈가 1024px 초과일때만 아래 기능 실행

let window_size = ()=>{
    if(window.matchMedia("screen and (min-width:1025px)").matches){
        header.addEventListener("mouseenter",()=>{
            sub_menu.forEach((item,index)=>{
                item.style.height = "280px";
            });
            sub_menu_board.style.height = "280px";
        });
        
        header.addEventListener("mouseleave",()=>{
            sub_menu.forEach((item,index)=>{
                item.style.height = "0";
            });
            sub_menu_board.style.height = "0";
        });
    }
}

window.addEventListener("load",()=>window_size());
window.addEventListener("resize",()=>window_size());