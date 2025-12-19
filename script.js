// Firebase設定
const firebaseConfig = {
  apiKey: "AIzaSyASQCUoAsjg7fCZqaYgpSJdPfw4K5fx0LI",
  authDomain: "card-app-eece0.firebaseapp.com",
  projectId: "card-app-eece0",
};

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// リアルタイム取得（全員共通）
db.collection("cards").onSnapshot(snapshot => {
  const list = document.getElementById("list");
  list.innerHTML = "";

  snapshot.forEach(doc => {
    renderCard(doc.id, doc.data());
  });
});

// 保存
function save() {
  console.log("save clicked");
  const name = document.getElementById("name").value;
  const company = document.getElementById("company").value;
  const phone = document.getElementById("phone").value;

  if (!name) {
    alert("名前を入力してください");
    return;
  }

  db.collection("cards").add({
    name,
    company,
    phone,
    createdAt: firebase.firestore.FieldValue.serverTimestamp()
  });

  clearForm();
}

// 表示
function renderCard(id, card) {
  const li = document.createElement("li");
  li.textContent = `${card.name} / ${card.company} / ${card.phone}`;

  const delBtn = document.createElement("button");
  delBtn.textContent = "削除";
  delBtn.style.marginLeft = "8px";
  delBtn.onclick = () => {
    db.collection("cards").doc(id).delete();
  };

  li.appendChild(delBtn);
  document.getElementById("list").appendChild(li);
}

function clearForm() {
  document.getElementById("name").value = "";
  document.getElementById("company").value = "";
  document.getElementById("phone").value = "";
}
