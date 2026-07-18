# Magne — portfolio

En prosjektfokusert portfolio bygget med React, TypeScript, Vite, Tailwind CSS og DaisyUI.

## Lokal utvikling

Du trenger Node.js 20 eller nyere.

```bash
npm install
npm run dev
```

Prosjektene og teksten redigeres hovedsakelig i `src/data.ts` og `src/App.tsx`.

## Publisering på GitHub Pages

1. Opprett et GitHub-repository og push innholdet i denne mappen til `main`.
2. Åpne **Settings → Pages** i repositoryet.
3. Under **Build and deployment**, velg **GitHub Actions** som source.
4. Workflowen i `.github/workflows/deploy.yml` bygger og publiserer siden automatisk ved hver push til `main`.

Vite bruker relative asset-stier, så løsningen fungerer både på et bruker-repository og et project-repository.

## Før publisering

- Bytt ut `hei@eksempel.no` med riktig e-postadresse.
- Legg inn riktige GitHub- og LinkedIn-lenker i `src/App.tsx`.
- Oppdater prosjekttekster, status og lenker i `src/data.ts`.
