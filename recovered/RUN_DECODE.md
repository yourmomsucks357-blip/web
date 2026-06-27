# Decode Snippet Blocks

Run this to convert escaped snippet blocks into readable text files:

```bash
cd /workspaces/web
perl recovered/decode_blocks.pl
```

Output location:

- recovered/decoded/
- recovered/decoded/MANIFEST_DECODED.md

This does not invent missing text. It only decodes what exists in the source dump.
