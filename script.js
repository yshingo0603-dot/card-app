// Firebase設定
const firebaseConfig = {
  apiKey: "AIzaSyASQCUoAsjg7fCZqaYgpSJdPfw4K5fx0LI",
  authDomain: "card-app-eece0.firebaseapp.com",
  projectId: "card-app-eece0",
};

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// 一覧をリアルタイム表示
db.collection("cards")
  .orderBy("name")
  .onSnapshot(snapshot => {
    const list = document.getElementById("list");
    list.innerHTML = "";

    snapshot.forEach(doc => {
      const card = doc.data();

      const li = document.createElement("li");
      li.innerHTML = `
        <strong>${card.name}</strong><br>
        ${card.company}<br>
        ${card.phone}<br>
        業種：${card.industry}<br>
        ${card.detail || ""}
      `;

      const delBtn = document.createElement("button");
      delBtn.textContent = "削除";
      delBtn.onclick = () => {
        db.collection("cards").doc(doc.id).delete();
      };

      li.appendChild(document.createElement("br"));
      li.appendChild(delBtn);
      list.appendChild(li);
    });
  });

// 保存
function save() {
  const name = document.getElementById("name").value;
  const company = document.getElementById("company").value;
  const phone = document.getElementById("phone").value;
  const industry = document.getElementById("industry").value;
  const detail = document.getElementById("detail").value;

  if (!name) {
    alert("名前は必須です");
    return;
  }

  db.collection("cards").add({
    name,
    company,
    phone,
    industry,
    detail,
    createdAt: firebase.firestore.FieldValue.serverTimestamp()
  });

  clearForm();
}

// 入力クリア
function clearForm() {
  document.getElementById("name").value = "";
  document.getElementById("company").value = "";
  document.getElementById("phone").value = "";
  document.getElementById("industry").value = "";
  document.getElementById("detail").value = "";
}
function searchCards() {
  const keyword = document
    .getElementById("search")
    .value
    .toLowerCase();

  const items = document.querySelectorAll("#list li");

  items.forEach(li => {
    const text = li.innerText.toLowerCase();
    li.style.display = text.includes(keyword) ? "" : "none";
  });
}