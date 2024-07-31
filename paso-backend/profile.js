async function getUserProfile(user_id) {
    try {
        const response = await fetch('https://paso-app.ticsevn.com/profile.php', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${user_id}` // Enviamos el ID del usuario en el header de autorización
            },
            credentials: 'include' // Asegúrate de enviar las cookies con la solicitud
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        
        const contentType = response.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
            throw new Error("Response is not JSON");
        }
        
        const data = await response.json();
        
        if (data.error) {
            console.error(data.error);
            document.getElementById('user-name').textContent = 'Error al cargar perfil';
            return;
        }

        document.getElementById('user-name').textContent = data.user.nombre + ' ' + data.user.apellido_paterno;
        document.getElementById('user-bio').textContent = data.user.bio || 'Sin biografía';
        document.getElementById('travel-count').textContent = data.travel_count;
        document.getElementById('order-count').textContent = data.order_count;
        document.querySelector('.profile-header img').src = data.user.profile_picture || 'https://via.placeholder.com/100';
    } catch (error) {
        console.error('Error al cargar el perfil:', error);
        document.getElementById('user-name').textContent = 'Error al cargar perfil';
    }
}

function getCookie(name) {
    let value = "; " + document.cookie;
    let parts = value.split("; " + name + "=");
    if (parts.length === 2) return parts.pop().split(";").shift();
}

async function loadProfile() {
    const user_id = getCookie('user_id'); // Obtener el ID del usuario desde las cookies
    if (user_id) {
        await getUserProfile(user_id);
    } else {
        console.error("No se encontraron credenciales");
        document.getElementById('user-name').textContent = 'No se encontraron credenciales';
    }
}

// Cargar el perfil al cargar la página
window.onload = loadProfile;
