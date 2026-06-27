use strict;
use warnings;
use File::Basename qw(dirname);
use Cwd qw(abs_path);

my $script_dir = dirname(abs_path(__FILE__));
my $recovered_dir = $script_dir;
my $workspace_dir = dirname($recovered_dir);

chdir $workspace_dir or die "Cannot chdir to workspace dir $workspace_dir: $!";

opendir(my $dh, 'recovered/snippets') or die "Cannot open recovered/snippets: $!";
my @files = sort map { "recovered/snippets/$_" }
  grep { /^block_\d+\.txt$/ }
  readdir($dh);
closedir($dh);

die "No snippet blocks found in recovered/snippets" unless @files;
mkdir 'recovered/decoded' unless -d 'recovered/decoded';

open my $mf, '>', 'recovered/decoded/MANIFEST_DECODED.md' or die $!;
print $mf "# Decoded Block Manifest\n\n";
my $n = 0;

for my $f (@files) {
  open my $in, '<', $f or die $!;
  local $/;
  my $raw = <$in>;
  close $in;

  # Remove common JSON wrapper artifacts.
  $raw =~ s/^\s*"//;
  $raw =~ s/"\s*,?\s*$//;

  # Decode common escape sequences.
  my $decoded = $raw;
  $decoded =~ s/\\r\\n/\n/g;
  $decoded =~ s/\\n/\n/g;
  $decoded =~ s/\\t/\t/g;
  $decoded =~ s/\\"/"/g;
  $decoded =~ s/\\\\/\\/g;

  # Trim noisy leading whitespace.
  $decoded =~ s/^\s+\n/\n/;

  my ($name) = $f =~ m{([^/]+)$};
  my $out = "recovered/decoded/$name";
  open my $of, '>', $out or die $!;
  print $of $decoded;
  close $of;

  my $lines = () = $decoded =~ /\n/g;
  my $preview = $decoded;
  $preview =~ s/\s+/ /g;
  $preview = substr($preview, 0, 120);

  print $mf "- $name lines=" . ($lines + 1) . " preview=$preview\n";
  $n++;
}

print $mf "\nTotal decoded blocks: $n\n";
close $mf;
print "Decoded $n blocks\n";
