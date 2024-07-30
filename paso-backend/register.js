document.addEventListener('DOMContentLoaded', () => {
    const emailForm = document.getElementById('email-form');
    const passwordForm = document.getElementById('password-form');
    const profileForm = document.getElementById('profile-form');

    // Función para mostrar el formulario de contraseña
    function showPasswordForm() {
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
            if (password !== confirmPassword) {
                errorMessage.style.display = 'block';
                return;
            }
            errorMessage.style.display = 'none';
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
    }

    // Función para manejar la presentación del perfil
    async function submitProfile(event) {
        event.preventDefault();

        const data = {
            email: document.getElementById('email').value,
            password: document.getElementById('password').value,
            nombre: document.getElementById('first-name').value,
            apellido_paterno: document.getElementById('last-name').value,
            apellido_materno: document.getElementById('mother-last-name').value,
            age: document.getElementById('birthdate').value,
            birthdate: document.getElementById('birthdate').value,
            gender: document.getElementById('gender').value
        };

        // Comprobar si todos los campos están llenos
        for (const key in data) {
            if (!data[key]) {
                alert(`El campo ${key} es requerido.`);
                return;
            }
        }

        // Validar edad
        const today = new Date();
        const birthDate = new Date(data.birthdate);
        const age = today.getFullYear() - birthDate.getFullYear();
        const monthDifference = today.getMonth() - birthDate.getMonth();
        if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }

        if (age < 18) {
            alert('Debes tener al menos 18 años para registrarte.');
            return;
        }

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

    // Agregar eventos a los botones
    document.querySelector('.submit-button').addEventListener('click', showPasswordForm);
    document.querySelector('.submit-button').addEventListener('click', showProfileForm);
    document.getElementById('profile-form').addEventListener('submit', submitProfile);

    // Eventos para validar las contraseñas
    document.getElementById('password').addEventListener('input', validatePassword);
    document.getElementById('confirm-password').addEventListener('input', validatePassword);
});
