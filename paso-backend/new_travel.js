function submitTravelData() {
    const headers = new Headers({
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Bearer ${getCookie('user_id')}`
    });

    const formData = new URLSearchParams({
        'departure-city': document.getElementById('departure-city').value,
        'destination': document.getElementById('destination').value,
        'departure-date': document.getElementById('departure-date').value,
        'return-date': document.getElementById('return-date').value,
        'cold-containers': document.getElementById('cold-containers').value,
        'hot-containers': document.getElementById('hot-containers').value,
        'comments': document.getElementById('comments').value
    });

    fetch('https://paso-app.ticsevn.com/new_travel.php', {
        method: 'POST',
        headers: headers,
        body: formData
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        if (data.success) {
            alert(data.success);
            // Aquí puedes añadir lógica para redirigir o mostrar la ventana de gracias
        } else {
            throw new Error(data.error);
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Hubo un problema con la solicitud. Verifica la consola para más detalles.');
    });
}
