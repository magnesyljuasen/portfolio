# Legge til prosjekter

Prosjektene ligger i `projects.json`. Kopier et eksisterende objekt, gi prosjektet en unik `id`, og fyll inn feltene.

- Bruk `"kind": "digital"` for den digitale øya.
- Bruk `"kind": "geographic"` og `"coordinates": [lengdegrad, breddegrad]` for Norge.
- Legg eventuelle PNG- eller WebP-bilder i `public/projects/`.
- Legg deretter til for eksempel `"image": "projects/mitt-prosjekt.png"` i prosjektet.

Feltet `image` er valgfritt. Detaljvisningen viser bildet automatisk når det er satt.
