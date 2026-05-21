'use strict';
const express = require('express');
const app = express();

app.set('view engine', 'pug');
app.use(express.urlencoded({ extended: true }));

let todos = [
  { id: '1', task: '部屋の掃除をする' },
  { id: '2', task: 'GitHubの課題を提出する' }
];

// ★【追加】HTTPでのアクセスを禁止（拒否）する仕組み
app.use((req, res, next) => {
  // Renderなどの本番環境（production）かつ、プロトコルが http の場合
  if (process.env.NODE_ENV === 'production' && req.headers['x-forwarded-proto'] === 'http') {
    // 404エラー（Not Found）の画面を表示して、処理をストップする
    res.status(404).send('<h1>ページがみつかりません</h1>');
  } else {
    // 問題なければ、次の通常の処理に進む
    next();
  }
});

// 1. ページを表示する
app.get('/todos', (req, res) => {
  res.render('index', { todos: todos });
});

// 2. タスクを追加する
app.post('/todos', (req, res) => {
  const newTask = req.body.task;
  if (newTask) {
    todos.push({ id: Date.now().toString(), task: newTask });
  }
  res.redirect('/todos');
});

// 3. タスクを削除する
app.get('/todos/delete/:id', (req, res) => {
  const deleteId = req.params.id;
  todos = todos.filter(todo => todo.id !== deleteId);
  res.redirect('/todos');
});

app.get('/', (req, res) => {
  res.redirect('/todos');
});

const port = process.env.PORT || 8000;
app.listen(port, () => {
  console.info(`Listening on ${port}`);
});