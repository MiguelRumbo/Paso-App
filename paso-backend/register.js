document.addEventListener('DOMContentLoaded', () => {
    const emailForm = document.getElementById('email-form');
    const passwordForm = document.getElementById('password-form');
    const profileForm = document.getElementById('profile-form');

    function showPasswordForm() {
        console.log('showPasswordForm called'); // Agregar esto para depuración
        const email = document.getElementById('email').value;
        const emailErrorMessage = document.getElementById('email-error-message');

        if (email.trim() === '') {
            emailErrorMessage.style.display = 'block';
            return;
        } else {
            emailErrorMessage.style.display = 'none';
            emailForm.classList.add('hidden');
            passwordForm.classList.remove('hidden');
        }
    }

    // Función para mostrar el formulario de perfil
    function showProfileForm() {
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirm-password').value;
        const passwordErrorMessage = document.getElementById('password-error-message');
        const errorMessage = document.getElementById('error-message');

        if (password.trim() === '' || confirmPassword.trim() === '') {
            passwordErrorMessage.style.display = 'block';
            return;
        } else {
            passwordErrorMessage.style.display = 'none';
            validatePassword();
            passwordForm.classList.add('hidden');
            profileForm.classList.remove('hidden');
        }
    }

    // Función para validar la contraseña
    function validatePassword() {
        const password = document.getElementById('password').value;
        const requirements = {
            uppercase: /[A-Z]/.test(password),
            special: /[!@#$%^&*(),.?":{}|<>]/.test(password),
            number: /\d/.test(password),
            length: password.length > 8,
        };

        for (const [key, isValid] of Object.entries(requirements)) {
            const requirementElement = document.getElementById(key);
            requirementElement.className = isValid ? 'valid' : 'invalid';
        }

        validateConfirmPassword();
    }

    // Función para validar la confirmación de la contraseña
    function validateConfirmPassword() {
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirm-password').value;
        const errorMessage = document.getElementById('error-message');

        if (password !== confirmPassword) {
            errorMessage.style.display = 'block';
        } else {
            errorMessage.style.display = 'none';
        }
    }

    // Función para manejar la presentación del perfil
    async function submitProfile(event) {
        event.preventDefault();

        const data = {
            email: document.getElementById('email').value,
            password: document.getElementById('password').value,
            first_name: document.getElementById('first-name').value,
            last_name: document.getElementById('last-name').value,
            mother_last_name: document.getElementById('mother-last-name').value,
            birthdate: document.getElementById('birthdate').value,
            gender: document.getElementById('gender').value
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
                window.location.href = '../paso-frontend/pages/login.html';
            }
        } catch (error) {
            console.error('Error:', error);
        }
    }

    // Agregar eventos a los botones
    document.getElementById('next-to-password-form').addEventListener('click', showPasswordForm);
    document.getElementById('next-to-profile-form').addEventListener('click', showProfileForm);
    document.getElementById('profile-form').addEventListener('submit', submitProfile);

    // Eventos para validar las contraseñas
    document.getElementById('password').addEventListener('input', validatePassword);
    document.getElementById('confirm-password').addEventListener('input', validateConfirmPassword);
});
