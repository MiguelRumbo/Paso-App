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
            // Guardar el ID de usuario y correo electrónico en localStorage
            localStorage.setItem('user_id', data.user_id);
            localStorage.setItem('email', email);

            // Simular la creación de un archivo de texto
            const blob = new Blob([data.user_id], { type: 'text/plain' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'credentials.txt';
            a.click();
            URL.revokeObjectURL(url);

            window.location.href = 'dashboard.html';
        }
    } catch (error) {
        console.error('Error al iniciar sesión:', error);
    }
});
