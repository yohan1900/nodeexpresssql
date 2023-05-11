var express = require('express');
var app = express();

const { Sequelize, DataTypes } = require('sequelize');
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: 'database.sqlite'
});

const Comments = sequelize.define('comments', {
  // Model attributes are defined here
  content: {
    type: DataTypes.STRING,
    allowNull: false
  }
}, {
  // Other model options go here
});

(async()=>{
  await Comments.sync();
})();



app.use(express.json()) // for parsing application/json
app.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded

// set the view engine to ejs
app.set('view engine', 'ejs');

// index page (읽기)
app.get('/', async function(req, res) {
  const comments = await Comments.findAll();
  res.render('index',{comments:comments});
});

//생성하기
app.post('/create', async function(req, res) {
  const { content } = req.body
  await Comments.create({ content:content}); // Create a new user 
  res.redirect('/')
});

//업데이트
app.post('/update/:id', async function(req, res) {
  const { content } = req.body
  const { id } = req.params
  await Comments.update(   // Change
    { content:content }, 
    { where: {id : id}}
  );
  res.redirect('/')
});

//삭제
app.post('/delete/:id', async function(req, res) {
  const { id } = req.params
await Comments.destroy(  // Delete
  {where: {id:id}}
  );
  res.redirect('/')
});

app.listen(8080);
console.log('Server is listening on port 8080');