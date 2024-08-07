document.getElementById('search-button').addEventListener('click', function() {
    const city = document.getElementById('city-select').value;
    const date = document.getElementById('date-input').value;
    if (!city || !date) {
        alert('Por favor, selecciona una ciudad y una fecha.');
        return;
    }

    fetch(`https://paso-app.ticsevn.com/get_trips.php?city=${encodeURIComponent(city)}&date=${encodeURIComponent(date)}`)
        .then(response => response.json())
        .then(data => {
            const container = document.getElementById('trips-container');
            container.innerHTML = '';

            if (data.length === 0) {
                container.innerHTML = '<p>No hay viajes disponibles para la fecha seleccionada.</p>';
                return;
            }

            data.forEach(trip => {
                const tripElement = document.createElement('div');
                tripElement.className = 'trips';
                tripElement.innerHTML = `
                    <div class="trip">
                        <img src="https://via.placeholder.com/50" alt="Repartidor">
                        <div class="trip-info">
                            <h3>Ciudad de salida: ${trip.ciudad_salida}</h3>
                            <p>Fecha de llegada a tu ciudad: ${trip.fecha_llegada} (${trip.dias_restantes} días)</p>
                        </div>
                        <a href="detail_travel.html?viajeId=${trip.id}">Ver detalles</a>
                    </div>
                `;
                container.appendChild(tripElement);
            });
        })
        .catch(error => {
            console.error('Error:', error);
        });
});
