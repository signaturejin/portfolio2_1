// 필요한 태그 생성
const mobile_btn = document.querySelector(".mobile_menu");
const mobile_board = document.querySelector(".mobile_board");
const close_btn = document.querySelector(".close_btn .wrap");

mobile_btn.addEventListener("click",()=>{
    mobile_btn.classList.add("close");
    mobile_board.style.right = 0;
});

close_btn.addEventListener("click",()=>{
    mobile_btn.classList.remove("close");
    mobile_board.style.right = "-100%";
});