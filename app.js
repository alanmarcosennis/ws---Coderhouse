const express = require('express');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);
const exphbs = require('express-handlebars');

// Configuración de Handlebars
const handlebars = exphbs.create({
  /* opciones de configuración */
});

app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');

// Middleware para servir archivos estáticos
app.use(express.static('public'));

// // Array para almacenar los productos
// let products = [];

// Array para almacenar los productos
let products = [
  { id: 1, name: 'Producto 1' },
  { id: 2, name: 'Producto 2' },
  { id: 3, name: 'Producto 3' }
];

// Rutas
// app.get('/', (req, res) => {
//   res.render('home');
// });

// app.get('/realtimeproducts', (req, res) => {
//   res.render('realTimeProducts', { products });
// });
app.get('/', (req, res) => {
  console.log('Renderizando la vista home');
  res.render('home');
});

app.get('/realtimeproducts', (req, res) => {
  console.log('Renderizando la vista realtimeproducts');
  res.render('realTimeProducts', { products });
});



// Inicialización del servidor de Socket.IO
io.on('connection', (socket) => {
  console.log('Cliente conectado');

  // Manejo de eventos de creación y eliminación de productos
  socket.on('createProduct', (product) => {
    products.push(product);
    io.emit('productCreated', product);
  });

  socket.on('deleteProduct', (productId) => {
    products = products.filter((product) => product.id !== productId);
    io.emit('productDeleted', productId);
  });
});

// Inicio del servidor
const port = 3000;
server.listen(port, () => {
  console.log(`Servidor escuchando en el puerto ${port}`);
});
