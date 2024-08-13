document.addEventListener('DOMContentLoaded', function() {
    const urlParams = new URLSearchParams(window.location.search);
    const viajeId = urlParams.get('viajeId');

    if (!viajeId) {
        alert('No se encontró el ID del viaje');
        return;
    }

    fetch(`https://paso-app.ticsevn.com/get_detail_travel.php?viajeId=${viajeId}`)
        .then(response => response.json())
        .then(data => {
            if (data.error) {
                alert(data.error);
                return;
            }

            const tripDetails = document.getElementById('trip-details');
            tripDetails.innerHTML = `
                <div class="trip">
                    <img src="https://via.placeholder.com/50" alt="Repartidor">
                    <div class="trip-info">
                        <h3>Ciudad de salida: ${data.viaje.ciudad_salida_real}</h3>
                        <h3>Ciudad de destino: ${data.viaje.ciudad_destino_real}</h3>
                        <p>Fecha de llegada a tu ciudad: ${data.viaje.fecha_llegada}</p>
                        <p>Contenedores fríos: ${data.viaje.contenedores_frios}</p>
                        <p>Contenedores calientes: ${data.viaje.contenedores_calientes}</p>
                    </div>
                </div>
            `;

            const driverDetails = document.getElementById('driver-details');
            driverDetails.innerHTML = `
                <div class="driver">
                    <img src="https://via.placeholder.com/50" alt="Conductor">
                    <div class="driver-info">
                        <h3>${data.conductor.nombre} ${data.conductor.apellido_paterno}</h3>
                        <p>Viajes completados: ${data.conductor.viajes_completados}</p>
                    </div>
                </div>
            `;
        })
        .catch(error => {
            console.error('Error:', error);
        });

    document.getElementById('save-trip').addEventListener('click', function() {
        // Lógica para guardar el viaje
    });

    document.getElementById('make-order').addEventListener('click', function() {
        window.location.href = "new_order.html";
    });
});
