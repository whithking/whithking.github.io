// 高德天气API配置
const AMAP_API_KEY = 'c85a813b243bdcdf5b6d11d72d48321e'; // 替换成你的高德API key
const AMAP_API_BASE = 'https://restapi.amap.com/v3/weather';

// 获取天气数据
async function getWeather() {
    const cityInput = document.getElementById('city-input');
    const city = cityInput.value;

    if (!city) {
        alert('请输入城市名称');
        return;
    }

    try {
        // 获取城市编码
        const geocodeResponse = await fetch(
            `https://restapi.amap.com/v3/geocode/geo?address=${encodeURIComponent(city)}&key=${AMAP_API_KEY}`
        );
        const geocodeData = await geocodeResponse.json();

        if (!geocodeData.geocodes || geocodeData.geocodes.length === 0) {
            throw new Error('城市未找到');
        }

        const adcode = geocodeData.geocodes[0].adcode;

        // 获取实时天气
        const liveWeatherResponse = await fetch(
            `${AMAP_API_BASE}/weatherInfo?city=${adcode}&key=${AMAP_API_KEY}&extensions=base`
        );
        const liveWeatherData = await liveWeatherResponse.json();

        // 获取天气预报
        const forecastResponse = await fetch(
            `${AMAP_API_BASE}/weatherInfo?city=${adcode}&key=${AMAP_API_KEY}&extensions=all`
        );
        const forecastData = await forecastResponse.json();

        updateWeatherUI(liveWeatherData, forecastData);
    } catch (error) {
        console.error('获取天气数据失败:', error);
        alert('获取天气数据失败，请检查城市名称是否正确');
    }
}

// 更新天气界面
function updateWeatherUI(live, forecast) {
    if (!live.lives || !live.lives[0] || !forecast.forecasts || !forecast.forecasts[0]) {
        throw new Error('天气数据格式错误');
    }

    const currentWeather = live.lives[0];
    const forecasts = forecast.forecasts[0].casts;

    // 更新当前天气
    document.getElementById('city-name').textContent = currentWeather.city;
    document.getElementById('current-temp').textContent = currentWeather.temperature;
    document.getElementById('humidity').textContent = currentWeather.humidity;
    document.getElementById('wind-speed').textContent = `${currentWeather.windpower}级`;
    
    // 设置天气图标
    const weatherIcon = document.getElementById('weather-icon');
    weatherIcon.className = `wi ${getWeatherIcon(currentWeather.weather)}`;

    // 更新天气预报
    const forecastContainer = document.getElementById('forecast-container');
    forecastContainer.innerHTML = '';

    // 显示未来4天的天气预报
    forecasts.slice(1).forEach(day => {
        const date = new Date(day.date);
        const dayName = date.toLocaleDateString('zh-CN', { weekday: 'short' });
        
        const forecastDay = document.createElement('div');
        forecastDay.className = 'forecast-day';
        forecastDay.innerHTML = `
            <div class="forecast-date">${dayName}</div>
            <i class="wi ${getWeatherIcon(day.dayweather)}"></i>
            <div class="forecast-temp">${day.daytemp}°C</div>
        `;
        forecastContainer.appendChild(forecastDay);
    });
}

// 天气状况映射到天气图标
function getWeatherIcon(weather) {
    const iconMap = {
        '晴': 'wi-day-sunny',
        '多云': 'wi-day-cloudy',
        '阴': 'wi-cloudy',
        '小雨': 'wi-rain',
        '中雨': 'wi-rain',
        '大雨': 'wi-rain',
        '暴雨': 'wi-rain',
        '雷阵雨': 'wi-thunderstorm',
        '阵雨': 'wi-showers',
        '雨夹雪': 'wi-sleet',
        '小雪': 'wi-snow',
        '中雪': 'wi-snow',
        '大雪': 'wi-snow',
        '暴雪': 'wi-snow',
        '雾': 'wi-fog',
        '霾': 'wi-dust',
        '沙尘暴': 'wi-sandstorm'
    };

    return iconMap[weather] || 'wi-day-sunny'; // 默认返回晴天图标
}

// 页面加载时获取默认城市的天气
document.addEventListener('DOMContentLoaded', () => {
    const defaultCity = '北京'; // 设置默认城市
    document.getElementById('city-input').value = defaultCity;
    getWeather();
}); 