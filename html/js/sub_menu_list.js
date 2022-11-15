//해당 접속 페이지 사이트 경로값 가져오는 작업
//호스트 빼고 가져와줌 / 호스트까지 나오려면 pathname 대신 href
let curruntPath = window.location.pathname;

//위 경로와 비교하기 위한 태그 생성
const menuList = document.querySelectorAll(".menu_list li");

//반복문 사용
menuList.forEach((item,index)=>{
    //li의 a태그의 속성값을 가져옴
    let menuListChild = item.querySelector("a").getAttribute("href");
    //서로의 경로가 맞을 때 클래스 on을 붙여줌
    if(curruntPath === menuListChild){
        item.classList.add("on");
    }
});