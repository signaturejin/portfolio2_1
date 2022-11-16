// 필요한 태그 생성
const mouse_wheel = document.querySelector(".mouse_wheel");

//처음에 마우스 휠을 길게 만들기 위해 setTimeout함수를 이용하여 클래스를 붙여줌
setTimeout(()=>{
    mouse_wheel.classList.add("top");
},500);

//휠이 아래로 내려간 것 처럼 보이기 위해 클래스 top을 없애고 bot을 붙여줌
setInterval(()=>{
    // contains => 해당 클래스값이 붙어있는지 아닌지 boolean으로 알 수 있음
    // 해당 태그에 클래스 top이 붙어있을시
    if(mouse_wheel.classList.contains("top")){
        mouse_wheel.classList.remove("top");
        mouse_wheel.classList.add("bot");
    }
    // 해당 태그에 클래스 bot이 붙어있을시
    else if(mouse_wheel.classList.contains("bot")){
        mouse_wheel.classList.remove("bot");
        mouse_wheel.classList.add("top");
    }
},1000);