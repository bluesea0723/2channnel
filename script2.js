
// Firebaseの初期化
firebase.initializeApp(firebaseConfig);

// Firebase Realtime Databaseへの参照を取得
const database = firebase.database();

// HTMLの要素を取得
const submitButton = document.getElementById('submitButton');
const nameInput = document.getElementById('nameInput');
const messageInput = document.getElementById('messageInput');
const postContainer = document.getElementById('post-container');

// --- データの保存処理 ---
// 「投稿」ボタンがクリックされたときの処理
submitButton.addEventListener('click', () => {
    const name = nameInput.value;
    const message = messageInput.value;

    if (!name || !message) {
        alert('名前とメッセージを入力してください。');
        return;
    }

    // Firebaseの'posts'という場所にデータを送信（保存）する
    database.ref('posts').push({
        name: name,
        message: message,
        timestamp: Date.now() // 投稿日時をタイムスタンプとして保存
    });

    // 入力欄をクリア
    nameInput.value = '';
    messageInput.value = '';
});


// --- データの表示処理 ---
// 'posts'の場所にあるデータが追加されたときに実行される処理
database.ref('posts').on('child_added', (snapshot) => {
    const post = snapshot.val(); // 追加された投稿データを取得

    // 新しい投稿を表示するためのHTML要素を作成
    const postElement = document.createElement('div');
    postElement.classList.add('post');

    postElement.innerHTML = `
        <p><span class="name">${sanitize(post.name)}</span></p>
        <p class="message">${sanitize(post.message)}</p>
    `;

    // 投稿コンテナの先頭に新しい投稿を追加
    postContainer.prepend(postElement);
});


// XSS対策のための簡易的なサニタイズ関数
function sanitize(str) {
    return str.replace(/</g, '&lt;').replace(/>/g, '&gt;');

}
