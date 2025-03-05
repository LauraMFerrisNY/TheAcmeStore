const {
  client,
  createTables,
  createUser,
  createProduct,
  fetchUsers,
  fetchProducts,
  createFavorite,
  fetchFavorites,
  deleteFavorite
} = require('./db');
const express = require('express');
const app = express();
app.use(express.json());

app.get('/api/products', async(req, res, next)=> {
  try {
    res.send(await fetchProducts());
  }
  catch(ex){
    next(ex);
  }
});

app.get('/api/users', async(req, res, next)=> {
  try {
    res.send(await fetchUsers());
  }
  catch(ex){
    next(ex);
  }
});

app.get('/api/users/:id/favorites', async(req, res, next)=> {
  try {
    res.send(await fetchFavorites(req.params.id));
  }
  catch(ex){
    next(ex);
  }
});

app.delete('/api/users/:userId/favorites/:id', async(req, res, next)=> {
  try {
    await deleteFavorite({ user_id: req.params.userId, id: req.params.id });
    res.sendStatus(204);
  }
  catch(ex){
    next(ex);
  }
});

app.post('/api/users/:id/favorites', async(req, res, next)=> {
  try {
    res.status(201).send(await createFavorite({user_id: req.params.id, product_id: req.body.product_id}));
  }
  catch(ex){
    next(ex);
  }
});

const init = async()=> {
  console.log('connecting to database');
  await client.connect();
  console.log('connected to database');
  await createTables();
  console.log('tables created');
  const [greg, janice, nick, elain, apples, pasta, cherries, carrots, popcorn, chips] = await Promise.all([
    createUser({ username: 'greg', password: 'password123'}),
    createUser({ username: 'janice', password: 'h3!!0t43r3'}),
    createUser({ username: 'nick', password: 'nickpass'}),
    createUser({ username: 'elain', password: 'springtime2025'}),
    createProduct({ name: 'apples'}),
    createProduct({ name: 'pasta'}),
    createProduct({ name: 'cherries'}),
    createProduct({ name: 'carrots'}),
    createProduct({ name: 'popcorn'}),
    createProduct({ name: 'chips'})
  ]);

  console.log(await fetchUsers());
  console.log(await fetchProducts());

  const Favorites = await Promise.all([
    createFavorite({ user_id: greg.id, product_id: cherries.id}),
    createFavorite({ user_id: greg.id, product_id: apples.id}),
    createFavorite({ user_id: elain.id, product_id: pasta.id}),
    createFavorite({ user_id: elain.id, product_id: carrots.id}),
    createFavorite({ user_id: nick.id, product_id: popcorn.id}),
    createFavorite({ user_id: nick.id, product_id: pasta.id}),
    createFavorite({ user_id: janice.id, product_id: apples.id}),
    createFavorite({ user_id: janice.id, product_id: chips.id})
  ]);

  const port = process.env.PORT || 3000;
  app.listen(port, ()=> console.log(`listening on port ${port}`));

}
init();