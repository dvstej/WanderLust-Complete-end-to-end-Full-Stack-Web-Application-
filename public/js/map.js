mapboxgl.accessToken = map_Token;

 const map = new mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/mapbox/streets-v12',
        center: coordinates,//[lng,lat]
        zoom: 12
    });

const marker = new mapboxgl.Marker({color:"red"})
        .setLngLat(coordinates) //Listing.geometry.coordinates
        .addTo(map);
