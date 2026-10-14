import Constants, { ExecutionEnvironment } from 'expo-constants';
import { Platform, StyleSheet, View } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { WebView } from 'react-native-webview';

// Paleta del sistema visual (misma que src/global.css)
const Colors = {
  background: '#f0f4fa',
  border: '#d6e0f0',
  primary: '#2563eb',
  shadow: '#0d1b3e',
};

// Props compartidas: coordenadas exactas que deben centrarse en el mapa
export type LocationMapProps = {
  latitude: number;
  longitude: number;
};

// Expo Go Android trae la API key de Google Maps de Expo VENCIDA (issue
// expo/expo#49323), por lo que el mapa nativo nunca carga tiles ahí.
// En ese caso concretos se usa Leaflet + OpenStreetMap (gratuito, sin key)
// dentro de un WebView. En development builds y en iOS se usa el mapa nativo.
const isExpoGoAndroid =
  Platform.OS === 'android' &&
  Constants.executionEnvironment === ExecutionEnvironment.StoreClient;

// HTML mínimo de Leaflet centrado en las coordenadas con un marcador
// circular en el azul principal de la paleta
function buildLeafletHtml(latitude: number, longitude: number): string {
  return `<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
    <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
    <style>
      html, body, #map { margin: 0; padding: 0; width: 100%; height: 100%; }
    </style>
  </head>
  <body>
    <div id="map"></div>
    <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
    <script>
      const map = L.map('map').setView([${latitude}, ${longitude}], 15);
      L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '© OpenStreetMap',
      }).addTo(map);
      L.circleMarker([${latitude}, ${longitude}], {
        radius: 10,
        color: '#ffffff',
        weight: 3,
        fillColor: '${Colors.primary}',
        fillOpacity: 1,
      }).addTo(map);
    </script>
  </body>
</html>`;
}

// Mapa con la posición exacta del usuario y un marcador en esa coordenada
export function LocationMap({ latitude, longitude }: LocationMapProps) {
  const coordinate = { latitude, longitude };

  return (
    // Superficie del sistema: fondo azul grisáceo, borde sutil y esquinas redondeadas
    <View style={styles.container}>
      {isExpoGoAndroid ? (
        // Respaldo para Expo Go Android: OpenStreetMap vía Leaflet (sin API key)
        <WebView
          originWhitelist={['*']}
          javaScriptEnabled
          domStorageEnabled
          scrollEnabled={false}
          style={styles.map}
          source={{ html: buildLeafletHtml(latitude, longitude) }}
        />
      ) : (
        // Mapa nativo (Google Maps en Android con la key propia del proyecto)
        <MapView
          style={styles.map}
          initialRegion={{
            ...coordinate,
            latitudeDelta: 0.0022,
            longitudeDelta: 0.0421,
          }}>
          {/* Marcador con el azul principal de la paleta */}
          <Marker coordinate={coordinate} title="Ubicación Actual" pinColor={Colors.primary} />
        </MapView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: 280,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.background,
    overflow: 'hidden',
    // Sombra azulada sutil, solo cuando aporta profundidad
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
  },
  map: {
    width: '100%',
    height: '100%',
  },
});
