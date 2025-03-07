// script.js
document.addEventListener("DOMContentLoaded", function () {
    let userLocation;

    // تحديد موقع المستخدم
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
                alert("تعذر الحصول على موقعك. يرجى تفعيل خدمة الموقع.");
                // استخدام موقع افتراضي (مثال: مكة المكرمة)
                userLocation = { lat: 21.4225, lng: 39.8262 };
                fetchPrayerTimes(userLocation);
                fetchWeather(userLocation);
            }
        );
    } else {
        alert("المتصفح لا يدعم خدمة الموقع.");
        // استخدام موقع افتراضي (مثال: مكة المكرمة)
        userLocation = { lat: 21.4225, lng: 39.8262 };
        fetchPrayerTimes(userLocation);
        fetchWeather(userLocation);
    }

    // جلب أوقات الصلاة بناءً على الموقع
    function fetchPrayerTimes(location) {
        const apiUrl = `https://api.aladhan.com/v1/timings?latitude=${location.lat}&longitude=${location.lng}&method=2`;
        fetch(apiUrl)
            .then(response => response.json())
            .then(data => {
                const timings = data.data.timings;

                // عرض أوقات الصلاة
                const prayerTimes = [
                    { name: "الفجر", time: timings.Fajr },
                    { name: "الشروق", time: timings.Sunrise },
                    { name: "الظهر", time: timings.Dhuhr },
                    { name: "العصر", time: timings.Asr },
                    { name: "المغرب", time: timings.Maghrib },
                    { name: "العشاء", time: timings.Isha },
                ];

                const tableBody = document.getElementById("prayerTable");
                tableBody.innerHTML = ""; // مسح الجدول القديم
                prayerTimes.forEach(prayer => {
                    const row = document.createElement("tr");
                    row.innerHTML = `
                        <td>${prayer.name}</td>
                        <td>${prayer.time}</td>
                    `;
                    tableBody.appendChild(row);
                });

                // تعيين وقت الإفطار والسحور
                const iftarTime = timings.Maghrib;
                const suhoorTime = timings.Fajr;

                document.getElementById("iftarTime").textContent = iftarTime;
                document.getElementById("suhoorTime").textContent = suhoorTime;

                // مؤقت تنازلي للإفطار والسحور
                setCountdown(iftarTime, "countdownIftar");
                setCountdown(suhoorTime, "countdownSuhoor");
            })
            .catch(error => console.error("Error fetching prayer times:", error));
    }

    // جلب حالة الطقس بناءً على الموقع
    function fetchWeather(location) {
        const weatherApiKey = "YOUR_WEATHER_API_KEY"; // استبدل بمفتاح API الخاص بك
        fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${location.lat}&lon=${location.lng}&appid=${weatherApiKey}&units=metric&lang=ar`)
            .then(response => response.json())
            .then(data => {
                const weatherInfo = document.getElementById("weatherInfo");
                weatherInfo.textContent = `الحرارة: ${data.main.temp}°C, الطقس: ${data.weather[0].description}`;
            })
            .catch(error => {
                console.error("Error fetching weather data:", error);
                document.getElementById("weatherInfo").textContent = "تعذر تحميل بيانات الطقس.";
            });
    }

    // دالة المؤقت التنازلي
    function setCountdown(targetTime, elementId) {
        const countdownElement = document.getElementById(elementId);

        function updateCountdown() {
            const now = new Date();
            const targetDate = new Date(`${now.toDateString()} ${targetTime}`);

            if (now > targetDate) {
                targetDate.setDate(targetDate.getDate() + 1); // الانتقال لليوم التالي
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

    // وضع ليلي
    const darkModeToggle = document.getElementById("darkModeToggle");
    darkModeToggle.addEventListener("click", () => {
        document.body.classList.toggle("dark-mode");
    });

    // زر قرآن كريم
    const quranButton = document.getElementById("quranButton");
    quranButton.addEventListener("click", () => {
        window.open("html.html");
    });

    // خريطة المساجد
    let map;
    let service;

    function initMap() {
        map = new google.maps.Map(document.getElementById("map"), {
            center: userLocation || { lat: 21.4225, lng: 39.8262 }, // مكة المكرمة كموقع افتراضي
            zoom: 12,
        });

        service = new google.maps.places.PlacesService(map);

        document.getElementById("findMosquesButton").addEventListener("click", findNearbyMosques);
    }

    function findNearbyMosques() {
        if (!userLocation) {
            alert("تعذر الحصول على موقعك.");
            return;
        }

        const request = {
            location: userLocation,
            radius: 5000, // 5 كيلومتر
            keyword: "مسجد",
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
                alert("تعذر العثور على مساجد قريبة.");
            }
        });
    }

    // أدعية يومية (30 دعاءً)
    const duas = [
        "اللهم أعني على ذكرك وشكرك وحسن عبادتك.",
        "اللهم إني أسألك علماً نافعاً، ورزقاً طيباً، وعملاً متقبلاً.",
        "اللهم ارزقني حسن الخاتمة.",
        "اللهم اغفر لي ولوالدي وللمؤمنين يوم يقوم الحساب.",
        "اللهم إني أسألك رضاك والجنة، وأعوذ بك من سخطك والنار.",
        "اللهم اجعلني من التوابين واجعلني من المتطهرين.",
        "اللهم إني أسألك العفو والعافية في الدنيا والآخرة.",
        "اللهم إني أسألك الفردوس الأعلى من الجنة.",
        "اللهم إني أسألك حسن الخاتمة.",
        "اللهم إني أسألك الهدى والتقى والعفاف والغنى.",
        "اللهم إني أسألك الجنة وما قرب إليها من قول أو عمل.",
        "اللهم إني أسألك النجاة من النار.",
        "اللهم إني أسألك الرضا بعد القضاء.",
        "اللهم إني أسألك البركة في العمر والصحة والعمل.",
        "اللهم إني أسألك الصبر عند البلاء والشكر عند الرخاء.",
        "اللهم إني أسألك حسن الظن بك.",
        "اللهم إني أسألك العفو والعافية في ديني ودنياي وأهلي ومالي.",
        "اللهم إني أسألك الستر والعافية في الدنيا والآخرة.",
        "اللهم إني أسألك المغفرة والرحمة.",
        "اللهم إني أسألك الثبات على الدين.",
        "اللهم إني أسألك القوة في العبادة.",
        "اللهم إني أسألك التوفيق في كل أموري.",
        "اللهم إني أسألك الفرج بعد الشدة.",
        "اللهم إني أسألك الأمن يوم الفزع الأكبر.",
        "اللهم إني أسألك الجنة ونعيمها.",
        "اللهم إني أسألك النجاة من النار وعذابها.",
        "اللهم إني أسألك حسن العمل وخاتمته.",
        "اللهم إني أسألك الصبر على طاعتك.",
        "اللهم إني أسألك العفو عند المعصية.",
        "اللهم إني أسألك الرضا بالقضاء.",
    ];

    // أسئلة المسابقة (30 سؤالاً)
    const quizQuestions = [
        { question: "ما هي أول آية نزلت في القرآن؟", answer: "اقرأ" },
        { question: "كم عدد سور القرآن؟", answer: "114" },
        { question: "ما هي أطول سورة في القرآن؟", answer: "البقرة" },
        { question: "ما هي أقصر سورة في القرآن؟", answer: "الكوثر" },
        { question: "من هو أول نبي؟", answer: "آدم" },
        { question: "من هو خاتم الأنبياء؟", answer: "محمد" },
        { question: "ما هي السورة التي تسمى قلب القرآن؟", answer: "يس" },
        { question: "ما هي السورة التي تسمى أم الكتاب؟", answer: "الفاتحة" },
        { question: "كم عدد أركان الإسلام؟", answer: "5" },
        { question: "ما هي أركان الإسلام؟", answer: "الشهادة، الصلاة، الزكاة، الصوم، الحج" },
        { question: "ما هي أركان الإيمان؟", answer: "الإيمان بالله، ملائكته، كتبه، رسله، اليوم الآخر، القدر خيره وشره" },
        { question: "ما هي أعظم آية في القرآن؟", answer: "آية الكرسي" },
        { question: "ما هي السورة التي تسمى سورة التوديع؟", answer: "النصر" },
        { question: "ما هي السورة التي تسمى سورة النساء الصغرى؟", answer: "الطلاق" },
        { question: "ما هي السورة التي تسمى سورة الحواريين؟", answer: "الصف" },
        { question: "ما هي السورة التي تسمى سورة الفرائض؟", answer: "النساء" },
        { question: "ما هي السورة التي تسمى سورة النعم؟", answer: "النحل" },
        { question: "ما هي السورة التي تسمى سورة العقود؟", answer: "المائدة" },
        { question: "ما هي السورة التي تسمى سورة القتال؟", answer: "محمد" },
        { question: "ما هي السورة التي تسمى سورة الحشر؟", answer: "الحشر" },
        { question: "ما هي السورة التي تسمى سورة التوبة؟", answer: "التوبة" },
        { question: "ما هي السورة التي تسمى سورة الفرقان؟", answer: "الفرقان" },
        { question: "ما هي السورة التي تسمى سورة الملك؟", answer: "الملك" },
        { question: "ما هي السورة التي تسمى سورة المؤمن؟", answer: "غافر" },
        { question: "ما هي السورة التي تسمى سورة السجدة؟", answer: "السجدة" },
        { question: "ما هي السورة التي تسمى سورة الحاقة؟", answer: "الحاقة" },
        { question: "ما هي السورة التي تسمى سورة القيامة؟", answer: "القيامة" },
        { question: "ما هي السورة التي تسمى سورة الإنسان؟", answer: "الإنسان" },
        { question: "ما هي السورة التي تسمى سورة المرسلات؟", answer: "المرسلات" },
        { question: "ما هي السورة التي تسمى سورة النبأ؟", answer: "النبأ" },
    ];

    // عرض دعاء اليوم
    const dailyDua = document.getElementById("dailyDua");
    const today = new Date().getDate(); // اليوم الحالي من الشهر
    dailyDua.textContent = duas[today - 1]; // عرض الدعاء المناسب لليوم

    // عرض سؤال اليوم
    const quizQuestionElement = document.getElementById("quizQuestion");
    const quizAnswerElement = document.getElementById("quizAnswer");
    const quizResultElement = document.getElementById("quizResult");

    quizQuestionElement.textContent = quizQuestions[today - 1].question;

    document.getElementById("submitQuiz").addEventListener("click", () => {
        if (quizAnswerElement.value.trim().toLowerCase() === quizQuestions[today - 1].answer.toLowerCase()) {
            quizResultElement.textContent = "إجابة صحيحة! ??";
            quizResultElement.style.color = "green";
        } else {
            quizResultElement.textContent = "إجابة خاطئة، حاول مرة أخرى!";
            quizResultElement.style.color = "red";
        }
    });

    // مشاركة على وسائل التواصل الاجتماعي
    function shareOnFacebook() {
        window.open("https://www.facebook.com/sharer/sharer.php?u=" + encodeURIComponent(window.location.href));
    }

    function shareOnTwitter() {
        window.open("https://twitter.com/intent/tweet?url=" + encodeURIComponent(window.location.href));
    }

    function shareOnWhatsApp() {
        window.open("https://api.whatsapp.com/send?text=" + encodeURIComponent(window.location.href));
    }

    // الترجمة
    function googleTranslateElementInit() {
        new google.translate.TranslateElement({ pageLanguage: 'ar' }, 'google_translate_element');
    }
});
