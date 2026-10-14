import * as Location from 'expo-location';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Platform, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { LocationMap } from '@/components/location-map';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { BottomTabInset, MaxContentWidth, Spacing } from '@/constants/theme';

// Coordenadas GPS actuales del dispositivo
type Coords = {
  latitude: number;
  longitude: number;
};

// Estados posibles de la obtención de la ubicación
type Status = 'loading' | 'denied' | 'error' | 'ready';

export default function HomeScreen() {
  // Estado general: carga, permiso denegado, error o éxito
  const [status, setStatus] = useState<Status>('loading');
  // Coordenadas obtenidas; el mapa solo se renderiza cuando existen
  const [coords, setCoords] = useState<Coords | null>(null);
  // Lugar legible obtenido por geocodificación inversa (ciudad, estado)
  const [place, setPlace] = useState<string | null>(null);

  useEffect(() => {
    // Paso 1: solicitar permiso de ubicación y obtener las coordenadas GPS
    async function getLocation() {
      try {
        // Solicitar permiso en primer plano (muestra el diálogo del sistema)
        const { status: permission } = await Location.requestForegroundPermissionsAsync();
        if (permission !== 'granted') {
          setStatus('denied');
          return;
        }

        // Obtener la posición actual del dispositivo
        const location = await Location.getCurrentPositionAsync({});
        const { latitude, longitude } = location.coords;
        setCoords({ latitude, longitude });

        // Paso 3: geocodificación inversa (solo disponible en Android/iOS)
        if (Platform.OS !== 'web') {
          try {
            const [address] = await Location.reverseGeocodeAsync({ latitude, longitude });
            // Componer "ciudad, estado" con los datos reales devueltos por la API
            const city = address?.city ?? address?.subregion ?? address?.district;
            const region = address?.region;
            const name = [city, region].filter(Boolean).join(', ');
            setPlace(name || null);
          } catch {
            // Si falla el geocodificado se muestran las coordenadas en su lugar
            setPlace(null);
          }
        }

        setStatus('ready');
      } catch {
        // Cualquier error de ubicación no bloquea la aplicación
        setStatus('error');
      }
    }

    getLocation();
  }, []);

  // Paso 4: mensaje dinámico según el estado obtenido
  const message =
    status === 'loading'
      ? 'Obteniendo tu ubicación…'
      : status === 'denied'
        ? 'Permiso de ubicación denegado. Actívalo para ver tu posición.'
        : status === 'error'
          ? 'No se pudo determinar tu ubicación.'
          : place
            ? `Estás en ${place}`
            : `Lugar no disponible. Coordenadas: ${coords?.latitude.toFixed(5)}, ${coords?.longitude.toFixed(5)}`;

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        {/* Mensaje con el lugar detectado o el estado del proceso */}
        <ThemedText type="subtitle" style={styles.message}>
          {message}
        </ThemedText>

        {/* Indicador de carga mientras se obtiene la ubicación */}
        {status === 'loading' && (
          <ActivityIndicator size="large" color="#2563eb" style={styles.spinner} />
        )}

        {/* Paso 2: mapa con marcador, solo cuando ya existen las coordenadas */}
        {coords && <LocationMap latitude={coords.latitude} longitude={coords.longitude} />}
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    flexDirection: 'row',
    // Fondo base de la paleta (src/global.css)
    backgroundColor: '#f0f4fa',
  },
  safeArea: {
    flex: 1,
    paddingHorizontal: Spacing.four,
    alignItems: 'center',
    gap: Spacing.four,
    paddingBottom: BottomTabInset + Spacing.three,
    maxWidth: MaxContentWidth,
    alignSelf: 'center',
  },
  message: {
    textAlign: 'center',
    // Azul principal de la paleta para el mensaje de ubicación
    color: '#2563eb',
  },
  spinner: {
    marginTop: Spacing.two,
  },
});
