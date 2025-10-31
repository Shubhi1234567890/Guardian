document.addEventListener('DOMContentLoaded', () => {
  // Wake service worker & test communication
  chrome.runtime.sendMessage({ type: "POPUP_PING" }, (res) => {
    console.log("Popup → SW response:", res);
  });

  loadShieldedUsers();
});

function loadShieldedUsers() {
  const listElement = document.getElementById('shielded-users-list');
  listElement.innerHTML = ''; 

  chrome.storage.local.get(null, (items = {}) => {
    if (chrome.runtime.lastError) {
      console.error("Storage read error:", chrome.runtime.lastError);
      return;
    }

    let hasShieldedUsers = false;

    Object.keys(items).forEach(key => {
      if (key.startsWith('guardian_user_')) {
        const userData = items[key];

        if (userData.isShielded) {
          hasShieldedUsers = true;
          const username = key.replace('guardian_user_', '');

          const li = document.createElement('li');

          const span = document.createElement('span');
          span.className = 'username';
          span.textContent = username;

          const button = document.createElement('button');
          button.className = 'unshield-btn';
          button.textContent = 'Unshield';

          button.addEventListener('click', () => {
            unshieldUser(username);
          });

          li.appendChild(span);
          li.appendChild(button);
          listElement.appendChild(li);
        }
      }
    });

    if (!hasShieldedUsers) {
      listElement.innerHTML = '<li id="no-users">No users are currently shielded.</li>';
    }
  });
}

function unshieldUser(username) {

  // ✅ Tell background to unshield and update filtering engine
  chrome.runtime.sendMessage(
    { type: "UNSHIELD_USER", username },
    (res) => {
      console.log("SW reply for unshield:", res);
    }
  );

  // ✅ Remove from storage as well
  const key = `guardian_user_${username}`;
  chrome.storage.local.remove(key, () => {
    if (chrome.runtime.lastError) {
      console.error("Storage delete error:", chrome.runtime.lastError);
      return;
    }

    console.log(`✅ User '${username}' unshielded`);
    loadShieldedUsers();
  });
}
