// 필요한 태그 생성
const gnb = document.querySelectorAll(".gnb > li > a");
const sub_menu = document.querySelectorAll(".sub_menu");
const sub_menu_board = document.querySelector(".sub_menu_board");

gnb.forEach((item,index)=>{
    item.addEventListener("mouseenter",()=>{
        sub_menu.forEach((item,index)=>{
            item.style.height = "280px";
        });
        sub_menu_board.style.height = "280px";
    });
    
    item.addEventListener("mouseleave",()=>{
        sub_menu.forEach((item,index)=>{
            item.style.height = "0";
        });
        sub_menu_board.style.height = "0";
    });
});