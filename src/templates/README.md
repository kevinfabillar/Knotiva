# Invitation templates

Each template is a full, working digital wedding invitation. Guests open it on their phone, tap through an opening gate, and get music, a countdown, details, dress code, entourage, gallery, gifts, FAQ and an RSVP.

## Adding a template

1. Create `src/templates/<name>/<Name>.jsx` and `<name>.css`. Default-export a component that renders `<TemplateRoot>` from `../kit/index.js`.
2. Add an entry to `catalog.js` (name, price, tags, blurb, Google Fonts) and a loader to `registry.js`, both under the same slug.
3. Put photos in `public/templates/<slug>/`.
4. Run `npm run thumbs -- <slug>` to make the catalogue thumbnails (needs Chrome; set `CHROME_PATH` if it is not found).

The demo lives at `/templates/<slug>`:

- `?to=Maria&seats=3` personalises the guest name and reserved seats
- `?cover=off` skips the opening gate
- `?thumb=1` is the thumbnail mode the script uses

## The kit (`kit/`)

`TemplateRoot` props:

| prop | what it does |
| --- | --- |
| `className` | the template's root class; put the theme variables on it |
| `nav` | `[{ id, label }]` section links for the phone menu |
| `monogram` | short text for the phone bar, e.g. `"N & L"` |
| `gate` | opening screen: `{ variant, names, monogram, eyebrow, date, image, button, hint, petals }`; variants are `envelope`, `doors`, `curtain`, `card` and `seal` |
| `music` | `'canon'` or `'reverie'` (built-in, synthesised, public-domain pieces), or a URL to the couple's own song file |

Sections: `Countdown`, `CalendarButton`, `Venues`, `Program`, `Timeline`, `DressCode`, `Entourage`, `Gifts`, `Faq`, `Rsvp`, `Gallery`, `useLightbox`. Sample content is in `kit/demo.js`.

Kit pieces only read CSS variables, so they take on each template's look. Set these on the template's root class:

```
--k-bg --k-surface --k-ink --k-muted --k-accent --k-on-accent --k-line
--k-display --k-body --k-script --k-radius --k-btn-radius --k-shadow
--g-bg --g-ink --g-accent --g-env --g-seal --g-door --g-door-ink   (gate)
--k-bar-ink-top --k-bar-bg --k-bar-ink                             (phone bar)
--k-music-bg --k-music-ink                                         (music button)
```

Layout uses container queries (`@container tpl (max-width: 640px)`) so a template lays out by its own width. Give the desktop header the class `k-topnav`: on phones it is hidden and the kit's bar and menu take over. Add `rv` (plus `d1`–`d4` for stagger) to anything that should fade up on scroll.

## Editable by the couple

Templates must read their details and photos through the kit so the Customize page (`/templates/<slug>/customize`) and the print page (`/templates/<slug>/print`) work:

- Keep the couple's details in a module constant `DEFAULTS` (`a`, `b`, `start`, `end`, `date`, `place`, `venue`, `replyBy`, …) and call `const D = useDetails(DEFAULTS)` inside the component. Never hard-code names or initials; use `initials(D)`.
- Wrap every photo path in `photo(...)` from `usePhoto()`. For a CSS background photo, pass it as a variable on `TemplateRoot` (`style={{ '--img-hero': url(...) }}`) and use `var(--img-hero, url(...))` in the CSS.
- Export `meta = { defaults: DEFAULTS, className, cover }`. The print page uses it for the card's theme and photo.

Edits are saved in the visitor's browser (IndexedDB, `kit/store.js`); `?mine=1` shows them on the demo page.
