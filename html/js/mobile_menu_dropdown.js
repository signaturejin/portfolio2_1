// 필요한 태그 생성
const mobile_gnb = document.querySelectorAll(".mobile_gnb > li > a");
const mobile_sub_menu = document.querySelectorAll(".mobile_sub_menu");
// 처음부터 0px이라 높이를 구해도 0px
// let sub_height = [];

// 서브메뉴들의 높이값 구해서 배열에 대입
// mobile_sub_menu.forEach((item,index)=>{
//     sub_height[index] = item.offsetHeight;
// });

mobile_gnb.forEach((item,index)=>{
    item.addEventListener("click",()=>{
        // 활성화 전 전부 비활성화
        mobile_sub_menu.forEach((item,index)=>{
            item.style.height = 0;
        });
        // mobile_sub_menu[index].style.height = sub_height[index] + "px";
        mobile_sub_menu[index].style.height = "150px";
    });
});