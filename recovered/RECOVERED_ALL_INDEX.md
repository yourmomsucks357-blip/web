# Recovered All Index

This index is the "all of it" recovery output from [main](main).

## Canonical full captures

1. [recovered/all/main.raw.txt](recovered/all/main.raw.txt)
   - Full byte-for-byte copy of the current [main](main).

2. [recovered/all/after-first-html.raw.txt](recovered/all/after-first-html.raw.txt)
   - Everything after the first complete HTML document in [main](main).

3. [recovered/all/chat-json-tail.raw.txt](recovered/all/chat-json-tail.raw.txt)
   - Tail region starting at first JSON item marker.

## Usable reconstructed outputs

1. [recovered/site/index.html](recovered/site/index.html)
   - First clean HTML document from [main](main).

2. [recovered/index.html](recovered/index.html)
   - Previously recovered clean standalone page.

## Mechanical code-fence extraction

1. [recovered/snippets/MANIFEST.md](recovered/snippets/MANIFEST.md)
   - Listing of all extracted fenced blocks.

2. [recovered/snippets](recovered/snippets)
   - Raw extracted blocks as block_XXX files.

## Recovery metadata

1. [recovered/EXTRACTION_RESULT.txt](recovered/EXTRACTION_RESULT.txt)
2. [recovered/RECOVERY_NOTES.md](recovered/RECOVERY_NOTES.md)
3. [recovered/RECOVERY_STATUS.md](recovered/RECOVERY_STATUS.md)
4. [recovered/RUN_THIS.md](recovered/RUN_THIS.md)
5. [recovered/extract_all.sh](recovered/extract_all.sh)

## Important integrity note

The source itself contains literal truncation markers (for example, "[truncated]") and escaped/broken long lines. Those missing fragments are not present in [main](main), so no tool can reconstruct exact missing bytes that are not in the source.
