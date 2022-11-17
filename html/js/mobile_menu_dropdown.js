// 필요한 태그 생성
const mobile_gnb = document.querySelectorAll(".mobile_gnb > li > a");
const mobile_sub_menu = document.querySelectorAll(".mobile_sub_menu");

mobile_gnb.forEach((item,index)=>{
    item.addEventListener("click",()=>{
        // 활성화 전 전부 비활성화
        mobile_sub_menu.forEach((item,index)=>{
            item.style.height = 0;
        });
        mobile_sub_menu[index].style.height = "150px";
    });
});