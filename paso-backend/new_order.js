let currentStep = 1;
let productCount = 1;

document.getElementById('order-city').addEventListener('input', function () {
    validateOrderCity();
});

document.getElementById('product-1').addEventListener('input', function () {
    validateProducts();
});

document.getElementById('order-date').addEventListener('input', function () {
    validateOrderDate();
});

function validateOrderCity() {
    const orderCityInput = document.getElementById('order-city');
    const orderCityError = document.getElementById('order-city-error');
    const nextButton = document.getElementById('next-button');
    const validOptions = Array.from(document.querySelectorAll('#cities option')).map(option => option.value);

    if (orderCityInput.value.trim() === '' || !validOptions.includes(orderCityInput.value.trim())) {
        orderCityError.style.display = 'block';
        nextButton.disabled = true;
    } else {
        orderCityError.style.display = 'none';
        nextButton.disabled = false;
    }
}

function validateProducts() {
    const productInputs = document.querySelectorAll('#products input[type="text"]');
    const productError = document.getElementById('product-error');
    const nextButton = document.getElementById('next-button');

    const valid = Array.from(productInputs).every(input => input.value.trim() !== '');

    if (valid) {
        productError.style.display = 'none';
        nextButton.disabled = false;
    } else {
        productError.style.display = 'block';
        nextButton.disabled = true;
    }
}

function validateOrderDate() {
    const orderDateInput = document.getElementById('order-date');
    const orderDateError = document.getElementById('order-date-error');
    const nextButton = document.getElementById('next-button');

    if (orderDateInput.value === '') {
        orderDateError.style.display = 'block';
        nextButton.disabled = true;
    } else {
        orderDateError.style.display = 'none';
        nextButton.disabled = false;
    }
}

function prevStep() {
    if (currentStep > 1) {
        currentStep--;
        showStep(currentStep);
    }
}

function nextStep() {
    if (currentStep < 5) {
        currentStep++;
        showStep(currentStep);
    }
    if (currentStep === 5) {
        sendOrderData();
    }
}

function showStep(step) {
    const steps = document.querySelectorAll('.container > div');
    steps.forEach((stepDiv, index) => {
        stepDiv.style.display = (index + 1 === step) ? 'block' : 'none';
    });

    if (step === 1) {
        validateOrderCity();
    } else if (step === 2) {
        validateProducts();
    } else if (step === 3) {
        validateOrderDate();
    } else {
        document.getElementById('next-button').disabled = false;
    }
}

function addProduct() {
    productCount++;
    const productContainer = document.getElementById('products');
    const newProductDiv = document.createElement('div');
    newProductDiv.classList.add('product-item');
    newProductDiv.innerHTML = `
        <label for="product-${productCount}">Producto ${productCount}:</label>
        <input type="text" class="text" id="product-${productCount}" placeholder="Nombre del producto" required>
    `;
    productContainer.appendChild(newProductDiv);

    document.getElementById(`product-${productCount}`).addEventListener('input', validateProducts);
}

function sendOrderData() {
    const productInputs = document.querySelectorAll('#products input[type="text"]');
    const productNames = Array.from(productInputs).map(input => input.value.trim());

    const data = {
        order_city: document.getElementById('order-city').value.trim(),
        products: productNames,
        order_date: document.getElementById('order-date').value,
        comments: document.getElementById('comments').value.trim()
    };

    fetch('https://paso-app.ticsevn.com/new_order.php', {
        method: 'POST',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + getCookie('token')
        },
        body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(data => {
        console.log(data);
        if (data.success) {
            window.location.href = 'thank_you.html';
        } else {
            alert('Error al enviar el pedido: ' + data.message);
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Error al enviar el pedido: ' + error.message);
    });
}

function getCookie(name) {
    let cookieArr = document.cookie.split(";");
    for (let i = 0; i < cookieArr.length; i++) {
        let cookiePair = cookieArr[i].split("=");
        if (name == cookiePair[0].trim()) {
            return decodeURIComponent(cookiePair[1]);
        }
    }
    return null;
}
