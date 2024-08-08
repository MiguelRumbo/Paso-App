let currentStep = 1;

document.getElementById('order-city').addEventListener('input', function () {
    validateOrderCity();
});

function validateOrderCity() {
    const orderCityInput = document.getElementById('order-city');
    const orderCityError = document.getElementById('order-city-error');
    const nextButton = document.getElementById('next-button');

    if (orderCityInput.value.trim() === '') {
        orderCityError.style.display = 'block';
        nextButton.disabled = true;
        nextButton.classList.add('disabled');
        return false;
    } else {
        orderCityError.style.display = 'none';
        nextButton.disabled = false;
        nextButton.classList.remove('disabled');
        return true;
    }
}

function nextStep() {
    if (currentStep === 1) {
        if (validateOrderCity()) {
            currentStep++;
            showStep(currentStep);
        }
    } else if (currentStep === 2) {
        if (validateProducts()) {
            currentStep++;
            showStep(currentStep);
        }
    } else if (currentStep === 3) {
        currentStep++;
        showStep(currentStep);
        updateSummary();
    } else if (currentStep === 4) {
        currentStep++;
        showStep(currentStep);
        submitOrder();
    }
}

function prevStep() {
    if (currentStep > 1) {
        currentStep--;
        showStep(currentStep);
    }
}

function showStep(step) {
    const steps = document.querySelectorAll('.container > div');
    steps.forEach((stepElement, index) => {
        stepElement.style.display = index === step - 1 ? 'block' : 'none';
    });

    const backButton = document.querySelector('.back-button');
    backButton.style.display = step === 1 ? 'none' : 'block';

    const nextButton = document.getElementById('next-button');
    nextButton.style.display = step === 5 ? 'none' : 'block';
}

function validateProducts() {
    const productQuantities = document.querySelectorAll('.product-quantity');
    const productError = document.getElementById('product-error');
    let isValid = false;

    productQuantities.forEach(quantity => {
        if (parseInt(quantity.textContent) > 0) {
            isValid = true;
        }
    });

    productError.style.display = isValid ? 'none' : 'block';
    return isValid;
}

function updateSummary() {
    const summaryContainer = document.querySelector('.summary');
    const orderCity = document.getElementById('order-city').value;
    const comments = document.getElementById('comments').value;
    const productItems = document.querySelectorAll('.product-item');

    let summaryHtml = `<p>Ciudad de Pedido: ${orderCity}</p>`;
    summaryHtml += '<h3>Productos:</h3><ul>';

    let subtotal = 0;
    const deliveryRate = 0.10;  // 10% del subtotal
    const appFeeRate = 0.10;    // 10% del total (productos + costo de entrega)

    productItems.forEach(item => {
        const quantity = parseInt(item.querySelector('.product-quantity').textContent);
        if (quantity > 0) {
            const productName = item.querySelector('h3').textContent;
            const productPrice = parseFloat(item.getAttribute('data-price'));
            const productSubtotal = quantity * productPrice;
            subtotal += productSubtotal;

            summaryHtml += `<li>${productName}: ${quantity} x $${productPrice.toFixed(2)} = $${productSubtotal.toFixed(2)}</li>`;
        }
    });

    const deliveryCost = subtotal * deliveryRate;
    const totalBeforeAppFee = subtotal + deliveryCost;
    const appFee = totalBeforeAppFee * appFeeRate;
    const total = totalBeforeAppFee + appFee;

    summaryHtml += '</ul>';
    summaryHtml += `<p>Subtotal: $${subtotal.toFixed(2)}</p>`;
    summaryHtml += `<p>Coste de entrega (10%): $${deliveryCost.toFixed(2)}</p>`;
    summaryHtml += `<p>Coste por uso de la aplicación (10%): $${appFee.toFixed(2)}</p>`;
    summaryHtml += `<p>Total: $${total.toFixed(2)}</p>`;
    summaryHtml += `<p>Comentarios: ${comments}</p>`;

    summaryContainer.innerHTML = summaryHtml;
}

function submitOrder() {
    const orderCity = document.getElementById('order-city').value;
    const comments = document.getElementById('comments').value;
    const productItems = document.querySelectorAll('.product-item');
    const userToken = getCookie('Authorization');  // Obtiene el token del usuario de las cookies

    let products = [];

    productItems.forEach(item => {
        const quantity = parseInt(item.querySelector('.product-quantity').textContent);
        if (quantity > 0) {
            const productName = item.querySelector('h3').textContent;
            const productPrice = parseFloat(item.getAttribute('data-price'));
            products.push({
                name: productName,
                quantity: quantity,
                price: productPrice
            });
        }
    });

    const orderData = {
        order_city: orderCity,
        comments: comments,
        products: products
    };

    fetch('https://paso-app.ticsevn.com/new_order.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${userToken}`
        },
        body: JSON.stringify(orderData),
        credentials: 'include'
    })
    .then(response => {
        if (!response.ok) {
            return response.text().then(text => {
                throw new Error(`Error: ${text}`);
            });
        }
        return response.json();
    })
    .then(data => {
        if (data.error) {
            alert(`Error: ${data.error}`);
        } else {
            alert('Pedido registrado correctamente');
        }
    })
    .catch(error => {
        console.error('Error:', error);
    });
}

function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
}

document.addEventListener('DOMContentLoaded', function () {
    const productGrid = document.querySelector('.product-grid');
    const products = [
        { name: 'Producto 1', price: 10.00, image: '../icons/Logo.svg' },
        { name: 'Producto 2', price: 15.00, image: '../icons/Logo.svg' },
        { name: 'Producto 3', price: 20.00, image: '../icons/Logo.svg' },
        { name: 'Producto 4', price: 25.00, image: '../icons/Logo.svg' }
    ];

    products.forEach(product => {
        const productItem = document.createElement('div');
        productItem.classList.add('product-item');
        productItem.setAttribute('data-price', product.price);
        productItem.innerHTML = `
            <img src="${product.image}" alt="${product.name}">
            <h3>${product.name}</h3>
            <p>$${product.price.toFixed(2)}</p>
            <div class="counter">
                <button onclick="decreaseQuantity(event, this)">-</button>
                <span class="product-quantity">0</span>
                <button onclick="increaseQuantity(event, this)">+</button>
            </div>
        `;
        productGrid.appendChild(productItem);
    });

    showStep(currentStep);
});

function decreaseQuantity(event, button) {
    event.preventDefault();
    const quantitySpan = button.nextElementSibling;
    let quantity = parseInt(quantitySpan.textContent);
    if (quantity > 0) {
        quantity--;
        quantitySpan.textContent = quantity;
    }
}

function increaseQuantity(event, button) {
    event.preventDefault();
    const quantitySpan = button.previousElementSibling;
    let quantity = parseInt(quantitySpan.textContent);
    quantity++;
    quantitySpan.textContent = quantity;
}
