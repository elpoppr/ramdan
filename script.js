// script.js
document.addEventListener("DOMContentLoaded", function () {
    let userLocation;

    // ����� ���� ��������
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                userLocation = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude,
                };
                fetchPrayerTimes(userLocation);
                fetchWeather(userLocation);
            },
            (error) => {
                alert("���� ������ ��� �����. ���� ����� ���� ������.");
                // ������� ���� ������� (����: ��� �������)
                userLocation = { lat: 21.4225, lng: 39.8262 };
                fetchPrayerTimes(userLocation);
                fetchWeather(userLocation);
            }
        );
    } else {
        alert("������� �� ���� ���� ������.");
        // ������� ���� ������� (����: ��� �������)
        userLocation = { lat: 21.4225, lng: 39.8262 };
        fetchPrayerTimes(userLocation);
        fetchWeather(userLocation);
    }

    // ��� ����� ������ ����� ��� ������
    function fetchPrayerTimes(location) {
        const apiUrl = `https://api.aladhan.com/v1/timings?latitude=${location.lat}&longitude=${location.lng}&method=2`;
        fetch(apiUrl)
            .then(response => response.json())
            .then(data => {
                const timings = data.data.timings;

                // ��� ����� ������
                const prayerTimes = [
                    { name: "�����", time: timings.Fajr },
                    { name: "������", time: timings.Sunrise },
                    { name: "�����", time: timings.Dhuhr },
                    { name: "�����", time: timings.Asr },
                    { name: "������", time: timings.Maghrib },
                    { name: "������", time: timings.Isha },
                ];

                const tableBody = document.getElementById("prayerTable");
                tableBody.innerHTML = ""; // ��� ������ ������
                prayerTimes.forEach(prayer => {
                    const row = document.createElement("tr");
                    row.innerHTML = `
                        <td>${prayer.name}</td>
                        <td>${prayer.time}</td>
                    `;
                    tableBody.appendChild(row);
                });

                // ����� ��� ������� �������
                const iftarTime = timings.Maghrib;
                const suhoorTime = timings.Fajr;

                document.getElementById("iftarTime").textContent = iftarTime;
                document.getElementById("suhoorTime").textContent = suhoorTime;

                // ���� ������ ������� �������
                setCountdown(iftarTime, "countdownIftar");
                setCountdown(suhoorTime, "countdownSuhoor");
            })
            .catch(error => console.error("Error fetching prayer times:", error));
    }

    // ��� ���� ����� ����� ��� ������
    function fetchWeather(location) {
        const weatherApiKey = "YOUR_WEATHER_API_KEY"; // ������ ������ API ����� ��
        fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${location.lat}&lon=${location.lng}&appid=${weatherApiKey}&units=metric&lang=ar`)
            .then(response => response.json())
            .then(data => {
                const weatherInfo = document.getElementById("weatherInfo");
                weatherInfo.textContent = `�������: ${data.main.temp}�C, �����: ${data.weather[0].description}`;
            })
            .catch(error => {
                console.error("Error fetching weather data:", error);
                document.getElementById("weatherInfo").textContent = "���� ����� ������ �����.";
            });
    }

    // ���� ������ ��������
    function setCountdown(targetTime, elementId) {
        const countdownElement = document.getElementById(elementId);

        function updateCountdown() {
            const now = new Date();
            const targetDate = new Date(`${now.toDateString()} ${targetTime}`);

            if (now > targetDate) {
                targetDate.setDate(targetDate.getDate() + 1); // �������� ����� ������
            }

            const timeDiff = targetDate - now;
            const hours = Math.floor((timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);

            countdownElement.textContent = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
        }

        setInterval(updateCountdown, 1000);
        updateCountdown();
    }

    // ��� ����
    const darkModeToggle = document.getElementById("darkModeToggle");
    darkModeToggle.addEventListener("click", () => {
        document.body.classList.toggle("dark-mode");
    });

    // �� ���� ����
    const quranButton = document.getElementById("quranButton");
    quranButton.addEventListener("click", () => {
        window.open("html.html");
    });

    // ����� �������
    let map;
    let service;

    function initMap() {
        map = new google.maps.Map(document.getElementById("map"), {
            center: userLocation || { lat: 21.4225, lng: 39.8262 }, // ��� ������� ����� �������
            zoom: 12,
        });

        service = new google.maps.places.PlacesService(map);

        document.getElementById("findMosquesButton").addEventListener("click", findNearbyMosques);
    }

    function findNearbyMosques() {
        if (!userLocation) {
            alert("���� ������ ��� �����.");
            return;
        }

        const request = {
            location: userLocation,
            radius: 5000, // 5 �������
            keyword: "����",
        };

        service.nearbySearch(request, (results, status) => {
            if (status === google.maps.places.PlacesServiceStatus.OK) {
                results.forEach((place) => {
                    new google.maps.Marker({
                        position: place.geometry.location,
                        map: map,
                        title: place.name,
                    });
                });
            } else {
                alert("���� ������ ��� ����� �����.");
            }
        });
    }

    // ����� ����� (30 �����)
    const duas = [
        "����� ���� ��� ���� ����� ���� ������.",
        "����� ��� ����� ����� ������ ������ ����� ������ �������.",
        "����� ������ ��� �������.",
        "����� ���� �� ������� ��������� ��� ���� ������.",
        "����� ��� ����� ���� �����ɡ ����� �� �� ���� ������.",
        "����� ������ �� �������� ������� �� ���������.",
        "����� ��� ����� ����� �������� �� ������ �������.",
        "����� ��� ����� ������� ������ �� �����.",
        "����� ��� ����� ��� �������.",
        "����� ��� ����� ����� ������ ������� ������.",
        "����� ��� ����� ����� ��� ��� ����� �� ��� �� ���.",
        "����� ��� ����� ������ �� �����.",
        "����� ��� ����� ����� ��� ������.",
        "����� ��� ����� ������ �� ����� ������ ������.",
        "����� ��� ����� ����� ��� ������ ������ ��� ������.",
        "����� ��� ����� ��� ���� ��.",
        "����� ��� ����� ����� �������� �� ���� ������ ����� �����.",
        "����� ��� ����� ����� �������� �� ������ �������.",
        "����� ��� ����� ������� �������.",
        "����� ��� ����� ������ ��� �����.",
        "����� ��� ����� ����� �� �������.",
        "����� ��� ����� ������� �� �� �����.",
        "����� ��� ����� ����� ��� �����.",
        "����� ��� ����� ����� ��� ����� ������.",
        "����� ��� ����� ����� �������.",
        "����� ��� ����� ������ �� ����� �������.",
        "����� ��� ����� ��� ����� �������.",
        "����� ��� ����� ����� ��� �����.",
        "����� ��� ����� ����� ��� �������.",
        "����� ��� ����� ����� �������.",
    ];

    // ����� �������� (30 ������)
    const quizQuestions = [
        { question: "�� �� ��� ��� ���� �� ������", answer: "����" },
        { question: "�� ��� ��� ������", answer: "114" },
        { question: "�� �� ���� ���� �� ������", answer: "������" },
        { question: "�� �� ���� ���� �� ������", answer: "������" },
        { question: "�� �� ��� ���", answer: "���" },
        { question: "�� �� ���� ���������", answer: "����" },
        { question: "�� �� ������ ���� ���� ��� ������", answer: "��" },
        { question: "�� �� ������ ���� ���� �� �����ȿ", answer: "�������" },
        { question: "�� ��� ����� �������", answer: "5" },
        { question: "�� �� ����� �������", answer: "������ɡ �����ɡ �����ɡ ����� ����" },
        { question: "�� �� ����� �������", answer: "������� ����� ������� ���� ���� ����� ����ѡ ����� ���� ����" },
        { question: "�� �� ���� ��� �� ������", answer: "��� ������" },
        { question: "�� �� ������ ���� ���� ���� ������ڿ", answer: "�����" },
        { question: "�� �� ������ ���� ���� ���� ������ ������", answer: "������" },
        { question: "�� �� ������ ���� ���� ���� ���������", answer: "����" },
        { question: "�� �� ������ ���� ���� ���� ������ֿ", answer: "������" },
        { question: "�� �� ������ ���� ���� ���� �����", answer: "�����" },
        { question: "�� �� ������ ���� ���� ���� �����Ͽ", answer: "�������" },
        { question: "�� �� ������ ���� ���� ���� ������", answer: "����" },
        { question: "�� �� ������ ���� ���� ���� ����ѿ", answer: "�����" },
        { question: "�� �� ������ ���� ���� ���� �����ɿ", answer: "������" },
        { question: "�� �� ������ ���� ���� ���� �������", answer: "�������" },
        { question: "�� �� ������ ���� ���� ���� ����߿", answer: "�����" },
        { question: "�� �� ������ ���� ���� ���� ������", answer: "����" },
        { question: "�� �� ������ ���� ���� ���� �����ɿ", answer: "������" },
        { question: "�� �� ������ ���� ���� ���� �����ɿ", answer: "������" },
        { question: "�� �� ������ ���� ���� ���� ������ɿ", answer: "�������" },
        { question: "�� �� ������ ���� ���� ���� �������", answer: "�������" },
        { question: "�� �� ������ ���� ���� ���� �������ʿ", answer: "��������" },
        { question: "�� �� ������ ���� ���� ���� ����ÿ", answer: "�����" },
    ];

    // ��� ���� �����
    const dailyDua = document.getElementById("dailyDua");
    const today = new Date().getDate(); // ����� ������ �� �����
    dailyDua.textContent = duas[today - 1]; // ��� ������ ������� �����

    // ��� ���� �����
    const quizQuestionElement = document.getElementById("quizQuestion");
    const quizAnswerElement = document.getElementById("quizAnswer");
    const quizResultElement = document.getElementById("quizResult");

    quizQuestionElement.textContent = quizQuestions[today - 1].question;

    document.getElementById("submitQuiz").addEventListener("click", () => {
        if (quizAnswerElement.value.trim().toLowerCase() === quizQuestions[today - 1].answer.toLowerCase()) {
            quizResultElement.textContent = "����� �����! ??";
            quizResultElement.style.color = "green";
        } else {
            quizResultElement.textContent = "����� ����ɡ ���� ��� ����!";
            quizResultElement.style.color = "red";
        }
    });

    // ������ ��� ����� ������� ���������
    function shareOnFacebook() {
        window.open("https://www.facebook.com/sharer/sharer.php?u=" + encodeURIComponent(window.location.href));
    }

    function shareOnTwitter() {
        window.open("https://twitter.com/intent/tweet?url=" + encodeURIComponent(window.location.href));
    }

    function shareOnWhatsApp() {
        window.open("https://api.whatsapp.com/send?text=" + encodeURIComponent(window.location.href));
    }

    // �������
    function googleTranslateElementInit() {
        new google.translate.TranslateElement({ pageLanguage: 'ar' }, 'google_translate_element');
    }
});