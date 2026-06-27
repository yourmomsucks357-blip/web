# Block Target Map

Best-effort target mapping from extracted snippet blocks in [recovered/snippets](recovered/snippets).

## Static Site Blocks

1. block_001.txt -> privacy.html marker
2. block_002.txt -> how-it-works.html marker
3. block_003.txt -> script.js marker
4. block_004.txt -> script.js marker (duplicate stream)
5. block_008.txt -> how-it-works.html marker (duplicate stream)
6. block_009.txt -> script.js marker (duplicate stream)

## Frontend Next.js Blocks

1. block_006.txt -> frontend/app/privacy/page.tsx marker
2. block_007.txt -> frontend/app/terms/page.tsx marker

## React Native Blocks

1. block_011.txt -> src/navigation/AuthNavigator.tsx marker
2. block_012.txt -> src/screens/home/SearchScreen.tsx marker
3. block_013.txt -> src/screens/intake/VinEntryScreen.tsx marker
4. block_014.txt -> src/screens/intake/IntakeCompleteScreen.tsx marker
5. block_015.txt -> frontend/components/ui/LoadingOverlay.tsx marker
6. block_016.txt -> frontend/components/ui/EmptyState.tsx marker

## Fastify Backend Blocks

1. block_018.txt -> src/app.ts marker
2. block_019.txt -> src/server.ts marker
3. block_020.txt -> src/middleware/auth.ts marker
4. block_021.txt -> src/routes/auth.ts marker
5. block_022.txt -> src/routes/vehicles.ts marker
6. block_023.txt -> src/routes/listings.ts marker
7. block_024.txt -> src/app.ts updated marker

## Meta / Narrative Blocks

1. block_005.txt -> completion summary narrative
2. block_010.txt -> PDF instructions narrative
3. block_017.txt -> final checklist narrative
4. block_025.txt -> next steps narrative

## Notes

1. Most block files are markers with escaped conversation payload, not full source code.
2. Full content context remains in [recovered/all/main.raw.txt](recovered/all/main.raw.txt) and [recovered/all/after-first-html.raw.txt](recovered/all/after-first-html.raw.txt).
3. Decode stage is complete; see [recovered/decoded/MANIFEST_DECODED.md](recovered/decoded/MANIFEST_DECODED.md).
4. Consolidated inferred targets are listed in [recovered/rebuilt/maps/recoverable_targets.md](recovered/rebuilt/maps/recoverable_targets.md).
