let currentStep = 1;

document.getElementById('departure-city').addEventListener('input', function () {
    validateDepartureCity();
});

document.getElementById('destination').addEventListener('input', function () {
    validateDestination();
});

document.getElementById('departure-date').addEventListener('input', function () {
    validateDepartureDate();
});

document.getElementById('return-date').addEventListener('input', function () {
    validateReturnDate();
});

function validateDepartureCity() {
    const departureCityInput = document.getElementById('departure-city');
    const departureCityError = document.getElementById('departure-city-error');
    const nextButton = document.getElementById('next-button');
    const validOptions = Array.from(document.querySelectorAll('#cities option')).map(option => option.value);

    if (departureCityInput.value.trim() === "" || !validOptions.includes(departureCityInput.value)) {
        departureCityError.style.display = 'block';
        nextButton.disabled = true;
        nextButton.classList.add('disabled');
        return false;
    } else {
        departureCityError.style.display = 'none';
        nextButton.disabled = false;
        nextButton.classList.remove('disabled');
        return true;
    }
}

function validateDestination() {
    const destinationInput = document.getElementById('destination');
    const destinationError = document.getElementById('destination-error');
    const nextButton = document.getElementById('next-button');
    const validOptions = Array.from(document.querySelectorAll('#cities option')).map(option => option.value);

    if (destinationInput.value.trim() === "" || !validOptions.includes(destinationInput.value)) {
        destinationError.style.display = 'block';
        nextButton.disabled = true;
        nextButton.classList.add('disabled');
        return false;
    } else {
        destinationError.style.display = 'none';
        nextButton.disabled = false;
        nextButton.classList.remove('disabled');
        return true;
    }
}

function validateDepartureDate() {
    const departureDateInput = document.getElementById('departure-date');
    const departureDateError = document.getElementById('departure-date-error');
    const currentDate = new Date().toISOString().split('T')[0];

    if (departureDateInput.value === "" || departureDateInput.value < currentDate) {
        departureDateError.style.display = 'block';
        return false;
    } else {
        departureDateError.style.display = 'none';
        return true;
    }
}

function validateReturnDate() {
    const departureDateInput = document.getElementById('departure-date');
    const returnDateInput = document.getElementById('return-date');
    const returnDateError = document.getElementById('return-date-error');

    if (returnDateInput.value === "" || returnDateInput.value < departureDateInput.value) {
        returnDateError.style.display = 'block';
        return false;
    } else {
        returnDateError.style.display = 'none';
        return true;
    }
}

function nextStep() {
    if (!validateCurrentStep()) return;

    document.getElementById(`step-${currentStep}`).style.display = 'none';
    currentStep++;

    if (currentStep <= 6) {
        document.getElementById(`step-${currentStep}`).style.display = 'block';
    }

    if (currentStep === 6) {
        document.getElementById('next-button').style.display = 'none';
        submitTravelData();
    }
}

function prevStep() {
    if (currentStep === 1) return;

    document.getElementById(`step-${currentStep}`).style.display = 'none';
    currentStep--;

    document.getElementById(`step-${currentStep}`).style.display = 'block';
    document.getElementById('next-button').style.display = 'block';
}

function changeCount(type, delta) {
    const input = document.getElementById(`${type}-containers`);
    const newValue = parseInt(input.value) + delta;
    if (newValue >= 0) {
        input.value = newValue;
    }
}

function validateCurrentStep() {
    switch (currentStep) {
        case 1:
            return validateDepartureCity();
        case 2:
            return validateDestination();
        case 3:
            return validateDepartureDate() && validateReturnDate();
        default:
            return true;
    }
}

function submitTravelData() {
    const headers = new Headers({
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Bearer ${getCookie('user_id')}`
    });

    const formData = new URLSearchParams({
        'departure-city': document.getElementById('departure-city').value,
        'destination': document.getElementById('destination').value,
        'departure-date': document.getElementById('departure-date').value,
        'return-date': document.getElementById('return-date').value,
        'cold-containers': document.getElementById('cold-containers').value,
        'hot-containers': document.getElementById('hot-containers').value,
        'comments': document.getElementById('comments').value
    });

    fetch('https://paso-app.ticsevn.com/new_travel.php', {
        method: 'POST',
        headers: headers,
        body: formData
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            if (data.success) {
                alert(data.success);
                // Aquí puedes añadir lógica para redirigir o mostrar la ventana de gracias
            } else {
                throw new Error(data.error);
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Hubo un problema con la solicitud. Verifica la consola para más detalles.');
        });
}


function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
}
