async function loadProfile() {
    try {
        const response = await fetch('https://paso-app.ticsevn.com/profile.php', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
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
            return;
        }

        document.getElementById('user-name').textContent = data.user.nombre + ' ' + data.user.apellido_paterno;
        document.getElementById('user-bio').textContent = data.user.bio || 'Sin biografía';
        document.getElementById('travel-count').textContent = data.travel_count;
        document.getElementById('order-count').textContent = data.order_count;
        document.querySelector('.profile-header img').src = data.user.profile_picture || 'https://via.placeholder.com/100';
    } catch (error) {
        console.error('Error al cargar el perfil:', error);
    }
}

// Cargar el perfil al cargar la página
window.onload = loadProfile;
