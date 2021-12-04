<template>
  <div id="map">
  </div>
</template>

<script>
import { Loader } from '@googlemaps/js-api-loader'

export default {
  data() {
    return {
      positionSelected: null,
      map: null,
      circuloShape: null,
      marker: null,
      circulos: [],
      coordinates: [],
      mapLoaded: false,
    }
  },

  props: {
    raio: Number,
    editing: Boolean,
    listaCoordenadas: Array
  },

  mounted() {
    const mapStyle = [
      { elementType: "geometry", stylers: [{ color: "#242f3e" }] },
      { elementType: "labels.text.stroke", stylers: [{ color: "#242f3e" }] },
      { elementType: "labels.text.fill", stylers: [{ color: "#746855" }] },
      {
        featureType: "administrative.locality",
        elementType: "labels.text.fill",
        stylers: [{ color: "#d59563" }],
      },
      {
        featureType: "poi",
        elementType: "labels.text.fill",
        stylers: [{ color: "#d59563" }],
      },
      {
        featureType: "poi.park",
        elementType: "geometry",
        stylers: [{ color: "#263c3f" }],
      },
      {
        featureType: "poi.park",
        elementType: "labels.text.fill",
        stylers: [{ color: "#6b9a76" }],
      },
      {
        featureType: "road",
        elementType: "geometry",
        stylers: [{ color: "#38414e" }],
      },
      {
        featureType: "road",
        elementType: "geometry.stroke",
        stylers: [{ color: "#212a37" }],
      },
      {
        featureType: "road",
        elementType: "labels.text.fill",
        stylers: [{ color: "#9ca5b3" }],
      },
      {
        featureType: "road.highway",
        elementType: "geometry",
        stylers: [{ color: "#746855" }],
      },
      {
        featureType: "road.highway",
        elementType: "geometry.stroke",
        stylers: [{ color: "#1f2835" }],
      },
      {
        featureType: "road.highway",
        elementType: "labels.text.fill",
        stylers: [{ color: "#f3d19c" }],
      },
      {
        featureType: "transit",
        elementType: "geometry",
        stylers: [{ color: "#2f3948" }],
      },
      {
        featureType: "transit.station",
        elementType: "labels.text.fill",
        stylers: [{ color: "#d59563" }],
      },
      {
        featureType: "water",
        elementType: "geometry",
        stylers: [{ color: "#17263c" }],
      },
      {
        featureType: "water",
        elementType: "labels.text.fill",
        stylers: [{ color: "#515c6d" }],
      },
      {
        featureType: "water",
        elementType: "labels.text.stroke",
        stylers: [{ color: "#17263c" }],
      },
    ]
    const loader = new Loader({
      apiKey: "AIzaSyBTdy4W_VdsPyuVFyX6GBmZEtbCzGh3sgI",
      version: "weekly"
    });
    loader.load().then( () => {
      this.map = new google.maps.Map(document.getElementById("map"), {
        center: { lat: -13.706, lng: -55.644 },
        zoom: 4,
        streetViewControl: false,
        styles: mapStyle
      });
      this.mapLoaded = true;
      this.setCircles();
    });
  },
  watch: {
    raio: function (val) {
      if (this.editing) {
        if (this.circuloShape != null) this.circuloShape.setMap(null);
        if (this.editing) {
          if (this.circuloShape != null) this.circuloShape.setMap(null);
          this.circuloShape = new google.maps.Circle({
            strokeColor: "#FF0000",
            strokeOpacity: 0.8,
            strokeWeight: 2,
            fillColor: "#FF0000",
            fillOpacity: 0.35,
            map: this.map,
            center: this.positionSelected,
            radius: val,
          });
          this.circuloShape.setMap(this.map);
        }
      }
    },
    editing: function (val) {
      if (!val) {
        this.setCircles();
        google.maps.event.clearInstanceListeners(this.map)
        this.clearMarkers();
      }
      else {
        this.unsetCircles();
        this.map.addListener('click', (event) => {
          this.clearMarkers();
          this.marker = new google.maps.Marker({
            position: this.positionSelected = event.latLng,
            map: this.map
          });
          this.$emit('positionSelected', this.positionSelected.toJSON());
          this.marker.setMap(this.map);
          this.circuloShape = new google.maps.Circle({
            strokeColor: "#FF0000",
            strokeOpacity: 0.8,
            strokeWeight: 2,
            fillColor: "#FF0000",
            fillOpacity: 0.35,
            map: this.map,
            center: this.positionSelected,
            radius: this.raio,
          });
          this.circuloShape.setMap(this.map);
        });
      }
    },
    listaCoordenadas: function () {
      if (this.mapLoaded) {
        this.setCircles();
      }
    }
  },

  methods: {
    clearMarkers() {
      if (this.circuloShape != null) this.circuloShape.setMap(null);
      if (this.marker != null) this.marker.setMap(null);
    },

    setCircles() {
      if (this.circulos.length > 0) {
        this.unsetCircles();
      }
      for (const city in this.listaCoordenadas) {
        console.log(this.listaCoordenadas);
        const cityCircle = new google.maps.Circle({
          strokeColor: "#FF0000",
          strokeOpacity: 0.8,
          strokeWeight: 2,
          fillColor: "#FF0000",
          fillOpacity: 0.35,
          map: this.map,
          center: this.listaCoordenadas[city].center,
          radius: this.listaCoordenadas[city].radius,
        });
        this.circulos.push(cityCircle);
      }
    },
    unsetCircles() {
      this.circulos.forEach((circulo) => {
        circulo.setMap(null);
      })
    }
  }
}
</script>

<style>
</style>