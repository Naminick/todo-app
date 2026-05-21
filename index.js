'use strict';
const express = require('express');
const app = express();

// 画面を作るテンプレートエンジンに「Pug」を指定
app.set('view engine', 'pug');

// フォームから送信されたデータを受け取れるようにする設定
app.use(express.urlencoded({ extended: true }));

// タスクを保存する配列（簡易的なメモリ保存。再起動するとリセットされます）
let todos = [
  { id: '1', task: '部屋の掃除をする' },
  { id: '2', task: 'GitHubの課題を提出する' }
];

// 1. ページを表示する（読み込み）
app.get('/todos', (req, res) => {
  res.render('index', { todos: todos });
});

// 2. タスクを追加する（追加ボタンを押したとき）
app.post('/todos', (req, res) => {
  const newTask = req.body.task;
  if (newTask) {
    todos.push({
      id: Date.now().toString(), // 被らないIDをミリ秒で作る
      task: newTask
    });
  }
  res.redirect('/todos');
});

// 3. タスクを削除する（削除リンクを押したとき）
app.get('/todos/delete/:id', (req, res) => {
  const deleteId = req.params.id;
  todos = todos.filter(todo => todo.id !== deleteId);
  res.redirect('/todos');
});

// 4. 指定なしでアクセスされたら /todos に飛ばす
app.get('/', (req, res) => {
  res.redirect('/todos');
});

// Renderなどの環境変数が指定するポート、または8000番で起動
const port = process.env.PORT || 8000;
app.listen(port, () => {
  console.info(`Listening on ${port}`);
});