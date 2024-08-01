let currentStep = 1;
let productCount = 1;

document.getElementById('order-city').addEventListener('input', validateOrderCity);
document.getElementById('order-date').addEventListener('input', validateOrderDate);

// Inicializar el primer producto
document.getElementById('product-1')?.addEventListener('input', validateProducts);

function validateOrderCity() {
    const orderCityInput = document.getElementById('order-city');
    const orderCityError = document.getElementById('order-city-error');
    if (orderCityInput.value.trim() === '') {
        orderCityError.style.display = 'block';
        document.getElementById('next-button').disabled = true;
    } else {
        orderCityError.style.display = 'none';
        document.getElementById('next-button').disabled = false;
    }
}

function validateProducts() {
    const productInputs = document.querySelectorAll('input[id^="product-"]');
    const productError = document.getElementById('product-error');
    let allValid = true;

    productInputs.forEach(input => {
        if (input.value.trim() === '') {
            allValid = false;
        }
    });

    if (!allValid) {
        productError.style.display = 'block';
        document.getElementById('next-button').disabled = true;
    } else {
        productError.style.display = 'none';
        document.getElementById('next-button').disabled = false;
    }
}

function validateOrderDate() {
    const orderDateInput = document.getElementById('order-date');
    const orderDateError = document.getElementById('order-date-error');
    if (orderDateInput.value.trim() === '') {
        orderDateError.style.display = 'block';
        document.getElementById('next-button').disabled = true;
    } else {
        orderDateError.style.display = 'none';
        document.getElementById('next-button').disabled = false;
    }
}

function addProduct() {
    productCount++;
    const productsDiv = document.getElementById('products');
    const newProductDiv = document.createElement('div');
    newProductDiv.classList.add('product-item');
    newProductDiv.innerHTML = `
        <label for="product-${productCount}">Producto ${productCount}:</label>
        <input type="text" class="text" id="product-${productCount}" placeholder="Nombre del producto" required>
    `;
    productsDiv.appendChild(newProductDiv);

    // Agregar el listener de input al nuevo producto
    document.getElementById(`product-${productCount}`).addEventListener('input', validateProducts);
}

function nextStep() {
    const currentStepDiv = document.getElementById(`step-${currentStep}`);
    const nextStepDiv = document.getElementById(`step-${currentStep + 1}`);

    if (currentStep === 1 && !validateOrderCity()) {
        return;
    }
    if (currentStep === 2 && !validateProducts()) {
        return;
    }
    if (currentStep === 3 && !validateOrderDate()) {
        return;
    }

    if (nextStepDiv) {
        currentStepDiv.style.display = 'none';
        nextStepDiv.style.display = 'block';
        currentStep++;
        updateButtonState();
    }

    if (currentStep === 5) {
        submitOrder();
    }
}

function prevStep() {
    if (currentStep > 1) {
        const currentStepDiv = document.getElementById(`step-${currentStep}`);
        const prevStepDiv = document.getElementById(`step-${currentStep - 1}`);
        currentStepDiv.style.display = 'none';
        prevStepDiv.style.display = 'block';
        currentStep--;
        updateButtonState();
    }
}

function updateButtonState() {
    const nextButton = document.getElementById('next-button');
    const prevButton = document.querySelector('.back-button');

    if (currentStep === 1) {
        prevButton.style.display = 'none';
    } else {
        prevButton.style.display = 'block';
    }

    if (currentStep === 5) {
        nextButton.style.display = 'none';
    } else {
        nextButton.style.display = 'block';
        validateCurrentStep();
    }
}

function validateCurrentStep() {
    if (currentStep === 1) {
        validateOrderCity();
    } else if (currentStep === 2) {
        validateProducts();
    } else if (currentStep === 3) {
        validateOrderDate();
    } else {
        document.getElementById('next-button').disabled = false;
    }
}

function submitOrder() {
    const orderCity = document.getElementById('order-city').value.trim();
    const products = [];
    const productInputs = document.querySelectorAll('input[id^="product-"]');
    productInputs.forEach(input => products.push(input.value.trim()));
    const orderDate = document.getElementById('order-date').value.trim();
    const comments = document.getElementById('comments').value.trim();

    const orderData = {
        orderCity,
        products,
        orderDate,
        comments
    };

    fetch('https://paso-app.ticsevn.com/new_order.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${getCookie('token')}`
        },
        body: JSON.stringify(orderData)
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            console.log('Order submitted successfully');
            window.location.href = 'thank_you.html'; // Redirigir a la página de agradecimiento
        } else {
            console.error('Error submitting order', data.message);
        }
    })
    .catch(error => console.error('Error:', error));
}

function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
}
