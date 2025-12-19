// Firebase設定
const firebaseConfig = {
  apiKey: "AIzaSyASQCUoAsjg7fCZqaYgpSJdPfw4K5fx0LI",
  authDomain: "card-app-eece0.firebaseapp.com",
  projectId: "card-app-eece0",
};

// Firebase初期化
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// 名刺一覧をリアルタイム表示
db.collection("cards")
  .orderBy("name")
  .onSnapshot(snapshot => {
    const list = document.getElementById("list");
    list.innerHTML = "";

    snapshot.forEach(doc => {
      const card = doc.data();
      const li = document.createElement("li");

      li.innerHTML = `
        <strong>${card.name}</strong>
        <div>会社: ${card.company || "-"}</div>
        <div>電話: ${card.phone || "-"}</div>
        <div>業種: ${card.industry || "-"}</div>
        <div>${card.detail || ""}</div>
      `;

      // 削除ボタン
      const delBtn = document.createElement("button");
      delBtn.textContent = "削除";
      delBtn.onclick = () => {
        if (confirm("本当に削除しますか？")) {
          db.collection("cards").doc(doc.id).delete();
        }
      };

      li.appendChild(delBtn);
      list.appendChild(li);
    });
  });

// 保存
function save() {
  const name = document.getElementById("name").value.trim();
  if (!name) { alert("名前は必須です"); return; }

  db.collection("cards").add({
    name,
    company: document.getElementById("company").value.trim(),
    phone: document.getElementById("phone").value.trim(),
    industry: document.getElementById("industry").value.trim(),
    detail: document.getElementById("detail").value.trim(),
    createdAt: firebase.firestore.FieldValue.serverTimestamp()
  })
  .then(() => {
    clearForm();
    alert("保存しました");
  })
  .catch(err => alert("保存に失敗しました: " + err));
}

// 入力クリア
function clearForm() {
  document.getElementById("name").value = "";
  document.getElementById("company").value = "";
  document.getElementById("phone").value = "";
  document.getElementById("industry").value = "";
  document.getElementById("detail").value = "";
}

// 検索
function searchCards() {
  const keyword = document.getElementById("search").value.toLowerCase();
  const items = document.querySelectorAll("#list li");

  items.forEach(li => {
    const text = li.innerText.toLowerCase();
    li.style.display = text.includes(keyword) ? "" : "none";
  });
}
