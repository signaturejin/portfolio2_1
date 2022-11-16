// 필요한 태그 생성
const go_top = document.querySelector("#go_top");

go_top.addEventListener("click",()=>{
    window.scrollTo(
        {
            top: 0,
            behavior: "smooth"
        }
    )
});