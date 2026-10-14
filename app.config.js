// Config dinámica de Expo: permite resolver variables de entorno (.env)
// que app.json (estático) no puede. Fusiona el app.json y añade el plugin
// de react-native-maps con la API key real de Google Maps.
module.exports = ({ config }) => ({
  ...config,
  plugins: [
    ...(config.plugins ?? []),
    [
      'react-native-maps',
      {
        // Expo CLI ya cargó .env antes de evaluar este archivo
        androidGoogleMapsApiKey: process.env.GOOGLE_MAPS_API_KEY,
      },
    ],
  ],
});
