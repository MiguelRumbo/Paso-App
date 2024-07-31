document.getElementById('login-form').addEventListener('submit', async function(event) {
    event.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
        const response = await fetch('https://paso-app.ticsevn.com/login.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();

        if (data.error) {
            alert(data.error);
        } else {
            // Almacenar el ID de usuario en localStorage
            localStorage.setItem('user_id', data.user_id);
            window.location.href = 'dashboard.html';
        }
    } catch (error) {
        console.error('Error al iniciar sesión:', error);
    }
});
