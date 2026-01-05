export default function Head() {
  return (
    <>
      {/* Enforce upgrading of insecure requests where supported (helps prevent mixed-content issues). */}
      <meta
        httpEquiv="Content-Security-Policy"
        content="upgrade-insecure-requests"
      />
      {/* Additional security headers may need to be set on the hosting platform (e.g., GitHub Pages, Vercel). */}
    </>
  );
}
