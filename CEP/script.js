const form = document.getElementById("itemForm");
const itemGrid = document.getElementById("itemGrid");
const searchInput = document.getElementById("searchInput");
const filterType = document.getElementById("filterType");

let items = JSON.parse(localStorage.getItem("finditItems")) || [];

function saveItems() {
    localStorage.setItem("finditItems", JSON.stringify(items));
}

form.addEventListener("submit", async function(event) {
    event.preventDefault();
    const imageFile = document.getElementById("itemImage").files[0];

let imageData = "";

if (imageFile) {
    imageData = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(imageFile);
    });
}

    const newItem = {
        id: Date.now(),

        type: document.getElementById("type").value,
        name: document.getElementById("itemName").value.trim(),
        category: document.getElementById("category").value,
        location: document.getElementById("location").value.trim(),
        date: document.getElementById("date").value,
        person: document.getElementById("personName").value.trim(),
        description: document.getElementById("description").value.trim(),
        image: imageData,
        status: "Active"
    };

    items.unshift(newItem);
    saveItems();

    document.getElementById("formMessage").textContent =
        "Your report has been submitted successfully!";

    form.reset();
    displayItems();
    displayMyReports();
    updateStats();

    document.getElementById("items").scrollIntoView({
        behavior: "smooth"
    });
});

function displayItems() {
    const search = searchInput.value.toLowerCase();
    const filter = filterType.value;

    const filtered = items.filter(item => {
        const matchesSearch =
            item.name.toLowerCase().includes(search) ||
            item.location.toLowerCase().includes(search) ||
            item.category.toLowerCase().includes(search);

        const matchesType = filter === "All" || item.type === filter;

        return matchesSearch && matchesType;
    });

    itemGrid.innerHTML = "";

    document.getElementById("emptyMessage").style.display =
        filtered.length === 0 ? "block" : "none";

    filtered.forEach(item => {
        const card = document.createElement("div");
        card.className = "item-card";

        const badge = document.createElement("span");
        badge.className = "item-type " +
            (item.type === "Found" ? "found" : "");
        badge.textContent = item.type;

        const title = document.createElement("h3");
        title.textContent = item.name;

        const details = [
            "Category: " + item.category,
            "Location: " + item.location,
            "Date: " + item.date,
            "Reported by: " + item.person,
            "Description: " + item.description,
            "Status: " + item.status
        ];

        card.append(badge, title);
        if (item.image) {
    const img = document.createElement("img");
    img.src = item.image;
    img.style.width = "100%";
    img.style.height = "180px";
    img.style.objectFit = "cover";
    img.style.borderRadius = "10px";
    img.style.marginTop = "12px";
    card.appendChild(img);
}

        details.forEach(detail => {
            const p = document.createElement("p");
            p.textContent = detail;
            card.appendChild(p);
        });

        itemGrid.appendChild(card);
        const claimBtn = document.createElement("button");

claimBtn.textContent = "Claim Item";
claimBtn.className = "primary-btn";

claimBtn.onclick = function() {
    alert("Claim request submitted! Please contact the item reporter.");
};

card.appendChild(claimBtn);
    });
}
function displayMyReports() {
    const myGrid = document.getElementById("myReportsGrid");
    const emptyMessage = document.getElementById("myEmptyMessage");

    myGrid.innerHTML = "";

    emptyMessage.style.display =
        items.length === 0 ? "block" : "none";

    items.forEach(item => {
        const card = document.createElement("div");
        card.className = "item-card";

        const title = document.createElement("h3");
        title.textContent = item.name;

        const type = document.createElement("p");
        type.textContent = "Type: " + item.type;

        const location = document.createElement("p");
        location.textContent = "Location: " + item.location;

        const status = document.createElement("p");
        status.textContent = "Status: " + item.status;

        card.append(title, type, location, status);

        if (item.image) {
            const img = document.createElement("img");
            img.src = item.image;
            img.style.width = "100%";
            img.style.height = "150px";
            img.style.objectFit = "cover";
            card.appendChild(img);
        }
        const deleteBtn = document.createElement("button");

deleteBtn.textContent = "Delete Report";
deleteBtn.className = "primary-btn";

deleteBtn.style.background = "#dc3545";
deleteBtn.style.marginTop = "15px";

deleteBtn.onclick = function() {
    if (confirm("Are you sure you want to delete this report?")) {

        items = items.filter(i => i.id !== item.id);

        saveItems();
        displayItems();
        displayMyReports();
        updateStats();
    }
};

card.appendChild(deleteBtn);
const resolveBtn = document.createElement("button");

resolveBtn.textContent =
    item.status === "Resolved" ? "Resolved ✓" : "Mark as Resolved";

resolveBtn.className = "primary-btn";
resolveBtn.style.background = "#16a34a";
resolveBtn.style.marginTop = "10px";

resolveBtn.disabled = item.status === "Resolved";

resolveBtn.onclick = function() {
    item.status = "Resolved";

    saveItems();
    displayItems();
    displayMyReports();
    updateStats();
};

card.appendChild(resolveBtn);
const editBtn = document.createElement("button");

editBtn.textContent = "Edit Report";
editBtn.className = "primary-btn";
editBtn.style.marginTop = "10px";
editBtn.style.marginRight = "8px";
editBtn.style.background = "#2563eb";

editBtn.onclick = function() {

    const newName = prompt("Enter new item name:", item.name);

    if (newName === null || newName.trim() === "") {
        return;
    }

    const newLocation = prompt("Enter new location:", item.location);

    if (newLocation === null || newLocation.trim() === "") {
        return;
    }

    const newDescription = prompt(
        "Enter new description:", item.description
    );

    if (newDescription === null) {
        return;
    }

    item.name = newName.trim();
    item.location = newLocation.trim();
    item.description = newDescription.trim();

    saveItems();
    displayItems();
    displayMyReports();

    alert("Report updated successfully!");
};

card.appendChild(editBtn);

        myGrid.appendChild(card);
    });
}

function updateStats() {
    document.getElementById("totalItems").textContent = items.length;

    document.getElementById("lostCount").textContent =
        items.filter(item => item.type === "Lost").length;

    document.getElementById("foundCount").textContent =
        items.filter(item => item.type === "Found").length;

    document.getElementById("resolvedCount").textContent =
        items.filter(item => item.status === "Resolved").length;
}

searchInput.addEventListener("input", displayItems);
filterType.addEventListener("change", displayItems);

displayItems();
displayMyReports();
updateStats();