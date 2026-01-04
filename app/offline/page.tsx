import type React from "react";

export default function OfflinePage() {
  return (
    <html lang="ar" dir="rtl">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>غير متصل - إذاعة القرآن الكريم</title>
        <style>{`
          body {
            margin: 0;
            padding: 0;
            font-family: system-ui, -apple-system, sans-serif;
            background: linear-gradient(135deg, #1a2332 0%, #0d7377 100%);
            color: #f5f5dc;
            display: flex;
            align-items: center;
            justify-content: center;
            min-height: 100vh;
            text-align: center;
          }
          .container {
            padding: 2rem;
            max-width: 500px;
          }
          h1 {
            font-size: 2rem;
            margin-bottom: 1rem;
            color: #d4af37;
          }
          p {
            font-size: 1.125rem;
            line-height: 1.6;
            margin-bottom: 2rem;
          }
          .icon {
            font-size: 4rem;
            margin-bottom: 1rem;
          }
        `}</style>
      </head>
      <body>
        <div className="container">
          <div className="icon">📡</div>
          <h1>غير متصل بالإنترنت</h1>
          <p>
            يبدو أنك غير متصل بالإنترنت حاليًا.
            <br />
            يرجى التحقق من اتصالك بالإنترنت والمحاولة مرة أخرى.
          </p>
        </div>
      </body>
    </html>
  );
}
