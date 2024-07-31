document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');

    loginForm.addEventListener('submit', async (event) => {
        event.preventDefault(); // Evita el envío del formulario

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

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const data = await response.json();

            if (data.error) {
                alert(data.error); // Muestra el error si ocurre
            } else {
                // Crear una cookie que expire en 30 días
                document.cookie = `user_id=${data.user_id}; path=/; max-age=${30 * 24 * 60 * 60}`; // 30 días

                // Redirigir al dashboard o a la página deseada
                window.location.href = 'dashboard.html';
            }
        } catch (error) {
            console.error('Error al iniciar sesión:', error);
        }
    });
});
