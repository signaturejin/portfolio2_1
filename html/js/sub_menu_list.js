// 필요한 태그 생성
const menu_list = document.querySelectorAll(".menu_list li");
console.log ("menu_list");

menu_list.forEach((item,index)=>{
    item.addEventListener("click",(e)=>{
        menu_list.forEach((item,index)=>{
            item.classList.remove("on");
        });
        menu_list[index].classList.add("on");
    });
})