# Recovery Notes

This repo contains mixed content in [main](main) from multiple pasted sessions and partial code exports.

## What is safely recoverable now

1. Clean static landing page saved to [recovered/index.html](recovered/index.html).
2. Original mixed dump still present in [main](main).

## What is inside the mixed dump

1. One complete clean HTML page at the top of [main](main).
2. A second large static-site block (with escaped newlines and partial truncation) starting after the first closing HTML tag.
3. Embedded chat/session JSON segments and generated code snippets.
4. Multiple unrelated project snippets (HTML, JavaScript, TypeScript, TSX).

## Important limitation

Parts of the dump contain literal text markers like `[truncated]` and giant escaped lines. That means some original lines are already missing in the source itself, so full automated reconstruction is not guaranteed from this file alone.

## Recommended recovery workflow

1. Keep [main](main) unchanged as forensic source.
2. Use [recovered/index.html](recovered/index.html) as your immediate working base.
3. Decide which project you want to recover next (static HTML site, Fastify backend, Next.js frontend, or React Native app).
4. Rebuild that target project only by extracting valid fenced code blocks and ignoring JSON metadata.

If you choose one target, I can do a focused extraction into real files next.
