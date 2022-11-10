// 필요한 태그 생성
// const gnb = document.querySelectorAll(".gnb > li > a");
const header = document.querySelector("#header");
const sub_menu = document.querySelectorAll(".sub_menu");
const sub_menu_board = document.querySelector(".sub_menu_board");

// gnb에 마우스를 올렸을 때 서브메뉴와 뒷배경이 나타남
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