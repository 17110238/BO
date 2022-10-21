import Document, { DocumentContext, Head, Html, Main, NextScript } from 'next/document';
class MyDocument extends Document {
  static async getInitialProps(ctx: DocumentContext) {
    const originalRenderPage = ctx.renderPage;

    ctx.renderPage = () =>
      originalRenderPage({
        enhanceApp: (App) => App,
        enhanceComponent: (Component) => Component,
      });

    const initialProps = await Document.getInitialProps(ctx);

    return initialProps;
  }

  render() {
    return (
      <Html>
        <Head>
          <link rel="manifest" href="/manifest.json" />
          <link rel="apple-touch-icon" href="/icon.png"></link>
          <meta name="theme-color" content="#fff" />
          <link rel='stylesheet' href='/assets/css/bootstrap/bootstrap.css' />
          <link rel='stylesheet' href='/assets/css/fontawesome.css' />
          <link rel='stylesheet' href='/assets/css/style.css' />
          <link rel='preconnect' href='https://fonts.googleapis.com' />
          <link rel='preconnect' href='https://fonts.gstatic.com' crossOrigin='true' />
          <link
            href='https://fonts.googleapis.com/css2?family=Nunito+Sans:ital,wght@0,200;0,300;0,400;0,600;0,700;0,800;0,900;1,200;1,300;1,400;1,600;1,700;1,800;1,900&display=swap'
            rel='stylesheet'
          />
          <link rel='icon' type='image/png' sizes='16x16' href='/favicon.png' />
          <link rel='preconnect' href='https://fonts.googleapis.com' />
          <link rel='preconnect' href='https://fonts.gstatic.com' crossOrigin='true' />
          <link
            href='https://fonts.googleapis.com/css2?family=Nunito+Sans:wght@200;300;400;600;700;800;900&display=swap'
            rel='stylesheet'
          />
          <link
            href='https://code.jquery.com/ui/1.12.1/themes/base/jquery-ui.css'
            rel='stylesheet'></link>
          <link
            href="https://cdnjs.cloudflare.com/ajax/libs/cropperjs/1.4.1/cropper.css"
            rel="stylesheet"
          ></link>
          <link
            rel="stylesheet"
            href="https://pro.fontawesome.com/releases/v5.10.0/css/all.css"

          />

          <script
            type='text/javascript'
            src='https://cdnjs.cloudflare.com/ajax/libs/cropperjs/1.4.1/cropper.js'></script>
        </Head>

        <body>
          <Main />
          <NextScript />

          {/* <script src='/assets/js/jquery/jquery-3.5.1.min.js'></script>
          <script src='/assets/js/jquery/jquery-ui.js'></script>
          <script src='/assets/js/bootstrap/popper.js'></script>

          <script src='/assets/js/main.js'></script>
          <script src='https://cdn.quilljs.com/1.0.0/quill.js'></script> */}
        </body>
      </Html>
    );
  }
}

export default MyDocument;
