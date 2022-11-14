//필요한 태그 생성
const store_city = document.querySelector("#store_city");
const store_zone = document.querySelector("#store_zone");

//시/도 셀렉트 태그의 옵션들을 생성하기 위해서
//행정동의 시/도만큼 반복문을 이용
for(let i=0; i<hangjungdong.sido.length; i++){
    //빈껍데기인 옵션태그를 생성한다
    let city_option = document.createElement("option");
    
    //변수에 시/도의 이름을 대입한다.
    //createTextNode <-- 텍스트를 생성해줌
    let city_option_text = document.createTextNode(hangjungdong.sido[i].codeNm);

    //위에서 대입한 텍스트를 홈페이지 이용자들이 볼 수 있도록 셀렉트 사이에 넣어줌
    //<option>서울</option>
    city_option.append(city_option_text);
    
    //db에 데이터를 보내기 위해 옵션태그에 value값을 넣어준다.
    city_option.setAttribute("value",hangjungdong.sido[i].codeNm);

    //구/군과 매칭하기 위해 사용자정의속성을 이용하여 시/도 번호를 넣어준다.
    city_option.setAttribute("data-sido",hangjungdong.sido[i].sido);

    //지금까지 만들었던 option태그들을 셀렉트 태그안에 넣어준다
    store_city.append(city_option);

};

// 시/도 셀렉트를 선택하면(change기능) 그와 대응되는 구/군의 지역들이 나오도록 하는 기능
store_city.addEventListener("change",()=>{
    // store_city에서 고른 옵션태그의 속성 data-sido의 값을 가지고옴
    let city_data = store_city.options[store_city.selectedIndex].getAttribute("data-sido");

    //구/군 옵션태그 생성 기능 함수호출
    sigugun_option(city_data);
});


//구/군 옵션태그 생성 기능 함수
//구/군의 옵션을 만드는것이므로 구/군의 길이만큼 반복문 이용
let sigugun_option = (city_data)=>{
    //옵션기능 초기화(이전 선택한 시/도의 구/군 옵션들이 내려오기 때문)
    store_zone.innerHTML = `<option value>구/군 선택</option>`;

    for(let i=0; i<hangjungdong.sigugun.length; i++){
        //조건문을 이용하여 시/도의 sido와 구/군의 sido가 같은 것들을 찾아줌
        if(city_data === hangjungdong.sigugun[i].sido){
            // 빈껍데기인 옵션태그를 생성
            let zone_option = document.createElement("option");
            // 사이트 사용자가 볼 수 있도록 텍스트를 생성한 후 옵션태그 사이에 넣어줌
            let zone_option_text = document.createTextNode(hangjungdong.sigugun[i].codeNm);
            zone_option.append(zone_option_text);
            // db에 보내주기 위해 옵션태그에 속성들을 부여해줌
            zone_option.setAttribute("value",hangjungdong.sigugun[i].codeNm);
            // 완성된 옵션태그를 셀렉트 사이에 넣어줌
            store_zone.append(zone_option);
        }
    }    
} 