const express = require('express'); // Sử dụng framework express
const next = require('next'); // Include module next

const path = require('path');

const port = process.env.NODE_PORT || 5000;
const domain = '0.0.0.0';
const dev = process.env.NODE_ENV !== 'production';

const app = next({ dev: false });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = express();

  //Tạo ra các router. Dòng này có ý nghĩa khi gửi request đến path /a . Sẽ render file /a.js trong thư mục pages/a.js của Nextjs
  //   server.get('/a', (req, res) => {
  //     return app.render(req, res, '/a', req.query)
  //   })
  server.use(express.static(path.join(__dirname, `${process.env.NODE_ENV || '.next'}/static`)));
  // Nếu các bạn muốn các routing tự động liến kết đến route files giống với cấu trúc của Nextjs thì chỉ cần thêm 3 dòng bên dưới
  // https://nextjs.org/docs/routing/introduction
  server.all('*', (req, res) => {
    return handle(req, res);
  });

  server.listen(port, (err) => {
    if (err) throw err;
    console.log(`> Ready on http://${domain}:${port}`);
  });
});
