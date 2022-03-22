//query selector
function $(selector) {
    return document.querySelector(selector);
}
const btn_input = $("#btn_input");
const input_field = $("#input_field");



const api = "9f736461afbe5e2a6c1c07d8e4a7c3f9";

let weatherInfo = {};
let a = {};
if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
        ({ coords }) => {
            const lati = (coords.latitude)
            const longitude = (coords.longitude);
            featchData(lati, longitude);
        },
        (err) => {
            fetch(`https://api.openweathermap.org/data/2.5/weather?q=khulna&appid=${api}`)
                .then(res => res.json())
                .then(data => {
                    weatherInfo = data;
                    const icon = ` http://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`
                    const city = data.name;
                    const condition = data.weather[0].description;
                    const temp = (data.main.temp) - 273.15;
                    const presure = data.main.pressure;
                    const humidity = data.main.humidity;
                    weatherInfo = {
                        icon,
                        city,
                        condition,
                        temp,
                        presure,
                        humidity
                    }
                    weatherInfo.country = "bangladesh";
                    weatherInfo.countryFname = city + " , " + "bangladesh";
                    weatherInfo.flag = "https://flagcdn.com/w320/bd.png ";
                })
                .catch(err => {
                    console.log(err)
                })
                .finally(() => {
                    displayLeftUI()
                    conditionBg()

                })
        })
}

function featchData(lati, longitude) {
    fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lati}&lon=${longitude}&appid=${api}`)
        .then(res => res.json())
        .then(data => {
            // console.log(data)
            const icon = ` http://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`
            const city = data.name;
            const condition = data.weather[0].description;
            const temp = (data.main.temp) - 273.15;
            const presure = data.main.pressure;
            const humidity = data.main.humidity;

            if (data.sys.country) {
                weatherInfo = {
                    icon,
                    city,
                    condition,
                    temp,
                    presure,
                    humidity
                }
                const countryFlag = (name1) => {
                    return fetch(`https://restcountries.com/v2/name/${name1}`)
                        .then(res => res.json())
                        .then(data => a = data)
                        .catch(err => {
                            console.log(err)
                        })
                        .finally(() => {
                            weatherInfo.countryFname = city + ' , ' + a[0].name;
                            weatherInfo.country = a[0].name;
                            weatherInfo.flag = a[0].flags.png;
                            displayLeftUI()
                            conditionBg()
                        })
                }
                countryFlag(data.sys.country);
            }
        })

        .catch(err => {
            console.log(err)
        })

        .finally(() => {
            // displayLeftUI()
            // console.log(weatherInfo);
        })
}



//display left UI
function displayLeftUI() {
    console.log(weatherInfo);
    $("#weather_img").src = weatherInfo?.icon;
    $("#country_img").src = weatherInfo?.flag;
    $("#cuntry_info").innerHTML = weatherInfo?.countryFname;
    $('#condition').innerHTML = weatherInfo?.condition;
    $('#temp').innerHTML = weatherInfo?.temp.toFixed(2);
    $('#presure').innerHTML = weatherInfo?.presure;
    $('#humidity').innerHTML = weatherInfo?.humidity;
    $('#country').innerHTML = weatherInfo?.country;
}
//search field
btn_input.addEventListener("click", function () {
    console.log('click');
    const fieldValue = input_field.value;
    input_field.value = "";
    if (!fieldValue) { alert("please input city name"); return };
    searchFeatchData(fieldValue);
})

//serch feach function
function searchFeatchData(city) {
    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${api}`)
        .then(res => res.json())
        .then(data => {
            // console.log(data)
            const icon = ` http://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`
            const city = data.name;
            const condition = data.weather[0].description;
            const temp = (data.main.temp) - 273.15;
            const presure = data.main.pressure;
            const humidity = data.main.humidity;

            if (data.sys.country) {
                weatherInfo = {
                    icon,
                    city,
                    condition,
                    temp,
                    presure,
                    humidity
                }
                const countryFlag = (name1) => {
                    return fetch(`https://restcountries.com/v2/name/${name1}`)
                        .then(res => res.json())
                        .then(data => a = data)
                        .catch(err => {
                            console.log(err)
                        })
                        .finally(() => {
                            weatherInfo.countryFname = city + ' , ' + a[0].name;
                            weatherInfo.country = a[0].name;
                            weatherInfo.flag = a[0].flags.png;
                            displayLeftUI()
                            conditionBg()
                            //local storage set
                            const history = getDataLocalStorage();
                            if (history.length === 4) {
                                history.pop(weatherInfo);
                                history.unshift(weatherInfo);
                            } else {
                                history.unshift(weatherInfo);
                            }

                            localStorage.setItem('weather', JSON.stringify(history));
                        })
                }
                countryFlag(data.sys.country);
            }
        })

        .catch(err => {
            alert('please type correct city name')
        })

        .finally(() => {
            // displayLeftUI()
            // console.log(weatherInfo);
        })
}


//localstorage
function getDataLocalStorage() {
    const data = localStorage.getItem('weather');
    let weather = [];
    if (data) {
        weather = JSON.parse(data);
    }
    return weather;
}

//history data
window.onload = function () {
    const history = getDataLocalStorage();
    history.forEach(e => {
        const div = document.createElement("div");
        div.innerHTML = `<div class="history_box">
    <div class="his_img">
        <img src="${e.icon}" width="60" alt="">
    </div>
    <div class="his_detail mar-15">
        <h4>${e.city} ${e.country}</h4>
        <p>${e.condition}</p>
        temp: <span>${e.temp.toFixed(2)}</span>°C, Presure: <span>${e.presure}</span> Humidity: <span>${e.humidity}</span>
    </div>
    <div class="flag_history">
        <img src="${e.flag}" width="60" alt="">
    </div>
</div>`;
        $("#history_box").appendChild(div);
    });
}


//condition bg
function conditionBg() {
    const conditions = weatherInfo.condition;
    console.log(conditions);
    if (conditions === 'clear sky') {
        document.body.style.backgroundImage = "url('https://cdn.pixabay.com/photo/2018/08/06/22/55/sun-3588618_960_720.jpg')";
    }
    else if (conditions === 'few clouds') {
        document.body.style.backgroundImage = "url('https://cdn.pixabay.com/photo/2019/12/13/02/27/climate-4691943_960_720.jpg')";
    }
    else if (conditions === 'scattered clouds') {
        document.body.style.backgroundImage = "url('https://cdn.pixabay.com/photo/2014/04/05/11/06/clouds-314476_960_720.jpg')";

    }
    else if (conditions === 'broken clouds') {
        document.body.style.backgroundImage = "url('https://cdn.pixabay.com/photo/2014/11/28/19/02/broken-549087_960_720.jpg')";

    }
    else if (conditions === 'shower rain') {
        document.body.style.backgroundImage = "url('https://cdn.pixabay.com/photo/2014/04/05/11/39/rain-316579_960_720.jpg')";
    }
    else if (conditions === 'rain') {
        document.body.style.backgroundImage = "url('https://cdn.pixabay.com/photo/2012/02/28/10/12/rain-17967_960_720.jpg')";
    }
    else if (conditions === 'thunderstorm') {
        document.body.style.backgroundImage = "url('https://cdn.pixabay.com/photo/2016/06/13/22/12/flash-1455285_960_720.jpg')";

    }
    else if (conditions === 'snow') {
        document.body.style.backgroundImage = "url('https://cdn.pixabay.com/photo/2019/12/29/13/59/trees-4727156_960_720.jpg')";
    }
    else if (conditions === 'mist') {
        document.body.style.backgroundImage = "url('https://cdn.pixabay.com/photo/2016/04/20/19/47/wolves-1341881_960_720.jpg')";
    }
    else {
        document.body.style.backgroundImage = "url('https://cdn.pixabay.com/photo/2017/06/26/18/29/seascape-2444691_960_720.jpg')";
    }
}
