async function getUserProfile(user_id) {
    try {
        const response = await fetch(`https://paso-app.ticsevn.com/profile.php`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${user_id}`
            }
        });

        const data = await response.json();

        if (data.error) {
            console.error(data.error);
            alert('Error al obtener el perfil del usuario');
            return;
        }

        document.getElementById('user-name').textContent = `${data.user.nombre} ${data.user.apellido_paterno}`;
        document.getElementById('user-bio').textContent = data.bio;
        document.getElementById('profile-picture').src = data.profile_picture ? data.profile_picture : 'https://via.placeholder.com/100';
        document.getElementById('travel-count').textContent = data.travel_count;
        document.getElementById('order-count').textContent = data.order_count;
    } catch (error) {
        console.error('Error:', error);
    }
}

async function updateProfile() {
    const bio = document.getElementById('editBio').value;

    try {
        const response = await fetch('https://paso-app.ticsevn.com/profile.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${user_id}`
            },
            body: JSON.stringify({ bio })
        });

        const data = await response.json();
        if (data.success) {
            document.getElementById('user-bio').textContent = bio;
            document.getElementById('editModal').style.display = 'none';
        } else {
            alert('Error al actualizar el perfil');
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

async function uploadPicture() {
    const input = document.getElementById('uploadPicture');
    if (input.files.length === 0) {
        alert('Por favor selecciona una imagen');
        return;
    }

    const formData = new FormData();
    formData.append('profile_picture', input.files[0]);

    try {
        const response = await fetch('https://paso-app.ticsevn.com/profile.php', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${user_id}`
            },
            body: formData
        });

        const data = await response.json();
        if (data.success) {
            document.getElementById('profile-picture').src = data.profile_picture;
            document.getElementById('uploadModal').style.display = 'none';
        } else {
            alert('Error al subir la imagen');
        }
    } catch (error) {
        console.error('Error:', error);
    }
}
