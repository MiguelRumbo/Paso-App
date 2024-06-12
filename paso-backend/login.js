// Function to handle form submission
async function submitLogin(event) {
    event.preventDefault();
    
    const form = event.target;
    const data = {
        email: form.querySelector('#email').value,
        password: form.querySelector('#password').value
    };

    try {
        const response = await fetch('https://paso-app.ticsevn.com/login.php', {
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

        if (result.error) {
            document.getElementById('error-message').textContent = result.error;
            document.getElementById('error-message').style.display = 'block';
        } else {
            // Redirigir a la página principal después del inicio de sesión exitoso
            window.location.href = 'dashboard.html';
        }
    } catch (error) {
        console.error('Error:', error);
        document.getElementById('error-message').textContent = 'Error de conexión. Inténtelo de nuevo más tarde.';
        document.getElementById('error-message').style.display = 'block';
    }
}

// Add event listener to the form
document.getElementById('login-form').addEventListener('submit', submitLogin);
