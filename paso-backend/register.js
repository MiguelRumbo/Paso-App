// Guardar correo en localStorage y redirigir
function saveEmail() {
    const email = document.getElementById('email').value;
    localStorage.setItem('email', email);
    window.location.href = 'register_password.html';
}

// Guardar contraseña en localStorage y redirigir
function savePassword() {
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirm-password').value;

    if (password === confirmPassword) {
        localStorage.setItem('password', password);
        window.location.href = 'register_profile.html';
    } else {
        document.getElementById('error-message').style.display = 'block';
    }
}

// Function to handle form submission
async function submitProfile(event) {
    event.preventDefault();
    
    const form = event.target;
    const data = {
        email: localStorage.getItem('email'), // Assuming email is stored in localStorage
        password: localStorage.getItem('password'), // Assuming password is stored in localStorage
        full_name: form.querySelector('#full-name').value,
        age: form.querySelector('#age').value,
        birthdate: form.querySelector('#birthdate').value,
        gender: form.querySelector('#gender').value
    };

    try {
        const response = await fetch('https://paso-app.ticsevn.com/register.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const result = await response.json();
        console.log(result);

        if (result.error) {
            alert(`Error: ${result.error}`);
        } else {
            alert(result.message);
            window.location.href = 'login.html';
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

// Add event listener to the form
document.getElementById('registration-form').addEventListener('submit', submitProfile);