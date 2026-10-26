// Template code, loaded on demand. Keys match the slugs in catalog.js.
export const LOADERS = {
  cinematic: () => import('./cinematic/Cinematic.jsx'),
  'dark-fiery-flowers': () => import('./dark/DarkFieryFlowers.jsx'),
  mountain: () => import('./mountain/Mountain.jsx'),
  'rustic-romance': () => import('./rustic/RusticRomance.jsx'),
  'street-style': () => import('./street/StreetStyle.jsx'),
  'street-minimal': () => import('./minimal/StreetMinimal.jsx'),
  'europe-style': () => import('./europe/EuropeStyle.jsx'),
  'gilded-deco': () => import('./deco/GildedDeco.jsx'),
  isla: () => import('./isla/Isla.jsx'),
  sumi: () => import('./sumi/Sumi.jsx'),
};
