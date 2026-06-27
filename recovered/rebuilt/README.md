# Rebuilt Output

This folder contains best-effort reconstructed project outputs using only reliable non-terminal extraction steps.

## Included

1. [recovered/rebuilt/site/index.html](recovered/rebuilt/site/index.html)
   - Clean recovered page from original dump.

2. [recovered/rebuilt/maps/block_target_map.md](recovered/rebuilt/maps/block_target_map.md)
   - Mapping of extracted snippet blocks to intended filenames.

3. [recovered/rebuilt/maps/recoverable_targets.md](recovered/rebuilt/maps/recoverable_targets.md)
   - Consolidated list of concrete filenames/paths inferred from decoded blocks.

4. [recovered/rebuilt/fragments/static_site_targets.txt](recovered/rebuilt/fragments/static_site_targets.txt)
   - Flat list of static-site target files.

5. [recovered/rebuilt/fragments/app_stack_targets.txt](recovered/rebuilt/fragments/app_stack_targets.txt)
   - Flat list of frontend/mobile/backend target paths.

6. [recovered/rebuilt/scaffold/README.md](recovered/rebuilt/scaffold/README.md)
   - Fully materialized scaffold tree for all inferred targets.

## Source of Truth

1. [recovered/all/main.raw.txt](recovered/all/main.raw.txt)
2. [recovered/all/after-first-html.raw.txt](recovered/all/after-first-html.raw.txt)
3. [recovered/all/chat-json-tail.raw.txt](recovered/all/chat-json-tail.raw.txt)

## Why this is best-effort

1. The dump itself contains missing text markers and partial truncation.
2. Many extracted blocks are conversation-wrapped markers rather than complete file payloads.
3. This rebuilt tree preserves what is reliable and explicitly maps what is partial.

## Decode Stage Status

1. Decoding now succeeds and produced `recovered/decoded/block_001.txt` through `recovered/decoded/block_025.txt`.
2. Decoded outputs are primarily heading/marker content, not full source payloads for each referenced file.
