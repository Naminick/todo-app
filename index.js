'use strict';
const express = require('express');
// ★【追加】Basic認証用の部品を読み込む
const basicAuth = require('basic-auth-connect');
const app = express();

app.set('view engine', 'pug');
app.use(express.urlencoded({ extended: true }));

let todos = [
  { id: '1', task: '部屋の掃除をする' },
  { id: '2', task: 'GitHubの課題を提出する' }
];

// 1. HTTPでのアクセスを禁止する仕組み（前回入れたもの）
app.use((req, res, next) => {
  if (process.env.NODE_ENV === 'production' && req.headers['x-forwarded-proto'] === 'http') {
    res.status(404).send('<h1>ページがみつかりません</h1>');
  } else {
    next();
  }
});

// ★【追加】本番環境（Render）のときだけBasic認証をかける仕組み
app.use((req, res, next) => {
  if (process.env.NODE_ENV === 'production') {
    // ユーザー名を「guest1」、パスワードを「na7hEpEw」に設定
    basicAuth('guest1', 'na7hEpEw')(req, res, next);
  } else {
    // パソコンでのテスト時はパスワードなしでスムーズに開発できるようにする
    next();
  }
});

// ページを表示する
app.get('/todos', (req, res) => {
  res.render('index', { todos: todos });
});

// タスクを追加する
app.post('/todos', (req, res) => {
  const newTask = req.body.task;
  if (newTask) {
    todos.push({ id: Date.now().toString(), task: newTask });
  }
  res.redirect('/todos');
});

// タスクを削除する
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