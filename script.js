const API = "https://phonebook-server-m40k.onrender.com";

const contactsContainer = document.getElementById("contacts");
const form = document.getElementById("contactForm");
const nameInput = document.getElementById("name");
const phoneInput = document.getElementById("phone");

let isEditing = false;
let editingId = null;

// Fetch and render all contacts
async function fetchContacts() {
  try {
    const res = await fetch(`${API}/contacts`);
    const contacts = await res.json();
    contactsContainer.innerHTML = "";
    contacts.forEach(renderContact);
  } catch (error) {
    console.error("Failed to load contacts", error);
  }
}

// Render a contact
function renderContact(contact) {
  const div = document.createElement("div");
  div.className = "contact";
  div.dataset.id = contact.id;

  const info = document.createElement("div");
  info.className = "contact-info";
  info.textContent = `${contact.name}: ${contact.phone}`;

  const actions = document.createElement("div");
  actions.className = "actions";

  const editBtn = document.createElement("button");
  editBtn.textContent = "Edit";
  editBtn.onclick = () => {
    nameInput.value = contact.name;
    phoneInput.value = contact.phone;
    isEditing = true;
    editingId = contact.id;
    form.querySelector("button").textContent = "Update Contact";
  };

  const deleteBtn = document.createElement("button");
  deleteBtn.textContent = "Delete";
  deleteBtn.className = "delete-btn";
  deleteBtn.onclick = async () => {
    try {
      await fetch(`${API}/contacts/${contact.id}`, { method: "DELETE" });
      fetchContacts();
    } catch (err) {
      console.error("Failed to delete contact", err);
    }
  };

  actions.appendChild(editBtn);
  actions.appendChild(deleteBtn);

  div.appendChild(info);
  div.appendChild(actions);

  contactsContainer.appendChild(div);
}

// Handle form submit
form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const name = nameInput.value.trim();
  const phone = phoneInput.value.trim();

  if (!name || !phone) {
    alert("Please fill in both fields.");
    return;
  }

  try {
    if (isEditing) {
      // Update contact
      await fetch(`${API}/contacts/${editingId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, phone })
      });
      isEditing = false;
      editingId = null;
      form.querySelector("button").textContent = "Save Contact";
    } else {
      // Add contact
      await fetch(`${API}/contacts`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, phone })
      });
    }

    form.reset();
    fetchContacts();
  } catch (err) {
    console.error("Failed to save contact", err);
  }
});

// Initial load
fetchContacts();
