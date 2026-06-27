#!/usr/bin/env bash
set -euo pipefail

cd "$(dirname "$0")/.."

mkdir -p recovered/all recovered/site recovered/snippets

cp main recovered/all/main.raw.txt

# First clean HTML document from the top of main
awk '1; /<\/html>/{exit}' main > recovered/site/index.html

# Everything after the first clean HTML close
awk 'seen{print} /<\/html>/{if(!seen){seen=1}}' main > recovered/all/after-first-html.raw.txt

# JSON/chat tail starting at first item marker
awk 'BEGIN{f=0} /"item-[0-9]/{f=1} f{print}' main > recovered/all/chat-json-tail.raw.txt

# Extract fenced code blocks from the whole dump
perl -0777 -ne '
  my $txt = $_;
  my $manifest = "recovered/snippets/MANIFEST.md";
  open my $mf, ">", $manifest or die $!;
  print $mf "# Extracted Code Fences\\n\\n";

  my $i = 0;
  while ($txt =~ /```([A-Za-z0-9_-]*)\\n(.*?)```/sg) {
    my $lang = $1 // "";
    my $code = $2 // "";
    $i++;

    my $ext = "txt";
    $ext = "html" if $lang eq "html";
    $ext = "js" if $lang eq "javascript";
    $ext = "ts" if $lang eq "typescript";
    $ext = "tsx" if $lang eq "tsx";

    my $name = sprintf("block_%03d.%s", $i, $ext);
    my $path = "recovered/snippets/$name";

    open my $of, ">", $path or die $!;
    print $of $code;
    close $of;

    my $preview = substr($code, 0, 100);
    $preview =~ s/\\n/ /g;
    $preview =~ s/\\s+/ /g;

    print $mf "- $name";
    print $mf " (lang=$lang)" if $lang ne "";
    print $mf " - $preview\\n";
  }

  print $mf "\\nTotal blocks: $i\\n";
  close $mf;
' main

cat > recovered/EXTRACTION_RESULT.txt <<EOF
Recovery extraction complete.

Created:
- recovered/all/main.raw.txt
- recovered/all/after-first-html.raw.txt
- recovered/all/chat-json-tail.raw.txt
- recovered/site/index.html
- recovered/snippets/MANIFEST.md
- recovered/snippets/block_XXX.*
EOF

echo "Done. See recovered/EXTRACTION_RESULT.txt"
