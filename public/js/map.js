const script = document.createElement('script')
script.src = src="https://maps.googleapis.com/maps/api/js?key=AIzaSyA-hgl5n_jj4RVBqxeH4iaxm45kubjBFWw&callback=initMap"
script.async = true

function initMap(campground) {
    const {lat, lng} = campground
    const map = new google.maps.Map(document.getElementById("map"), {
        zoom: 8,
        center: {lat: lat, lng: lng},
        scrollwheel: false
    });
    const contentString = `<strong>${campground.name}</br>${campground.location}</strong><p>${campground.description}</p>`
    const infoWindow = new google.maps.InfoWindow({
        content: contentString
    })
    const marker = new google.maps.Marker({
        position: {lat: lat, lng: lng},
        map: map
    })

    marker.addListener('click', () => {
        infoWindow.open(map, marker)
    })
}
