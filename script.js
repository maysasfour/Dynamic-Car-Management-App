let cars = [];
let language = 'en'; 
window.onload = function() {
    loadCarsFromLocalStorage();
    displayCars();
    populateMakes();
};

fetch('car_data.json')
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        cars = data;
        console.log("Fetched car data:", cars);
        displayCars();
        populateMakes();
    })
    .catch(error => {
        console.error('Error loading car data:', error);
        alert('Failed to load car data. Please check the console for details.');
    });

function validateYear(year) {
    const currentYear = new Date().getFullYear();
    return !isNaN(year) && year >= 1900 && year <= currentYear;
}

function validatePrice(price) {
    const numericPrice = parseFloat(price.replace('$', '').trim());
    return !isNaN(numericPrice) && numericPrice > 0;
}

function formatPrice(price) {
    const numericPrice = parseFloat(price.replace('$', '').trim());
    if (!isNaN(numericPrice) && numericPrice > 0) {
        return `$${numericPrice.toFixed(2)}`;
    }
    return '';
}
function displayCars() {
    const carList = document.getElementById("car-list");
    carList.innerHTML = '';
    if (cars.length === 0) {
        carList.innerHTML = `<p>${language === 'en' ? 'No cars available.' : 'لا توجد سيارات متاحة.'}</p>`;
        return;
    }

    cars.forEach(car => {
        const carCard = document.createElement("div");
        carCard.classList.add("car-card");

        const carCardInner = document.createElement("div");
        carCardInner.classList.add("car-card-inner");

        const carCardFront = document.createElement("div");
        carCardFront.classList.add("car-card-front");

        const carCardBack = document.createElement("div");
        carCardBack.classList.add("car-card-back");

        const carInfoFront = `
            <h2>${language === 'en' ? car.make : car.make_ar || car.make} ${language === 'en' ? car.model : car.model_ar || car.model}</h2>
            <p>${language === 'en' ? 'Year' : 'السنة'}: ${car.year}</p>
            <p>${language === 'en' ? 'Price' : 'السعر'}: ${car.price}</p>
        `;
        const carInfoBack = `
            <h2>${language === 'en' ? 'Delete' : 'حذف'}</h2>
            <button class="delete-btn">${language === 'en' ? 'Delete' : 'حذف'}</button>
        `;

        carCardFront.innerHTML = carInfoFront;
        carCardBack.innerHTML = carInfoBack;

        carCardInner.appendChild(carCardFront);
        carCardInner.appendChild(carCardBack);
        carCard.appendChild(carCardInner);
        carList.appendChild(carCard);
        carCardBack.querySelector('.delete-btn').addEventListener('click', () => {
            deleteCar(car.make);
        });
    });
}

function saveCarsToLocalStorage() {
    localStorage.setItem("cars", JSON.stringify(cars));
}

function loadCarsFromLocalStorage() {
    const storedCars = localStorage.getItem("cars");
    if (storedCars) {
        cars = JSON.parse(storedCars);
    }
}

document.getElementById("car-form").addEventListener("submit", function (event) {
    event.preventDefault();

    const make = document.getElementById("make").value;
    const model = document.getElementById("model").value;
    const year = document.getElementById("year").value;
    let price = document.getElementById("price").value;

    if (!validateYear(year)) {
        alert(language === 'en' ? 'Please enter a valid year.' : 'من فضلك أدخل سنة صحيحة.');
        return;
    }

    if (!validatePrice(price)) {
        alert(language === 'en' ? 'Please enter a valid price.' : 'من فضلك أدخل سعر صحيح.');
        return;
    }

    price = formatPrice(price); 

    const newCar = {
        make: make,
        model: model,
        year: year,
        price: price
    };

    cars.unshift(newCar);
    saveCarsToLocalStorage();
    displayCars();
    populateMakes();
});

function populateMakes() {
    const makeSelect = document.getElementById("make");

    const uniqueMakes = [...new Set(cars.map(car => car.make))];

    console.log("Unique makes:", uniqueMakes);
    makeSelect.innerHTML = `<option value="" disabled selected>${language === 'en' ? 'Select a make' : 'اختر الماركة'}</option>`;
    uniqueMakes.forEach(make => {
        const option = document.createElement("option");
        option.value = make;
        option.textContent = make;
        makeSelect.appendChild(option);
    });
    makeSelect.addEventListener("change", function () {
        populateModels(makeSelect.value);
    });
    if (uniqueMakes.length > 0) {
        populateModels(uniqueMakes[0]);
    } else {
        document.getElementById("model").innerHTML = `<option value="" disabled selected>${language === 'en' ? 'No models available' : 'لا توجد موديلات متاحة'}</option>`;
    }
}

function populateModels(make) {
    const modelSelect = document.getElementById("model");
    modelSelect.innerHTML = `<option value="" disabled selected>${language === 'en' ? 'Select a model' : 'اختر الموديل'}</option>`;

    const models = cars.filter(car => car.make === make).map(car => car.model);

    console.log(models);

    const uniqueModels = [...new Set(models)];

    uniqueModels.forEach(model => {
        const option = document.createElement("option");
        option.value = model;
        option.textContent = model;
        modelSelect.appendChild(option);
    });
}

function deleteCar(make) {
    cars = cars.filter(car => car.make !== make);
    saveCarsToLocalStorage();
    displayCars();
    populateMakes();
}

document.getElementById("toggleLanguage").addEventListener("click", function () {
    language = language === 'en' ? 'ar' : 'en';
    displayCars();
    populateMakes();
    populateModels(document.getElementById("make").value);
    updateFormLabels();
    const currentDirection = document.documentElement.getAttribute("dir");
    document.documentElement.setAttribute("dir", currentDirection === "ltr" ? "rtl" : "ltr");
});

function updateFormLabels() {
    const makeLabel = document.querySelector("label[for='make']");
    const modelLabel = document.querySelector("label[for='model']");
    const yearLabel = document.querySelector("label[for='year']");
    const priceLabel = document.querySelector("label[for='price']");
    const addCarButton = document.getElementById("add-car-btn");

    makeLabel.textContent = language === 'en' ? 'Make' : 'الماركة';
    modelLabel.textContent = language === 'en' ? 'Model' : 'الموديل';
    yearLabel.textContent = language === 'en' ? 'Year' : 'السنة';
    priceLabel.textContent = language === 'en' ? 'Price' : 'السعر';
    addCarButton.textContent = language === 'en' ? 'Add Car' : 'إضافة سيارة';

    document.getElementById("year").placeholder = language === 'en' ? 'Year' : 'السنة';
    document.getElementById("price").placeholder = language === 'en' ? 'Price' : 'السعر';
}

document.getElementById("toggleDirection").addEventListener("click", function() {
    const currentDirection = document.documentElement.getAttribute("dir");
    document.documentElement.setAttribute("dir", currentDirection === "ltr" ? "rtl" : "ltr");
});
