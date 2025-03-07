// js.js
document.addEventListener("DOMContentLoaded", function () {
    const surahSelect = document.getElementById("surah-select");
    const loadSurahButton = document.getElementById("load-surah");
    const surahNameElement = document.getElementById("surah-name");
    const quranContentElement = document.getElementById("quran-content");

    // ÌáÈ ÞÇÆãÉ ÇáÓæÑ ãä API
    fetch("https://api.quran.com/api/v4/chapters")
        .then(response => response.json())
        .then(data => {
            const surahs = data.chapters;
            populateSurahList(surahs);
            
            // ÊÍãíá ÇáÓæÑÉ ÇáÃæáì ÊáÞÇÆíðÇ
            loadSurah(surahs[0].id);
        })
        .catch(error => {
            console.error("Error fetching chapters:", error);
            alert("ÊÚÐÑ ÊÍãíá ÞÇÆãÉ ÇáÓæÑ!");
        });

    function populateSurahList(surahs) {
        surahs.forEach(surah => {
            const option = document.createElement("option");
            option.value = surah.id;
            option.textContent = `${surah.name_arabic} (${surah.translated_name.name})`;
            surahSelect.appendChild(option);
        });
    }

    function loadSurah(surahId) {
        fetch(`https://api.quran.com/api/v4/quran/verses/uthmani?chapter_number=${surahId}`)
            .then(response => response.json())
            .then(data => {
                const verses = data.verses;
                const surahName = verses[0].chapter_name_arabic;
                const surahText = verses.map(v => v.text_uthmani).join('\n');
                
                surahNameElement.textContent = surahName;
                quranContentElement.textContent = surahText;
            })
            .catch(error => {
                console.error("Error fetching verses:", error);
                quranContentElement.textContent = "ÊÚÐÑ ÊÍãíá äÕ ÇáÓæÑÉ!";
            });
    }

    loadSurahButton.addEventListener("click", () => {
        const selectedSurahId = surahSelect.value;
        loadSurah(selectedSurahId);
    });
});