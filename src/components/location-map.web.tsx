import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Spacing } from '@/constants/theme';

import type { LocationMapProps } from './location-map';

// react-native-maps no tiene soporte web, así que en navegador se muestra
// un respaldo con las coordenadas en lugar del mapa
export function LocationMap({ latitude, longitude }: LocationMapProps) {
  return (
    <View style={styles.container}>
      <ThemedText type="small" style={styles.coordinates}>
        Mapa no disponible en web. Coordenadas: {latitude.toFixed(5)}, {longitude.toFixed(5)}
      </ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 280,
    borderRadius: 12,
    borderWidth: 1,
    // Borde y superficie de la paleta (src/global.css)
    borderColor: '#d6e0f0',
    backgroundColor: '#f5f8ff',
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.four,
  },
  coordinates: {
    color: '#3d5278',
  },
});
