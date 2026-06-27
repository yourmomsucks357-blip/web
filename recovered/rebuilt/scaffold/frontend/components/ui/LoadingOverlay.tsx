// Provenance: inferred from recovered/decoded/block_015.txt

type LoadingOverlayProps = {
  message?: string;
};

export function LoadingOverlay({ message = "Loading..." }: LoadingOverlayProps) {
  return (
    <div role="status" aria-live="polite">
      {message}
    </div>
  );
}
