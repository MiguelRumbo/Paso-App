document.addEventListener('DOMContentLoaded', () => {
    const emailForm = document.getElementById('email-form');
    const passwordForm = document.getElementById('password-form');
    const profileForm = document.getElementById('profile-form');

    // Función para mostrar el formulario de contraseña
    window.showPasswordForm = function() {
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
    };

    // Función para mostrar el formulario de perfil
    window.showProfileForm = function() {
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
    };

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
    window.submitProfile = async function(event) {
        event.preventDefault();

        const birthdateInput = document.getElementById('birthdate').value;
        const birthDate = new Date(birthdateInput);
        const today = new Date();
        const age = today.getFullYear() - birthDate.getFullYear() - (today < new Date(today.getFullYear(), birthDate.getMonth(), birthDate.getDate()) ? 1 : 0);

        const data = {
            email: document.getElementById('email').value,
            password: document.getElementById('password').value,
            nombre: document.getElementById('first-name').value,
            apellido_paterno: document.getElementById('last-name').value,
            apellido_materno: document.getElementById('mother-last-name').value,
            age: age, // Enviar la edad calculada
            birthdate: birthdateInput,
            gender: document.getElementById('gender').value
        };

        // Comprobar si todos los campos están llenos
        for (const key in data) {
            if (!data[key]) {
                alert(`El campo ${key} es requerido.`);
                return;
            }
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
    document.getElementById('email-next-button').addEventListener('click', showPasswordForm);
    document.getElementById('password-next-button').addEventListener('click', showProfileForm);
    document.getElementById('profile-form').addEventListener('submit', submitProfile);

    // Eventos para validar las contraseñas
    document.getElementById('password').addEventListener('input', validatePassword);
    document.getElementById('confirm-password').addEventListener('input', validatePassword);
});
