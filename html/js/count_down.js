//필요한 태그 생성
const count_view = document.querySelectorAll(".count_view .count_num");

//일 / 시 /분 / 초를 표현하는 계산식
const seconds = 1000;
const minutes = seconds * 60;
const hours = minutes * 60;
const days = hours * 24;

//카운트다운을 위해 자동실행함수 사용
let count_down = setInterval(()=>{
    //시간 관련 객체 생성
    let date = new Date();

    //목표시간을 변수에 대입
    let target_day_date = new Date("2023-08-30 18:30:00");

    //현재시간을 변수에 대입 (밀리세컨드로 보여줌)
    let today = date.getTime();
    //목표시간을 밀리세컨드로 보여줌
    let target_day = target_day_date.getTime();

    //목표시간에서 현재시간을 빼서 남은 시간을 구함
    let remain_day = target_day - today;

    //남은 일 계산(소수점은 버리기)
    let result_days = Math.floor((remain_day / days));
    let result_hours = Math.floor((remain_day % days) / hours );
    let result_minutes = Math.floor((remain_day % hours) / minutes );
    let result_seconds = Math.floor((remain_day % minutes) / seconds );

    //위에서 구한 값들을 배열에 담아줌
    let date_list = [result_days,result_hours,result_minutes,result_seconds];
    
    //숫자가 한자리일때 두자리표현을 위한 반복문 사용
    date_list.forEach((item,index)=>{
        //숫자가 한자리일때 앞에 0을 붙여줌
        if(item < 10){
            count_view[index].innerHTML = "0" + item;
        }
        //숫자가 두자리일때
        else{
            count_view[index].innerHTML = item;
        }
    });

    //목표날짜에 도달하였을 때 자동실행멈추고 전부 0으로 바꿈
    count_view.forEach((item,index)=>{
        if(remain_day < 0){
            clearInterval(count_down);
            count_view[index].innerHTML = "00";
        }
    });
},1000);