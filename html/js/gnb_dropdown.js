// 필요한 태그 생성
const gnb_wrap = document.querySelector(".gnb_wrap");
const sub_menu = document.querySelectorAll(".sub_menu");
const sub_menu_board = document.querySelector(".sub_menu_board");

gnb_wrap.addEventListener("mouseenter",()=>{
    sub_menu.forEach((item,index)=>{
        item.style.height = "280px";
    });
    sub_menu_board.style.height = "280px";
});

gnb_wrap.addEventListener("mouseleave",()=>{
    sub_menu.forEach((item,index)=>{
        item.style.height = "0";
    });
    sub_menu_board.style.height = "0";
});