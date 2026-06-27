# Recoverable Targets

This file enumerates all concrete filenames/paths that can be inferred from decoded blocks.

## Confirmed Static Site Targets

1. index.html
2. privacy.html
3. terms.html
4. how-it-works.html
5. contact.html
6. listings.html
7. listing-detail.html
8. auth-login.html
9. auth-register.html
10. auth-reset.html
11. style.css
12. script.js

Source signals:

1. recovered/decoded/block_005.txt
2. recovered/decoded/block_010.txt

## Confirmed App/Backend Path Targets

1. frontend/app/privacy/page.tsx
2. frontend/app/terms/page.tsx
3. src/navigation/AuthNavigator.tsx
4. src/screens/home/SearchScreen.tsx
5. src/screens/intake/VinEntryScreen.tsx
6. src/screens/intake/IntakeCompleteScreen.tsx
7. frontend/components/ui/LoadingOverlay.tsx
8. frontend/components/ui/EmptyState.tsx
9. src/app.ts
10. src/server.ts
11. src/middleware/auth.ts
12. src/routes/auth.ts
13. src/routes/vehicles.ts
14. src/routes/listings.ts

Source signals:

1. recovered/decoded/block_006.txt
2. recovered/decoded/block_007.txt
3. recovered/decoded/block_011.txt
4. recovered/decoded/block_012.txt
5. recovered/decoded/block_013.txt
6. recovered/decoded/block_014.txt
7. recovered/decoded/block_015.txt
8. recovered/decoded/block_016.txt
9. recovered/decoded/block_018.txt
10. recovered/decoded/block_019.txt
11. recovered/decoded/block_020.txt
12. recovered/decoded/block_021.txt
13. recovered/decoded/block_022.txt
14. recovered/decoded/block_023.txt
15. recovered/decoded/block_024.txt

## Confidence

1. File/path names: high confidence.
2. Full code body content for each target: low confidence from current dump.
3. Existing complete recovered artifact: recovered/rebuilt/site/index.html only.
