Aplicación Expo (React Native) que muestra la ubicación GPS del usuario en un mapa con marcador. Al iniciar, solicita el permiso de ubicación, obtiene las coordenadas, resuelve ciudad y estado mediante geocodificación inversa y presenta el mensaje "Estás en {ciudad}, {estado}" (o las coordenadas, si el lugar no está disponible).

## Cómo funciona

- **Home** (`src/app/index.tsx`): pide el permiso con `expo-location`, obtiene la posición actual y renderiza `LocationMap` con las coordenadas exactas.
- **LocationMap** (`src/components/location-map.tsx`): en Android e iOS usa `react-native-maps` (Google Maps en Android, con API key propia inyectada desde `.env` vía `app.config.js`). En Expo Go Android se usan OpenStreetMap (Leaflet) en un WebView como respaldo, ya que el mapa de Google no carga ahí por una key vencida de Expo ([issue expo/expo#49323](https://github.com/expo/expo/issues/49323)). En web se muestran las coordenadas en texto.
- **Explore** (`src/app/explore.tsx`): pantalla de ejemplo de la plantilla con enlaces a documentación.
- La navegación usa pestañas nativas de Expo Router (`NativeTabs`).

## Hooks

- `useColorScheme` (`src/hooks/use-color-scheme.ts`): expone el esquema de color del sistema (con variante web tolerante a la hidratación).
- `useTheme` (`src/hooks/use-theme.ts`): devuelve la paleta de colores del esquema activo (claro/oscuro).
- `useState` y `useEffect` (`src/app/index.tsx`): gestionan el estado del flujo de ubicación (carga, permiso denegado, error, coordenadas y lugar).

## Tecnologías

- Expo SDK 57 · React Native 0.86 · React 19 · TypeScript
- Expo Router (tabs nativas)
- `expo-location` (GPS y geocodificación inversa)
- `react-native-maps` (mapa nativo)
- `react-native-webview` (respaldo OpenStreetMap en Expo Go Android)
- Paleta de colores y tipografías (Sora, Instrument Serif) en `src/global.css`

## Ejecución

```bash
npm install
npm run start
```

`npm run start` levanta el servidor de Expo; abre el proyecto en Expo Go (Android/iOS) o en el navegador con `npm run web`.

Para probar Google Maps en Android con la API key propia, crea un development build (requiere Android SDK):

1. Crea un archivo `.env` con `GOOGLE_MAPS_API_KEY=tu_key` (el plugin `react-native-maps` la inyecta en el `AndroidManifest` en el prebuild).
2. Ejecuta `npm run android`.

| Comando             | Descripción                          |
| ------------------- | ------------------------------------ |
| `npm run start`     | Servidor de desarrollo (Expo)        |
| `npm run android`   | Development build nativo en Android  |
| `npm run ios`       | Development build nativo en iOS      |
| `npm run web`       | Versión web                          |
| `npm run lint`      | Lint (ESLint)                        |

By: Arturo Juárez Monroy
