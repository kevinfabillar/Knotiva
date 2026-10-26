// The template catalogue: plain data only, so both the site and scripts/thumbs.mjs can read it.
// Each template's code lives in registry.js and only loads when someone opens it.
// Thumbnails: public/templates/<slug>/thumb-desktop.jpg and thumb-phone.jpg (made by `npm run thumbs`).

export const FILTERS = [
  { key: 'all', label: 'All' },
  { key: 'elegant', label: 'Elegant' },
  { key: 'modern', label: 'Modern' },
  { key: 'rustic', label: 'Rustic & outdoor' },
  { key: 'filipino', label: 'Filipino' },
  { key: 'playful', label: 'Playful' },
  { key: 'moody', label: 'Dark & moody' },
];

export const CATALOG = [
  {
    slug: 'cinematic',
    name: 'Cinematic',
    tags: ['elegant'],
    price: '₱3,500',
    blurb: 'Soft whites, wide serif names and a sunset hero that fades into the page.',
    fonts: ['Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400', 'Jost:wght@300;400;500', 'Pinyon+Script'],
  },
  {
    slug: 'dark-fiery-flowers',
    name: 'Dark Fiery Flowers',
    tags: ['moody', 'elegant'],
    price: '₱4,200',
    blurb: 'Plum smoke, copper-gold line art and a live countdown inside a floral arch.',
    fonts: ['Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,400', 'Jost:wght@300;400;500', 'Pinyon+Script'],
  },
  {
    slug: 'mountain',
    name: 'Mountain',
    tags: ['rustic'],
    price: '₱3,800',
    blurb: 'A summit photo, torn paper edges and Roman capitals for an adventure wedding.',
    fonts: ['Cinzel:wght@400;500;600', 'Lora:ital,wght@0,400;0,500;1,400', 'Allura', 'Jost:wght@400;500'],
  },
  {
    slug: 'rustic-romance',
    name: 'Rustic Romance',
    tags: ['rustic'],
    price: '₱3,800',
    blurb: 'Barn wood, glowing string lights, stacked polaroids and brush-script names.',
    fonts: ['Alex+Brush', 'Jost:wght@400;500', 'Cormorant+Garamond:ital,wght@0,400;0,500;1,400'],
  },
  {
    slug: 'street-style',
    name: 'Street Style',
    tags: ['playful'],
    price: '₱3,200',
    blurb: 'A travel-journal collage with tape labels, doodles and a food and things-to-do guide.',
    fonts: ['Permanent+Marker', 'Courier+Prime:wght@400;700', 'Alex+Brush'],
  },
  {
    slug: 'street-minimal',
    name: 'Street Minimal',
    tags: ['modern', 'playful'],
    price: '₱3,200',
    blurb: 'Bold condensed names, numbered sections and soft pink and olive accents.',
    fonts: ['Oswald:wght@500;600', 'Jost:wght@400;500;600', 'Cormorant+Garamond:ital,wght@0,500;1,500'],
  },
  {
    slug: 'europe-style',
    name: 'Europe Style',
    tags: ['elegant', 'modern'],
    price: '₱3,800',
    blurb: 'An editorial Provence layout with a weekend guide and favourite restaurants.',
    fonts: ['Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,400', 'Jost:wght@300;400;500', 'Herr+Von+Muellerhoff'],
  },
  {
    slug: 'gilded-deco',
    name: 'Gilded Deco',
    tags: ['elegant', 'moody'],
    price: '₱4,200',
    blurb: 'A New Year’s Eve ballroom in black, emerald and champagne gold, with stepped arches and a gold-foil scratch-off date.',
    fonts: ['Poiret+One', 'Bodoni+Moda:ital,opsz,wght@0,6..96,400..700;1,6..96,400..700', 'Josefin+Sans:wght@300;400;600'],
  },
  {
    slug: 'isla',
    name: 'Isla',
    tags: ['filipino', 'rustic'],
    price: '₱3,800',
    blurb: 'A Filipino island wedding with capiz-shell windows, banig weave, cut-paper palms and Tagalog greetings.',
    fonts: ['Fraunces:ital,opsz,wght,SOFT,WONK@0,9..144,300..800,0..100,0..1;1,9..144,300..800,0..100,0..1', 'Figtree:wght@400;500;600'],
  },
  {
    slug: 'sumi',
    name: 'Sumi',
    tags: ['modern', 'elegant'],
    price: '₱3,800',
    blurb: 'Japanese ink on washi paper: an ensō brush circle, a vermilion hanko seal and gold kintsugi seams.',
    fonts: ['Spectral:ital,wght@0,200;0,300;0,400;0,500;1,200;1,300', 'Albert+Sans:wght@300;400;500;600', 'Shippori+Mincho:wght@500;600'],
  },
];

export const catalogEntry = (slug) => CATALOG.find((t) => t.slug === slug);

export const fontsHref = (families) => `https://fonts.googleapis.com/css2?${families.map((f) => `family=${f}`).join('&')}&display=swap`;
