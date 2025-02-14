// Initialize Firebase (use your own Firebase project config)
const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_AUTH_DOMAIN",
    databaseURL: "YOUR_DATABASE_URL",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_STORAGE_BUCKET",
    messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
    appId: "YOUR_APP_ID"
};

const app = firebase.initializeApp(firebaseConfig);
const database = firebase.database(app);
document.addEventListener("DOMContentLoaded", function () {
    const reasonsList = document.querySelector(".reason-list");
    const reasonInput = document.querySelector("textarea");
    const addReasonButton = document.querySelector("button");

    // Reference to Firebase database
    const reasonsRef = database.ref('reasons');

    // Load saved reasons from Firebase
    reasonsRef.on('value', function(snapshot) {
        const reasons = snapshot.val() || {};
        reasonsList.innerHTML = '';  // Clear current list
        Object.values(reasons).forEach(reason => addReasonToList(reason.text));
    });

    // Add new reason
    addReasonButton.addEventListener("click", function () {
        const newReason = reasonInput.value.trim();
        if (newReason) {
            const newReasonKey = reasonsRef.push().key;
            const reasonData = {
                text: newReason
            };
            reasonsRef.child(newReasonKey).set(reasonData); // Save to Firebase
            reasonInput.value = "";
        }
    });

    function addReasonToList(reasonText) {
        const li = document.createElement("li");

        const reasonSpan = document.createElement("span");
        reasonSpan.textContent = reasonText;
        li.appendChild(reasonSpan);

        const editButton = document.createElement("button");
        editButton.textContent = "Edit";
        editButton.classList.add("edit-button");
        editButton.addEventListener("click", function () {
            const newReason = prompt("Edit your reason:", reasonSpan.textContent);
            if (newReason) {
                reasonSpan.textContent = newReason;
                updateReasonInStorage(reasonText, newReason);
            }
        });
        li.appendChild(editButton);

        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Delete";
        deleteButton.classList.add("delete-button");
        deleteButton.addEventListener("click", function () {
            li.remove();
            deleteReasonFromStorage(reasonText);
        });
        li.appendChild(deleteButton);

        reasonsList.appendChild(li);
    }

    function updateReasonInStorage(oldReason, newReason) {
        const reasons = Object.entries(savedReasons);
        const reasonKey = reasons.find(([key, value]) => value.text === oldReason)[0];
        reasonsRef.child(reasonKey).update({ text: newReason });
    }

    function deleteReasonFromStorage(reason) {
        const reasons = Object.entries(savedReasons);
        const reasonKey = reasons.find(([key, value]) => value.text === reason)[0];
        reasonsRef.child(reasonKey).remove();
    }
});
