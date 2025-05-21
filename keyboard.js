let stopHighlighting = false;
let stillTyping = false;
let predictedWord = "";

// Check server availability
function checkServerConnection() {
    return fetch("http://127.0.0.1:8000/test", { mode: "cors" })
        .then(response => {
            if (!response.ok) throw new Error(`Server connection error: ${response.status}`);
            return response.json();
        });
}

// Handle file upload
async function handleFileUpload(input) {
    const file = input.files[0];
    if (!file) return;

    document.getElementById('file-name').textContent = file.name;
    const uploadButton = document.querySelector('label.control-button');
    const originalText = uploadButton.textContent;
    uploadButton.textContent = "Uploading...";

    try {
        await checkServerConnection();

        const formData = new FormData();
        formData.append("sim_input", file);

        const response = await fetch("http://127.0.0.1:8000/predict_letter", {
            method: "POST",
            body: formData,
            mode: "cors"
        });

        if (!response.ok) throw new Error(`Server error: ${response.status}`);

        const data = await response.json();
        if (data && data.predicted_word) {
            predictedWord = data.predicted_word;
            console.log(`✅ Word received: "${predictedWord}"`);
            document.getElementById("startBtn").disabled = false;
        } else {
            throw new Error("No predicted_word found in response");
        }
    } catch (error) {
        console.error(error);
        alert(error.message.includes("Failed to fetch")
            ? "Could not connect to server. Please make sure the server is running using the command: python run_server.py"
            : "Error: " + error.message);
    } finally {
        uploadButton.textContent = originalText;
    }
}

// Start flashing and typing sequence
function startSequence() {
    if (!predictedWord) return;

    const inputField = document.getElementById("inputField");
    inputField.value = "";
    document.getElementById("startBtn").disabled = true;

    let index = 0;
    stillTyping = true;
    stopHighlighting = false;
    startHighlighting();

    function loopFlashAndType() {
        if (index >= predictedWord.length) {
            stillTyping = false;
            stopHighlighting = true;
            console.log("✅ Finished displaying all letters.");
            return;
        }

        stopHighlighting = false;
        console.log(`🔄 Flashing for 32.5s before showing letter ${index + 1}`);

        setTimeout(() => {
            stopHighlighting = true;
            console.log("⏸ Pausing 2.5s to show letter");

            setTimeout(() => {
                document.getElementById("inputField").value += predictedWord[index];
                console.log(`✅ Added letter: "${predictedWord[index]}"`);
                index++;

                stopHighlighting = false; // ✅ Resume flashing
                loopFlashAndType();       // 🔁 Next cycle
            }, 2500);

        }, 32500);
    }

    loopFlashAndType();
}

// Flashing animation loop
function startHighlighting() {
    const gridItems = document.querySelectorAll(".grid-item");
    const columns = 6;
    const rows = Math.ceil(gridItems.length / columns);
    const columnGroups = Array.from({ length: columns }, (_, col) =>
        Array.from(gridItems).filter((_, idx) => idx % columns === col));
    const rowGroups = Array.from({ length: rows }, (_, row) =>
        Array.from(gridItems).slice(row * columns, (row + 1) * columns));
    const allGroups = [...rowGroups, ...columnGroups];

    function flashLoop() {
        if (!stillTyping) return;

        if (stopHighlighting) {
            // Check again in 100ms if we can resume
            setTimeout(flashLoop, 100);
            return;
        }

        const shuffledGroups = allGroups.sort(() => 0.5 - Math.random());
        let index = 0;

        function flashNext() {
            if (!stillTyping) return;

            if (stopHighlighting) {
                // Pause flashing, but keep checking every 100ms
                setTimeout(flashLoop, 100);
                return;
            }

            if (index >= shuffledGroups.length) index = 0;

            const group = shuffledGroups[index];
            group.forEach(el => el.classList.add("highlight"));
            setTimeout(() => {
                group.forEach(el => el.classList.remove("highlight"));
                index++;
                setTimeout(flashNext, 75);
            }, 100);
        }

        flashNext();
    }

    console.log("🚀 Flashing started...");
    flashLoop();
}


// UI helpers
function addToInput(letter) {
    document.getElementById("inputField").value += letter;
}

function clearInput() {
    document.getElementById("inputField").value = "";
}

function saveHistory() {
    const text = document.getElementById("inputField").value.trim();
    if (!text) return alert("No text to save!");

    let history = JSON.parse(localStorage.getItem('keyboardHistory') || '[]');
    history.push({ text, date: new Date().toLocaleString() });
    localStorage.setItem('keyboardHistory', JSON.stringify(history));
    alert("Text saved to history!");
    document.getElementById("inputField").value = "";
}

// Page load setup
document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("inputField").value = "";
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => window.location.href = 'login.html');
    }

    const startBtn = document.getElementById("startBtn");
    if (startBtn) {
        startBtn.disabled = true;
        startBtn.addEventListener("click", startSequence);
    }

    checkServerConnection()
        .then(() => console.log("✅ Server is running"))
        .catch(error => {
            console.warn("⚠️ Could not connect to server:", error);
            const warningDiv = document.createElement("div");
            warningDiv.style.background = "rgba(255, 0, 0, 0.7)";
            warningDiv.style.color = "white";
            warningDiv.style.padding = "10px";
            warningDiv.style.position = "fixed";
            warningDiv.style.bottom = "10px";
            warningDiv.style.right = "10px";
            warningDiv.style.borderRadius = "5px";
            warningDiv.textContent = "Warning: Server not connected. Please run run_server.py first.";
            document.body.appendChild(warningDiv);
        });
});
