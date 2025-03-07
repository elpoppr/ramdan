// script.js
document.addEventListener("DOMContentLoaded", function () {
    let userLocation;

    //  ÕœÌœ „Êﬁ⁄ «·„” Œœ„
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
                alert(" ⁄–— «·Õ’Ê· ⁄·Ï „Êﬁ⁄ﬂ. Ì—ÃÏ  ›⁄Ì· Œœ„… «·„Êﬁ⁄.");
                // «” Œœ«„ „Êﬁ⁄ «› —«÷Ì („À«·: „ﬂ… «·„ﬂ—„…)
                userLocation = { lat: 21.4225, lng: 39.8262 };
                fetchPrayerTimes(userLocation);
                fetchWeather(userLocation);
            }
        );
    } else {
        alert("«·„ ’›Õ ·« Ìœ⁄„ Œœ„… «·„Êﬁ⁄.");
        // «” Œœ«„ „Êﬁ⁄ «› —«÷Ì („À«·: „ﬂ… «·„ﬂ—„…)
        userLocation = { lat: 21.4225, lng: 39.8262 };
        fetchPrayerTimes(userLocation);
        fetchWeather(userLocation);
    }

    // Ã·» √Êﬁ«  «·’·«… »‰«¡ ⁄·Ï «·„Êﬁ⁄
    function fetchPrayerTimes(location) {
        const apiUrl = `https://api.aladhan.com/v1/timings?latitude=${location.lat}&longitude=${location.lng}&method=2`;
        fetch(apiUrl)
            .then(response => response.json())
            .then(data => {
                const timings = data.data.timings;

                // ⁄—÷ √Êﬁ«  «·’·«…
                const prayerTimes = [
                    { name: "«·›Ã—", time: timings.Fajr },
                    { name: "«·‘—Êﬁ", time: timings.Sunrise },
                    { name: "«·ŸÂ—", time: timings.Dhuhr },
                    { name: "«·⁄’—", time: timings.Asr },
                    { name: "«·„€—»", time: timings.Maghrib },
                    { name: "«·⁄‘«¡", time: timings.Isha },
                ];

                const tableBody = document.getElementById("prayerTable");
                tableBody.innerHTML = ""; // „”Õ «·ÃœÊ· «·ﬁœÌ„
                prayerTimes.forEach(prayer => {
                    const row = document.createElement("tr");
                    row.innerHTML = `
                        <td>${prayer.name}</td>
                        <td>${prayer.time}</td>
                    `;
                    tableBody.appendChild(row);
                });

                //  ⁄ÌÌ‰ Êﬁ  «·≈›ÿ«— Ê«·”ÕÊ—
                const iftarTime = timings.Maghrib;
                const suhoorTime = timings.Fajr;

                document.getElementById("iftarTime").textContent = iftarTime;
                document.getElementById("suhoorTime").textContent = suhoorTime;

                // „ƒﬁ   ‰«“·Ì ··≈›ÿ«— Ê«·”ÕÊ—
                setCountdown(iftarTime, "countdownIftar");
                setCountdown(suhoorTime, "countdownSuhoor");
            })
            .catch(error => console.error("Error fetching prayer times:", error));
    }

    // Ã·» Õ«·… «·ÿﬁ” »‰«¡ ⁄·Ï «·„Êﬁ⁄
    function fetchWeather(location) {
        const weatherApiKey = "YOUR_WEATHER_API_KEY"; // «” »œ· »„› «Õ API «·Œ«’ »ﬂ
        fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${location.lat}&lon=${location.lng}&appid=${weatherApiKey}&units=metric&lang=ar`)
            .then(response => response.json())
            .then(data => {
                const weatherInfo = document.getElementById("weatherInfo");
                weatherInfo.textContent = `«·Õ—«—…: ${data.main.temp}∞C, «·ÿﬁ”: ${data.weather[0].description}`;
            })
            .catch(error => {
                console.error("Error fetching weather data:", error);
                document.getElementById("weatherInfo").textContent = " ⁄–—  Õ„Ì· »Ì«‰«  «·ÿﬁ”.";
            });
    }

    // œ«·… «·„ƒﬁ  «· ‰«“·Ì
    function setCountdown(targetTime, elementId) {
        const countdownElement = document.getElementById(elementId);

        function updateCountdown() {
            const now = new Date();
            const targetDate = new Date(`${now.toDateString()} ${targetTime}`);

            if (now > targetDate) {
                targetDate.setDate(targetDate.getDate() + 1); // «·«‰ ﬁ«· ··ÌÊ„ «· «·Ì
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

    // Ê÷⁄ ·Ì·Ì
    const darkModeToggle = document.getElementById("darkModeToggle");
    darkModeToggle.addEventListener("click", () => {
        document.body.classList.toggle("dark-mode");
    });

    // “— ﬁ—¬‰ ﬂ—Ì„
    const quranButton = document.getElementById("quranButton");
    quranButton.addEventListener("click", () => {
        window.open("html.html");
    });

    // Œ—Ìÿ… «·„”«Ãœ
    let map;
    let service;

    function initMap() {
        map = new google.maps.Map(document.getElementById("map"), {
            center: userLocation || { lat: 21.4225, lng: 39.8262 }, // „ﬂ… «·„ﬂ—„… ﬂ„Êﬁ⁄ «› —«÷Ì
            zoom: 12,
        });

        service = new google.maps.places.PlacesService(map);

        document.getElementById("findMosquesButton").addEventListener("click", findNearbyMosques);
    }

    function findNearbyMosques() {
        if (!userLocation) {
            alert(" ⁄–— «·Õ’Ê· ⁄·Ï „Êﬁ⁄ﬂ.");
            return;
        }

        const request = {
            location: userLocation,
            radius: 5000, // 5 ﬂÌ·Ê„ —
            keyword: "„”Ãœ",
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
                alert(" ⁄–— «·⁄ÀÊ— ⁄·Ï „”«Ãœ ﬁ—Ì»….");
            }
        });
    }

    // √œ⁄Ì… ÌÊ„Ì… (30 œ⁄«¡)
    const duas = [
        "«··Â„ √⁄‰Ì ⁄·Ï –ﬂ—ﬂ Ê‘ﬂ—ﬂ ÊÕ”‰ ⁄»«œ ﬂ.",
        "«··Â„ ≈‰Ì √”√·ﬂ ⁄·„« ‰«›⁄«° Ê—“ﬁ« ÿÌ»«° Ê⁄„·« „ ﬁ»·«.",
        "«··Â„ «—“ﬁ‰Ì Õ”‰ «·Œ« „….",
        "«··Â„ «€›— ·Ì Ê·Ê«·œÌ Ê··„ƒ„‰Ì‰ ÌÊ„ ÌﬁÊ„ «·Õ”«».",
        "«··Â„ ≈‰Ì √”√·ﬂ —÷«ﬂ Ê«·Ã‰…° Ê√⁄Ê– »ﬂ „‰ ”Œÿﬂ Ê«·‰«—.",
        "«··Â„ «Ã⁄·‰Ì „‰ «· Ê«»Ì‰ Ê«Ã⁄·‰Ì „‰ «·„ ÿÂ—Ì‰.",
        "«··Â„ ≈‰Ì √”√·ﬂ «·⁄›Ê Ê«·⁄«›Ì… ›Ì «·œ‰Ì« Ê«·¬Œ—….",
        "«··Â„ ≈‰Ì √”√·ﬂ «·›—œÊ” «·√⁄·Ï „‰ «·Ã‰….",
        "«··Â„ ≈‰Ì √”√·ﬂ Õ”‰ «·Œ« „….",
        "«··Â„ ≈‰Ì √”√·ﬂ «·ÂœÏ Ê«· ﬁÏ Ê«·⁄›«› Ê«·€‰Ï.",
        "«··Â„ ≈‰Ì √”√·ﬂ «·Ã‰… Ê„« ﬁ—» ≈·ÌÂ« „‰ ﬁÊ· √Ê ⁄„·.",
        "«··Â„ ≈‰Ì √”√·ﬂ «·‰Ã«… „‰ «·‰«—.",
        "«··Â„ ≈‰Ì √”√·ﬂ «·—÷« »⁄œ «·ﬁ÷«¡.",
        "«··Â„ ≈‰Ì √”√·ﬂ «·»—ﬂ… ›Ì «·⁄„— Ê«·’Õ… Ê«·⁄„·.",
        "«··Â„ ≈‰Ì √”√·ﬂ «·’»— ⁄‰œ «·»·«¡ Ê«·‘ﬂ— ⁄‰œ «·—Œ«¡.",
        "«··Â„ ≈‰Ì √”√·ﬂ Õ”‰ «·Ÿ‰ »ﬂ.",
        "«··Â„ ≈‰Ì √”√·ﬂ «·⁄›Ê Ê«·⁄«›Ì… ›Ì œÌ‰Ì Êœ‰Ì«Ì Ê√Â·Ì Ê„«·Ì.",
        "«··Â„ ≈‰Ì √”√·ﬂ «·” — Ê«·⁄«›Ì… ›Ì «·œ‰Ì« Ê«·¬Œ—….",
        "«··Â„ ≈‰Ì √”√·ﬂ «·„€›—… Ê«·—Õ„….",
        "«··Â„ ≈‰Ì √”√·ﬂ «·À»«  ⁄·Ï «·œÌ‰.",
        "«··Â„ ≈‰Ì √”√·ﬂ «·ﬁÊ… ›Ì «·⁄»«œ….",
        "«··Â„ ≈‰Ì √”√·ﬂ «· Ê›Ìﬁ ›Ì ﬂ· √„Ê—Ì.",
        "«··Â„ ≈‰Ì √”√·ﬂ «·›—Ã »⁄œ «·‘œ….",
        "«··Â„ ≈‰Ì √”√·ﬂ «·√„‰ ÌÊ„ «·›“⁄ «·√ﬂ»—.",
        "«··Â„ ≈‰Ì √”√·ﬂ «·Ã‰… Ê‰⁄Ì„Â«.",
        "«··Â„ ≈‰Ì √”√·ﬂ «·‰Ã«… „‰ «·‰«— Ê⁄–«»Â«.",
        "«··Â„ ≈‰Ì √”√·ﬂ Õ”‰ «·⁄„· ÊŒ« „ Â.",
        "«··Â„ ≈‰Ì √”√·ﬂ «·’»— ⁄·Ï ÿ«⁄ ﬂ.",
        "«··Â„ ≈‰Ì √”√·ﬂ «·⁄›Ê ⁄‰œ «·„⁄’Ì….",
        "«··Â„ ≈‰Ì √”√·ﬂ «·—÷« »«·ﬁ÷«¡.",
    ];

    // √”∆·… «·„”«»ﬁ… (30 ”ƒ«·«)
    const quizQuestions = [
        { question: "„« ÂÌ √Ê· ¬Ì… ‰“·  ›Ì «·ﬁ—¬‰ø", answer: "«ﬁ—√" },
        { question: "ﬂ„ ⁄œœ ”Ê— «·ﬁ—¬‰ø", answer: "114" },
        { question: "„« ÂÌ √ÿÊ· ”Ê—… ›Ì «·ﬁ—¬‰ø", answer: "«·»ﬁ—…" },
        { question: "„« ÂÌ √ﬁ’— ”Ê—… ›Ì «·ﬁ—¬‰ø", answer: "«·ﬂÊÀ—" },
        { question: "„‰ ÂÊ √Ê· ‰»Ìø", answer: "¬œ„" },
        { question: "„‰ ÂÊ Œ« „ «·√‰»Ì«¡ø", answer: "„Õ„œ" },
        { question: "„« ÂÌ «·”Ê—… «· Ì  ”„Ï ﬁ·» «·ﬁ—¬‰ø", answer: "Ì”" },
        { question: "„« ÂÌ «·”Ê—… «· Ì  ”„Ï √„ «·ﬂ «»ø", answer: "«·›« Õ…" },
        { question: "ﬂ„ ⁄œœ √—ﬂ«‰ «·≈”·«„ø", answer: "5" },
        { question: "„« ÂÌ √—ﬂ«‰ «·≈”·«„ø", answer: "«·‘Â«œ…° «·’·«…° «·“ﬂ«…° «·’Ê„° «·ÕÃ" },
        { question: "„« ÂÌ √—ﬂ«‰ «·≈Ì„«‰ø", answer: "«·≈Ì„«‰ »«··Â° „·«∆ﬂ Â° ﬂ »Â° —”·Â° «·ÌÊ„ «·¬Œ—° «·ﬁœ— ŒÌ—Â Ê‘—Â" },
        { question: "„« ÂÌ √⁄Ÿ„ ¬Ì… ›Ì «·ﬁ—¬‰ø", answer: "¬Ì… «·ﬂ—”Ì" },
        { question: "„« ÂÌ «·”Ê—… «· Ì  ”„Ï ”Ê—… «· ÊœÌ⁄ø", answer: "«·‰’—" },
        { question: "„« ÂÌ «·”Ê—… «· Ì  ”„Ï ”Ê—… «·‰”«¡ «·’€—Ïø", answer: "«·ÿ·«ﬁ" },
        { question: "„« ÂÌ «·”Ê—… «· Ì  ”„Ï ”Ê—… «·ÕÊ«—ÌÌ‰ø", answer: "«·’›" },
        { question: "„« ÂÌ «·”Ê—… «· Ì  ”„Ï ”Ê—… «·›—«∆÷ø", answer: "«·‰”«¡" },
        { question: "„« ÂÌ «·”Ê—… «· Ì  ”„Ï ”Ê—… «·‰⁄„ø", answer: "«·‰Õ·" },
        { question: "„« ÂÌ «·”Ê—… «· Ì  ”„Ï ”Ê—… «·⁄ﬁÊœø", answer: "«·„«∆œ…" },
        { question: "„« ÂÌ «·”Ê—… «· Ì  ”„Ï ”Ê—… «·ﬁ «·ø", answer: "„Õ„œ" },
        { question: "„« ÂÌ «·”Ê—… «· Ì  ”„Ï ”Ê—… «·Õ‘—ø", answer: "«·Õ‘—" },
        { question: "„« ÂÌ «·”Ê—… «· Ì  ”„Ï ”Ê—… «· Ê»…ø", answer: "«· Ê»…" },
        { question: "„« ÂÌ «·”Ê—… «· Ì  ”„Ï ”Ê—… «·›—ﬁ«‰ø", answer: "«·›—ﬁ«‰" },
        { question: "„« ÂÌ «·”Ê—… «· Ì  ”„Ï ”Ê—… «·„·ﬂø", answer: "«·„·ﬂ" },
        { question: "„« ÂÌ «·”Ê—… «· Ì  ”„Ï ”Ê—… «·„ƒ„‰ø", answer: "€«›—" },
        { question: "„« ÂÌ «·”Ê—… «· Ì  ”„Ï ”Ê—… «·”Ãœ…ø", answer: "«·”Ãœ…" },
        { question: "„« ÂÌ «·”Ê—… «· Ì  ”„Ï ”Ê—… «·Õ«ﬁ…ø", answer: "«·Õ«ﬁ…" },
        { question: "„« ÂÌ «·”Ê—… «· Ì  ”„Ï ”Ê—… «·ﬁÌ«„…ø", answer: "«·ﬁÌ«„…" },
        { question: "„« ÂÌ «·”Ê—… «· Ì  ”„Ï ”Ê—… «·≈‰”«‰ø", answer: "«·≈‰”«‰" },
        { question: "„« ÂÌ «·”Ê—… «· Ì  ”„Ï ”Ê—… «·„—”·« ø", answer: "«·„—”·« " },
        { question: "„« ÂÌ «·”Ê—… «· Ì  ”„Ï ”Ê—… «·‰»√ø", answer: "«·‰»√" },
    ];

    // ⁄—÷ œ⁄«¡ «·ÌÊ„
    const dailyDua = document.getElementById("dailyDua");
    const today = new Date().getDate(); // «·ÌÊ„ «·Õ«·Ì „‰ «·‘Â—
    dailyDua.textContent = duas[today - 1]; // ⁄—÷ «·œ⁄«¡ «·„‰«”» ··ÌÊ„

    // ⁄—÷ ”ƒ«· «·ÌÊ„
    const quizQuestionElement = document.getElementById("quizQuestion");
    const quizAnswerElement = document.getElementById("quizAnswer");
    const quizResultElement = document.getElementById("quizResult");

    quizQuestionElement.textContent = quizQuestions[today - 1].question;

    document.getElementById("submitQuiz").addEventListener("click", () => {
        if (quizAnswerElement.value.trim().toLowerCase() === quizQuestions[today - 1].answer.toLowerCase()) {
            quizResultElement.textContent = "≈Ã«»… ’ÕÌÕ…! ??";
            quizResultElement.style.color = "green";
        } else {
            quizResultElement.textContent = "≈Ã«»… Œ«ÿ∆…° Õ«Ê· „—… √Œ—Ï!";
            quizResultElement.style.color = "red";
        }
    });

    // „‘«—ﬂ… ⁄·Ï Ê”«∆· «· Ê«’· «·«Ã „«⁄Ì
    function shareOnFacebook() {
        window.open("https://www.facebook.com/sharer/sharer.php?u=" + encodeURIComponent(window.location.href));
    }

    function shareOnTwitter() {
        window.open("https://twitter.com/intent/tweet?url=" + encodeURIComponent(window.location.href));
    }

    function shareOnWhatsApp() {
        window.open("https://api.whatsapp.com/send?text=" + encodeURIComponent(window.location.href));
    }

    // «· —Ã„…
    function googleTranslateElementInit() {
        new google.translate.TranslateElement({ pageLanguage: 'ar' }, 'google_translate_element');
    }
});