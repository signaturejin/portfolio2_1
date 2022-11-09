//// 필요한 태그 생성
// 화면 전환을 위한 메뉴버튼
const menu_btn = document.querySelectorAll(".menus > li > a");
// 화면 전환 될 것들
const center_img = document.querySelectorAll(".center_img");
const left_img = document.querySelectorAll(".left_img");
const right_box = document.querySelectorAll(".right_box");

// 반복문을 이용하여 모든 메뉴버튼에 클릭기능 부여
menu_btn.forEach((item,index)=>{
    item.addEventListener("click",(e)=>{
        // 페이지 이동 방지
        e.preventDefault();

        //모든 것에 클래스 on 뺌
        menu_btn.forEach((item,index)=>{
            // 메뉴버튼
            item.classList.remove("on");
            // 가운데 이미지
            center_img[index].classList.remove("on");
            // 왼쪽 이미지
            left_img[index].classList.remove("on");
            // 오른쪽 이미지
            right_box[index].classList.remove("on");
        });


        //클릭한 것과 대응되는 것들은 클래스 on을 붙임
        // 메뉴버튼
        item.classList.add("on");
        // 가운데 이미지
        center_img[index].classList.add("on");
        // 왼쪽 이미지
        left_img[index].classList.add("on");
        // 오른쪽 이미지
        right_box[index].classList.add("on");
    });
});