// تهيئة الخريطة
let map, service;

function initMap() {
    map = new google.maps.Map(document.getElementById("map"), {
        center: { lat: 21.4225, lng: 39.8262 },
        zoom: 12,
    });
    service = new google.maps.places.PlacesService(map);
}

// تحديد الموقع
document.addEventListener("DOMContentLoaded", () => {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            position => {
                const userLocation = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                };
                fetchPrayerTimes(userLocation);
                initMap(userLocation);
            },
            error => {
                alert("الموقع غير مفعل، سيتم استخدام موقع افتراضي");
                initMap();
            }
        );
    }
});

// الوضع الليلي
document.getElementById("darkModeToggle").addEventListener("click", () => {
    document.body.classList.toggle("dark-mode");
});

// وظائف إضافية
async function fetchPrayerTimes(location) {
    try {
        const response = await fetch(`https://api.aladhan.com/v1/timings?latitude=${location.lat}&longitude=${location.lng}&method=2`);
        const data = await response.json();
        updatePrayerTable(data.data.timings);
    } catch (error) {
        console.error("خطأ في جلب أوقات الصلاة:", error);
    }
}

function updatePrayerTable(timings) {
    const prayers = {
        Fajr: "الفجر",
        Dhuhr: "الظهر",
        Asr: "العصر",
        Maghrib: "المغرب",
        Isha: "العشاء"
    };

    const tableBody = document.getElementById("prayerTable");
    tableBody.innerHTML = Object.entries(prayers)
        .map(([key, name]) => `
            <tr>
                <td>${name}</td>
                <td>${timings[key]}</td>
            </tr>
        `).join("");
}

// الترجمة
function googleTranslateElementInit() {
    new google.translate.TranslateElement({ 
        pageLanguage: 'ar',
        layout: google.translate.TranslateElement.InlineLayout.SIMPLE
    }, 'google_translate_element');
}
