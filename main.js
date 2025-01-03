// Configuration for the calendar
const config = {
    defaultYear: new Date().getFullYear(),
    defaultMonth: new Date().getMonth(),
    selectedStartDate: null,
    selectedEndDate: null,
    today: new Date(), // Dnešní datum
};

// Check if a day is in the past
function isDayInPast(day, month, year) {
    const date = new Date(year, month, day);
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Nastavíme čas na začátek dne
    return date < today;
}



// Nastavení minimálního data ve vstupních polích
function setMinDateForInputs() {
    const startDateInput = document.getElementById("selected-start-date");
    const endDateInput = document.getElementById("selected-end-date");
    const today = new Date();
    const minDateStr = formatDateForInput(today);

    startDateInput.min = minDateStr;
    endDateInput.min = minDateStr;
}

// Gallery data
// Integrating surroundings data into the existing galleryData
const galleryData = {
    bathroom: [
        { image: "images/horni-koupelna-2.jpeg", text: "Horní koupelna 2" },
        { image: "images/dolni-koupelna-1.jpg", text: "Dolní koupelna" },
        { image: "images/horni-koupelna-1.jpg", text: "Horní koupelna" },
    ],
    kitchen: [
        { image: "images/obyvak.jpg", text: "Obývák" },
        { image: "images/obyvak-2.jpeg", text: "Obývák 2" },
        { image: "images/obyvak-3.jpg", text: "Obývák 3" },
        { image: "images/jidelna.jpeg", text: "Jídelna" },
        { image: "images/kuchyn.jpg", text: "Kuchyň" },
    ],
    bedroom: [
        { image: "images/loznice-1.jpg", text: "Horní ložnice" },
        { image: "images/loznice-2.jpeg", text: "Dolní ložnice" },
        { image: "images/loznice.jpeg", text: "Hlavní ložnice" },
    ],
    exterior: [
        { image: "images/exterier-zima.jpeg", text: "Exteriér zima" },
        { image: "images/exterier-leto.jpg", text: "Exteriér léto" },
        { image: "images/terasa.jpeg", text: "Terasa" },
        { image: "images/vchod.jpg", text: "Vchod" },
    ],
};

// Data pro sekci "Build"
const buildImages = [
    { 
        url: "images/sjezdovka-nedaleko.jpeg", 
        description: "Sjezdovka nedaleko", 
        source: "" // Prázdný zdroj
    },
    { 
        url: "images/stezka.jpeg", 
        description: "Stezka v korunách stromů", 
        source: "https://www.stezkakorunamistromu.cz/fotogalerie/zima-ea6bd2pe4g" 
    },
    { 
        url: "images/jezero.jpg", 
        description: "Bruslení na zamrzlém jezeře", 
        source: "https://www.kudyznudy.cz/aktivity/bruslarska-draha-na-lipne" 
    },
    { 
        url: "images/rozhledna-dobra-voda.jpeg", 
        description: "Rozhledna Dobrá Voda", 
        source: "https://www.jiznicechy.cz/turisticke-cile/1983-rozhledna-dobra-voda" 
    },
    { 
        url: "images/zimni-priroda.jpeg", 
        description: "Zimní příroda", 
        source: "" // Prázdný zdroj
    },
];

function renderBuildCarousel() {
    const carouselInner = document.querySelector('#buildCarousel .carousel-inner');
    carouselInner.innerHTML = ''; // Vymaže aktuální obsah

    buildImages.forEach((image, index) => {
        const carouselItem = document.createElement('div');
        carouselItem.classList.add('carousel-item');
        if (index === 0) carouselItem.classList.add('active'); // První slide je aktivní

        const imgHTML = `
            <img src="${image.url}" class="d-block w-100 rounded" alt="${image.description}">
        `;

        // Kontrola, zda existuje zdroj
        const sourceHTML = image.source
            ? `<p class="carousel-source"><a href="${image.source}" target="_blank">Zdroj</a></p>`
            : '';

        carouselItem.innerHTML = `
            ${imgHTML}
            <div class="carousel-caption">
                ${sourceHTML}
                <p>${image.description}</p>
            </div>
        `;

        carouselInner.appendChild(carouselItem);
    });
}

// Inicializace carouselu pro sekci "Build"
renderBuildCarousel();



document.addEventListener("DOMContentLoaded", function () {
    function populateCarousel(section, carouselId) {
        const carouselInner = document.querySelector(`#${carouselId} .carousel-inner`);
        const items = galleryData[section];

        items.forEach((item, index) => {
            // Vytvoření položky karuselu
            const carouselItem = document.createElement("div");
            carouselItem.classList.add("carousel-item");
            if (index === 0) {
                carouselItem.classList.add("active"); // Nastavení první položky jako aktivní
            }

            // Vytvoření prvku obrázku
            const imgElement = document.createElement("img");
            imgElement.src = item.image;
            imgElement.alt = item.text;
            imgElement.classList.add("d-block", "w-100");

            // Vytvoření popisku
            const captionElement = document.createElement("div");
            captionElement.classList.add("carousel-caption");

            // Přidání textu popisku
            const textElement = document.createElement("p");
            textElement.textContent = item.text;
            captionElement.appendChild(textElement);

            // Přidání odkazu na zdroj, pokud existuje
            if (item.source) {
                const sourceElement = document.createElement("p");
                const sourceLink = document.createElement("a");
                sourceLink.href = item.source;
                sourceLink.target = "_blank";
                sourceLink.textContent = "Zdroj";
                sourceElement.appendChild(sourceLink);
                sourceElement.style.fontSize = "0.9rem";
                sourceElement.style.marginTop = "5px";
                captionElement.appendChild(sourceElement);
            }

            // Přidání obrázku a popisku do položky karuselu
            carouselItem.appendChild(imgElement);
            carouselItem.appendChild(captionElement);

            // Přidání položky karuselu do kontejneru karuselu
            carouselInner.appendChild(carouselItem);
        });
    }

    // Inicializace všech galerií
    Object.keys(galleryData).forEach((section) => {
        const carouselId = `${section}Carousel`;
        const carouselInner = document.querySelector(`#${carouselId} .carousel-inner`);
        if (carouselInner) {
            populateCarousel(section, carouselId);
        }
    });
    renderBuildCarousel();
});



// Fetch booked days from JSON file or API
async function fetchBookedDays(month, year) {
    try {
        // If 'month' is zero-based (Jan=0), then do 'month + 1'
        // for the API call, since your server route expects Jan=1
        const response = await fetch(`http://localhost:3000/api/reservations/${year}/${month + 1}`);

        if (!response.ok) {
            throw new Error(`Failed to fetch: ${response.statusText}`);
        }
        
        // The server returns an array of day numbers
        const bookedDaysArray = await response.json(); // e.g. [5,6,7]
        return bookedDaysArray;
    } catch (error) {
        console.error('Error fetching reservations:', error);
        return [];
    }
}


// Upravená funkce createMonthCalendar (přidáno async/await)
async function createMonthCalendar(month, year) {
    const calendarContainer = document.getElementById("calendar-container");
    if (!calendarContainer) return;

    const monthNames = [
        "Leden", "Únor", "Březen", "Duben", "Květen", "Červen",
        "Červenec", "Srpen", "Září", "Říjen", "Listopad", "Prosinec",
    ];

    // Fetch booked days asynchronously
    const bookedDays = await fetchBookedDays(month, year);

    const firstDayOfWeek = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDay = (firstDayOfWeek + 6) % 7; // Adjust to start with Monday

    // Create calendar days
    const daysContainer = `
        <div class="days">
            ${Array(firstDay).fill('<div class="day empty"></div>').join("")}
            ${Array.from({ length: daysInMonth }, (_, i) => {
                const day = i + 1;
                const status = bookedDays.includes(day)
                    ? "booked"
                    : isDayInPast(day, month, year)
                    ? "past"
                    : "free";
                const isSelected = isDateSelected(day, month, year);
                const isInRange = isDateInRange(day, month, year);
                let classes = `day ${status}`;
                if (isSelected) classes += " selected";
                if (isInRange) classes += " in-range";
                return `<div class="${classes}" data-day="${day}">${day}</div>`;
            }).join("")}
        </div>
    `;

    // Populate calendar container
    calendarContainer.innerHTML = `
        <div class="calendar-header">
            <button id="prev-month" class="calendar-nav">&lt;</button>
            <h3>${monthNames[month]} ${year}</h3>
            <button id="next-month" class="calendar-nav">&gt;</button>
        </div>
        <div class="days-of-week">
            ${["Po", "Út", "St", "Čt", "Pá", "So", "Ne"].map(day => `<span>${day}</span>`).join("")}
        </div>
        ${daysContainer}
    `;

    // Aktualizace atributů data
    calendarContainer.dataset.month = month; // Přidá atribut data-month
    calendarContainer.dataset.year = year;  // Přidá atribut data-year

    // Add event listeners for navigation
    document.getElementById("prev-month").addEventListener("click", () => changeMonth(-1));
    document.getElementById("next-month").addEventListener("click", () => changeMonth(1));

    // Aktualizace dynamického textu na základě výběru
    const calendarText = document.getElementById("calendar-text");
    document.querySelectorAll(".day.free").forEach(dayElement => {
        dayElement.addEventListener("click", () => {
            const selectedDay = parseInt(dayElement.dataset.day, 10);
            const selectedDate = new Date(year, month, selectedDay);

            if (!config.selectedStartDate || (config.selectedStartDate && config.selectedEndDate)) {
                calendarText.textContent = "Vyberte den odjezdu";
            } else if (config.selectedStartDate && selectedDate > config.selectedStartDate) {
                calendarText.textContent = ""; // Skryje text
            }
        });
    });

    // Add event listeners to free days
    document.querySelectorAll(".day.free").forEach(dayElement => {
        dayElement.addEventListener("click", () => selectDay(dayElement, month, year));
    });
}




// Populate carousel with images
function populateCarousel(carouselId, images) {
    const carouselInner = document.querySelector(`#${carouselId} .carousel-inner`);
    if (!carouselInner) return;

    carouselInner.innerHTML = images.map((item, index) => `
        <div class="carousel-item ${index === 0 ? "active" : ""}">
            <img src="${item.image}" class="d-block w-100" alt="${item.text}">
            <div class="carousel-caption"><p>${item.text}</p></div>
        </div>
    `).join("");
}

// Initialize all carousels
function initializeCarousels() {
    populateCarousel("bathroomCarousel", galleryData.bathroom);
    populateCarousel("kitchenCarousel", galleryData.kitchen);
    populateCarousel("bedroomCarousel", galleryData.bedroom);
    populateCarousel("exteriorCarousel", galleryData.exterior);
    populateCarousel("surroundingsCarousel", galleryData.surroundings);
}


// Aktualizujeme funkci isDateSelected a isDateInRange (beze změny)
function isDateSelected(day, month, year) {
    const date = new Date(year, month, day);
    if (config.selectedStartDate && !config.selectedEndDate) {
        return date.getTime() === config.selectedStartDate.getTime();
    }
    return (
        config.selectedStartDate &&
        config.selectedEndDate &&
        (date.getTime() === config.selectedStartDate.getTime() ||
         date.getTime() === config.selectedEndDate.getTime())
    );
}

function isDateInRange(day, month, year) {
    if (config.selectedStartDate && config.selectedEndDate) {
        const date = new Date(year, month, day);
        return date > config.selectedStartDate && date < config.selectedEndDate;
    }
    return false;
}

// Funkce pro formátování data ve formátu YYYY-MM-DD
function formatDateForInput(date) {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, "0"); // Měsíce jsou indexovány od 0
    const day = date.getDate().toString().padStart(2, "0");
    return `${year}-${month}-${day}`;
}

// Upravená funkce changeMonth
async function changeMonth(direction) {
    const container = document.getElementById("calendar-container");
    let currentMonth = parseInt(container.dataset.month, 10);
    let currentYear = parseInt(container.dataset.year, 10);

    currentMonth += direction;
    if (currentMonth < 0) {
        currentMonth = 11;
        currentYear -= 1;
    } else if (currentMonth > 11) {
        currentMonth = 0;
        currentYear += 1;
    }

    await createMonthCalendar(currentMonth, currentYear);
}

// Upravená funkce selectDay
async function selectDay(dayElement, month, year) {
    const selectedDay = parseInt(dayElement.dataset.day, 10);
    const selectedDate = new Date(year, month, selectedDay);

    // Kontrola, zda je den v minulosti
    if (isDayInPast(selectedDay, month, year)) {
        alert("Nemůžete vybrat datum v minulosti.");
        return;
    }

    if (!config.selectedStartDate || (config.selectedStartDate && config.selectedEndDate)) {
        config.selectedStartDate = selectedDate;
        config.selectedEndDate = null;
    } else if (selectedDate >= config.selectedStartDate) {
        config.selectedEndDate = selectedDate;
    } else {
        config.selectedStartDate = selectedDate;
        config.selectedEndDate = null;
    }

    await createMonthCalendar(month, year); // Aktualizujeme kalendář

    // Aktualizujeme hodnoty ve formuláři
    const startDateInput = document.getElementById("selected-start-date");
    const endDateInput = document.getElementById("selected-end-date");

    if (config.selectedStartDate) {
        startDateInput.value = formatDateForInput(config.selectedStartDate);
    } else {
        startDateInput.value = "";
    }

    if (config.selectedEndDate) {
        endDateInput.value = formatDateForInput(config.selectedEndDate);
    } else {
        endDateInput.value = "";
    }

    // Zobrazíme rezervační formulář, pokud jsou obě data vybrána
    const reservationForm = document.getElementById("reservation-form");
    if (config.selectedStartDate && config.selectedEndDate) {
        reservationForm.classList.remove("hidden");
    } else {
        reservationForm.classList.add("hidden");
    }
}

// Synchronizace dat z formuláře do kalendáře (upraveno)
function setupFormListeners() {
    const startDateInput = document.getElementById("selected-start-date");
    const endDateInput = document.getElementById("selected-end-date");

    startDateInput.addEventListener("change", async () => {
        const startDate = parseInputDate(startDateInput.value);
        const today = new Date();
        today.setHours(0, 0, 0, 0); // Nastavíme čas na začátek dne

        if (startDate && startDate >= today) {
            if (!config.selectedEndDate || startDate <= config.selectedEndDate) {
                config.selectedStartDate = startDate;
            } else {
                alert("Datum příjezdu musí být dříve než datum odjezdu.");
                startDateInput.value = config.selectedStartDate
                    ? formatDateForInput(config.selectedStartDate)
                    : "";
            }
        } else {
            alert("Datum příjezdu nemůže být v minulosti.");
            startDateInput.value = config.selectedStartDate
                ? formatDateForInput(config.selectedStartDate)
                : "";
        }
        await createMonthCalendar(config.defaultMonth, config.defaultYear);
    });

    endDateInput.addEventListener("change", async () => {
        const endDate = parseInputDate(endDateInput.value);
        const today = new Date();
        today.setHours(0, 0, 0, 0); // Nastavíme čas na začátek dne

        if (endDate && endDate >= today) {
            if (!config.selectedStartDate || endDate >= config.selectedStartDate) {
                config.selectedEndDate = endDate;
            } else {
                alert("Datum odjezdu musí být později než datum příjezdu.");
                endDateInput.value = config.selectedEndDate
                    ? formatDateForInput(config.selectedEndDate)
                    : "";
            }
        } else {
            alert("Datum odjezdu nemůže být v minulosti.");
            endDateInput.value = config.selectedEndDate
                ? formatDateForInput(config.selectedEndDate)
                : "";
        }
        await createMonthCalendar(config.defaultMonth, config.defaultYear);
    });
}


// Funkce pro parsování data z inputu
function parseInputDate(dateString) {
    const [year, month, day] = dateString.split("-").map(num => parseInt(num, 10));
    if (!isNaN(day) && !isNaN(month) && !isNaN(year)) {
        return new Date(year, month - 1, day);
    }
    return null;
}

// Inicializace stránky
document.addEventListener("DOMContentLoaded", async () => {
    initializeCarousels();
    await createMonthCalendar(config.defaultMonth, config.defaultYear);
    setupFormListeners();
    setMinDateForInputs(); // Přidáno

    // Ujistíme se, že formulář je skrytý při načtení stránky
    const reservationForm = document.getElementById("reservation-form");
    reservationForm.classList.add("hidden");

    const reservationFormElement = document.getElementById("reservationForm");
    reservationFormElement?.addEventListener("submit", event => {
        event.preventDefault();
        config.selectedStartDate = null;
        config.selectedEndDate = null;
        createMonthCalendar(config.defaultMonth, config.defaultYear);
        document.getElementById("reservation-form").style.display = "none";
        setMinDateForInputs(); // Resetujeme min data po odeslání
    });

    // Warte, bis alle Bilder geladen sind
    await imagesLoaded();
    adjustSectionHeights();
});

// Funktion, die zurückgibt, wenn alle Bilder geladen sind
function imagesLoaded() {
    return new Promise((resolve) => {
        const images = document.querySelectorAll('.carousel-image');
        let loadedCount = 0;
        const totalImages = images.length;

        images.forEach((img) => {
            if (img.complete) {
                loadedCount++;
                if (loadedCount === totalImages) {
                    resolve();
                }
            } else {
                img.addEventListener('load', () => {
                    loadedCount++;
                    if (loadedCount === totalImages) {
                        resolve();
                    }
                });
            }
        });

        // Falls es keine Bilder gibt
        if (totalImages === 0) {
            resolve();
        }
    });
}

// Funktion, die zurückgibt, wenn alle Bilder geladen sind
function imagesLoaded() {
    return new Promise((resolve) => {
        const images = document.querySelectorAll('.carousel-image');
        let loadedCount = 0;
        const totalImages = images.length;

        images.forEach((img) => {
            if (img.complete) {
                loadedCount++;
                if (loadedCount === totalImages) {
                    resolve();
                }
            } else {
                img.addEventListener('load', () => {
                    loadedCount++;
                    if (loadedCount === totalImages) {
                        resolve();
                    }
                });
            }
        });

        // Pokud nejsou žádné obrázky
        if (totalImages === 0) {
            resolve();
        }
    });
}

// Nová, sloučená a upravená verze adjustSectionHeights():
function adjustSectionHeights() {
    const images = document.querySelectorAll('.carousel-image');
    let tallestHeight = 0;

    images.forEach((img) => {
        if (img.src.endsWith('.jpeg') || img.src.endsWith('.jpg')) {
            const imgHeight = img.naturalHeight;
            if (imgHeight > tallestHeight) {
                tallestHeight = imgHeight;
            }
        }
    });

    const sections = document.querySelectorAll('#gallery > section.container.mt-5');

    sections.forEach(section => {
        const title = section.querySelector('h3');
        const carouselInner = section.querySelector('.carousel-inner');
        let totalHeight = 0;

        if (title) {
            totalHeight += title.offsetHeight || 0;
        }

        if (carouselInner) {
            const activeSlide = carouselInner.querySelector('.carousel-item.active');
            if (activeSlide) {
                const img = activeSlide.querySelector('img');
                const caption = activeSlide.querySelector('.carousel-caption');
                const source = caption?.querySelector('.carousel-source');

                if (img) {
                    totalHeight += img.clientHeight || 0;
                }
                if (caption) {
                    totalHeight += caption.scrollHeight || 0;
                }
                if (source) {
                    totalHeight += source.scrollHeight || 0;
                }
            }
        }

        // Porovnáme s tallestHeight, pokud ho chcete používat:
        let finalHeight = Math.max(totalHeight, tallestHeight);

        if (finalHeight > 0) {
            section.style.height = `${finalHeight}px`;
            if (carouselInner) {
                carouselInner.style.height = `${finalHeight}px`;
            }
        }
    });
}

document.getElementById('reservationForm').addEventListener('submit', async function(event) {
    event.preventDefault();

    // Collect form data
    const startDate = document.getElementById('selected-start-date').value;
    const endDate = document.getElementById('selected-end-date').value;
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const phone = document.getElementById('phone').value;
    const message = document.getElementById('message').value;

    // Validate inputs
    if (!startDate || !endDate || !name || !email || !phone) {
        alert('Vyplňte všechna povinná pole.');
        return;
    }

    try {
        // Send data to the backend
        const response = await fetch('http://localhost:3000/api/reservations', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                startDate,
                endDate,
                name,
                email,
                phone,
                message,
            }),
        });

        const result = await response.json();

        if (response.ok) {
            alert('Rezervace přijata. Potvrzení pošleme emailem.');
            // Reset form and update calendar
            try {
                const month = config.defaultMonth + 1; // if config.defaultMonth is 0-based
                const year = config.defaultYear;
                
                const responseBookedDays = await fetch(`http://localhost:3000/api/reservations/${year}/${month}`);
                const blockedDays = await responseBookedDays.json();

            } catch (error) {
                console.error('Error re-fetching booked days:', error);
            }
        
            config.selectedStartDate = null;
            config.selectedEndDate = null;
            await createMonthCalendar(config.defaultMonth, config.defaultYear);


            document.getElementById('reservation-form').classList.add('hidden');
            setMinDateForInputs();
        } else {
            alert(`Chyba: ${result.error}`);
        }
    } catch (error) {
        console.error('Chyba při odesílání rezervace:', error);
        alert('Chyba při odesílání rezervace. Zkuste to prosím znovu.');
    }
});


// Event listenery na konci
window.addEventListener('load', () => {
    // Počkejte na načtení obrázků, pak zavolejte adjustSectionHeights()
    imagesLoaded().then(() => {
        setTimeout(adjustSectionHeights, 100);
    });
});

window.addEventListener('resize', adjustSectionHeights);


document.getElementById('reservationForm').addEventListener('submit', async function(event) {
    event.preventDefault();

    // Získání hodnot vstupních polí
    const emailInput = document.getElementById('email');
    const phoneInput = document.getElementById('phone');

    // Regulární výrazy pro validaci
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phonePattern = /^(\+420\s?)?(\d{3}\s?\d{3}\s?\d{3})$/;

    // Validace e-mailu
    if (!emailPattern.test(emailInput.value)) {
        alert('Prosím, zadejte platnou emailovou adresu.');
        emailInput.focus();
        return;
    }

    // Validace telefonního čísla
    if (!phonePattern.test(phoneInput.value)) {
        alert('Prosím, zadejte platné telefonní číslo ve formátu +420 123 456 789 nebo 123456789.');
        phoneInput.focus();
        return;
    }

    // Pokud je vše v pořádku, pokračujeme s odesláním formuláře
    alert('Rezervace odeslána!');
    config.selectedStartDate = null;
    config.selectedEndDate = null;
    await createMonthCalendar(config.defaultMonth, config.defaultYear);
    document.getElementById('reservation-form').classList.add('hidden');
    setMinDateForInputs();
});



// Dynamically populate the surroundings carousel
function populateSurroundingsCarousel() {
    const carouselInner = document.querySelector('#surroundingsCarousel .carousel-inner');
    surroundingsGallery.forEach((item, index) => {
        const carouselItem = document.createElement('div');
        carouselItem.className = 'carousel-item' + (index === 0 ? ' active' : '');

        // Image
        const img = document.createElement('img');
        img.src = item.image;
        img.alt = item.text;
        img.className = 'd-block w-100';
        carouselItem.appendChild(img);

        // Caption container
        const caption = document.createElement('div');
        caption.className = 'carousel-caption';

        // Text
        const text = document.createElement('p');
        text.textContent = item.text;
        caption.appendChild(text);

        // Source link
        if (item.source) {
            const sourceLink = document.createElement('a');
            sourceLink.href = item.source;
            sourceLink.textContent = 'Zdroj';
            sourceLink.target = '_blank';
            caption.appendChild(sourceLink);
        }

        carouselItem.appendChild(caption);
        carouselInner.appendChild(carouselItem);
    });
}


// Spuštění po načtení obsahu a změně velikosti okna
window.addEventListener('load', () => {
    setTimeout(adjustSectionHeights, 100); // Počkejte na načtení obrázků a karuselu
});
window.addEventListener('resize', adjustSectionHeights);
