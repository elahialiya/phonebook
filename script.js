const API = "https://phonebook-server-m40k.onrender.com";
 

const loader = document.getElementById("loader");
const form = document.getElementById("saveForm");
const updateForm = document.getElementById("updateForm");
let contactsData = [];
let contactId = "";


// saving number 
form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const fullName = document.getElementById("fullName").value.trim();
  const phoneNumber = document.getElementById("phoneNumber").value.trim();
  loader.style.display = "block";

  try {
    const res = await fetch(`${API}/api/save/contact`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ fullName, phoneNumber }),
    });
    if (res) {
      const data = await res.json();
      alert(data.message);
      getAllContacts();
      document.querySelector("form").reset();
    }
  } catch (error) {
    console.error(error);
    alert(error.message);
  } finally {
    loader.style.display = "none";
  }
});

const showContacts = document.getElementById("showContacts");
const contacts = document.getElementById("contacts");
showContacts.addEventListener("click", getAllContacts);


// fetching all contacts 
async function getAllContacts() {
  try {
    const res = await fetch(API + "/api/all/contacts");
    const data = await res.json();
    contacts.innerHTML = "";
    data.forEach((element) => {
      contacts.innerHTML += `<li>
      ${element.fullName} <br> ${element.phoneNumber}
       <span onclick="editFunction('${element._id}')">Edit</span>
        <span onclick="deleteContact('${element._id}')" class="del">Delete</span>
        </li>`;
    });

    contactsData = data;
  } catch (error) {
    console.error(error);
    alert(error.message);
  }
}

function editFunction(id) {
  contactId = id;
  const data = contactsData.find((item) => item._id === id);
  form.style.display = "none";
  updateForm.style.display = "block";
  document.getElementById("updateName").value = data.fullName;
  document.getElementById("updateNumber").value = data.phoneNumber;
}


// edit contact details 
updateForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const fullName = document.getElementById("updateName").value;
  const phoneNumber = document.getElementById("updateNumber").value;
  loader.style.display = "block";
  loader.textContent = "UPDATING...";

  try {
    const res = await fetch(`${API}/api/update/contact/${contactId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ fullName, phoneNumber }),
    });
    if (res) {
      const data = await res.json();
      alert(data.message);
      getAllContacts();
      form.style.display = "block";
      updateForm.style.display = "none";
      document.getElementById("updateForm").reset();
    }
  } catch (error) {
    console.error(error);
    alert(error.message);
  } finally {
    loader.style.display = "none";
  }
});


// delete contact 
async function deleteContact(delId) {
  try {
    const res = await fetch(`${API}/api/delete/contact/${delId}`, {
      method: "DELETE",
    });
    if (res) {
      const data = await res.json();
      alert(data.message);
      getAllContacts();
    }
  } catch (error) {
    console.error(error);
    alert(error.message);
  }
}