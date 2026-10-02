let items = [];

// Filter furniture cards based on localStorage "room"
function filterFurnitureByRoom() {
    let room = localStorage.getItem("room");
    let cards = document.querySelectorAll(".furniture-card");

    if (cards.length === 0) return;

    cards.forEach(card => {
        let itemRoom = card.getAttribute("data-room");

        // Show card if room matches, or show all if no room was selected yet
        if (!room || itemRoom === room) {
            card.style.display = "block";
        } else {
            card.style.display = "none";
        }
    });
}

// Choose Room (from rooms.html)
function chooseRoom(room) {
    localStorage.setItem("room", room);
    alert(`${room} selected! Redirecting to furniture selection...`);
    window.location.href = "furniture.html";
}

// Add Furniture (from furniture.html)
function addItem(name, price) {
    let savedItems = localStorage.getItem("items");

    if (savedItems) {
        try {
            items = JSON.parse(savedItems);
        } catch (e) {
            items = [];
        }
    } else {
        items = [];
    }

    let numericPrice = typeof price === 'number' 
        ? price 
        : Number(String(price).replace(/[^0-9.]/g, '')) || 0;

    items.push({
        name: name,
        price: numericPrice
    });

    localStorage.setItem("items", JSON.stringify(items));
    alert(`${name} added to your design!`);
}

// Render Data on Page Load
document.addEventListener("DOMContentLoaded", function () {
    loadPageData();
});

function loadPageData() {
    let room = localStorage.getItem("room");
    let savedItems = localStorage.getItem("items");

    if (savedItems) {
        try {
            items = JSON.parse(savedItems);
        } catch (e) {
            items = [];
        }
    } else {
        items = [];
    }

    // Apply room filter to furniture cards
    filterFurnitureByRoom();

    // 1. Show Selected Room on Furniture Page
    let selectedRoomEl = document.getElementById("selected-room");
    if (selectedRoomEl) {
        if (room) {
            selectedRoomEl.textContent = "Selected Room: " + room;
            selectedRoomEl.style.fontWeight = "bold";
            selectedRoomEl.style.marginBottom = "20px";
            selectedRoomEl.style.textAlign = "center";
            selectedRoomEl.style.color = "#386641";
        } else {
            selectedRoomEl.textContent = "No room selected yet.";
        }
    }

    // 2. Show Selected Room on My Design Page
    let roomEl = document.getElementById("room") || document.getElementById("room-display");
    if (roomEl) {
        if (room) {
            if (roomEl.textContent.includes("Room:")) {
                roomEl.textContent = "Room: " + room;
            } else {
                roomEl.textContent = room;
            }
        } else {
            roomEl.textContent = roomEl.textContent.includes("Room:") ? "Room: Not selected" : "Not selected";
        }
    }

    // 3. Render Furniture & Total on My Design Page
    showItems();
}

// Render Selected Items & Calculate Total Amount
function showItems() {
    let box = document.getElementById("items") || document.getElementById("furniture-list");
    if (!box) return;

    box.innerHTML = "";
    let total = 0;

    let countEl = document.getElementById("count");
    if (countEl) {
        countEl.textContent = items.length;
    }

    if (items.length === 0) {
        box.innerHTML = `<p style="color: #777; margin: 15px 0; text-align: center;">No furniture items added yet.</p>`;
    } else {
        items.forEach(function (item, index) {
            total += Number(item.price) || 0;

            let itemRow = document.createElement("div");
            itemRow.className = "item";
            itemRow.style.display = "flex";
            itemRow.style.justifyContent = "space-between";
            itemRow.style.alignItems = "center";
            itemRow.style.padding = "8px 0";
            itemRow.style.borderBottom = "1px solid #eee";

            itemRow.innerHTML = `
                <span>${index + 1}. ${item.name} - ₹${item.price.toLocaleString("en-IN")}</span>
                <button class="remove" onclick="removeItem(${index})" style="background: #e63946; color: #fff; border: none; padding: 4px 8px; border-radius: 4px; cursor: pointer;">
                    Remove
                </button>
            `;
            box.appendChild(itemRow);
        });
    }

    let totalEl = document.getElementById("total") || document.getElementById("total-price");
    if (totalEl) {
        totalEl.textContent = total.toLocaleString("en-IN");
    }
}

// Remove Individual Item
function removeItem(index) {
    items.splice(index, 1);
    localStorage.setItem("items", JSON.stringify(items));
    showItems();
}

// Save Design
function saveDesign() {
    let room = localStorage.getItem("room");

    if (!room && items.length === 0) {
        alert("Please choose a room or select furniture first.");
        return;
    }

    let timestamp = new Date().toLocaleString("en-IN");
    localStorage.setItem("savedDesign", timestamp);

    alert(`Your design was saved successfully on ${timestamp}!`);
}

// Clear Design
function clearDesign() {
    localStorage.removeItem("items");
    localStorage.removeItem("room");
    localStorage.removeItem("savedDesign");
    items = [];

    loadPageData();
}