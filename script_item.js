// TODO #4.0: Change this IP address to EC2 instance public IP address when you are going to deploy this web application
const backendIPAddress = "127.0.0.1:3000";

let itemsData;

// TODO #2.1: Edit group number
const getGroupNumber = () => {
  return 37;
};

// TODO #2.2: Show group members
const showGroupMembers = async () => {
  const member_list = document.getElementById("member-list");
  member_list.innerHTML = "";
  const member_dropdown = document.getElementById("name-to-add");
  member_dropdown.innerHTML =
    "<option value='0'>-- เลือกผู้ฝากซื้อ --</option>";
  const options = {
    method: "GET",
    credentials: "include",
  };
  await fetch(`http://${backendIPAddress}/items/members`, options)
    .then((response) => response.json())
    .then((data) => {
      const members = data;
      members.map((member) => {
        member_list.innerHTML += `
          <li>${member.full_name}</li>
          `;
        member_dropdown.innerHTML += `<option value="${member.full_name}">${member.full_name}</option>`;
      });
    })
    .catch((error) => console.error(error));
};

// TODO #2.3: Send Get items ("GET") request to backend server and store the response in itemsData variable
const getItemsFromDB = async () => {
  console.log(
    "This function should fetch 'get items' route from backend server."
  );
  const options = {
    method: "GET",
    credentials: "include",
  };
  await fetch(`http://${backendIPAddress}/items`, options)
    .then((response) =>  response.json())
    .then((data)=>{
      itemsData=data;
    })
    .catch((error) => console.error(error));
};

// TODO #2.4: Show items in table (Sort itemsData variable based on created_date in ascending order)
const showItemsInTable = (itemsData) => {
  const table_body = document.getElementById("main-table-body");
  table_body.innerHTML = "";
  itemsData.sort((item1,item2) => item1.created_date.toString().localeCompare(item2.created_date.toString()));
  itemsData.map((item) => {
    table_body.innerHTML += `
        <tr id="${item.item_id}">
            <td>${item.item}</td>
            <td>${item.name}</td>
            <td>${item.price}</td>
            <td><button class="delete-row" onclick="deleteItem('${item.item_id}')">ลบ</button></td>
        </tr>
        `;
  });
};

// TODO #2.5: Send Add an item ("POST") request to backend server and update items in the table
const addItem = async () => {
  const item = document.getElementById("item-to-add").value;
  const name = document.getElementById("name-to-add").value;
  const price = document.getElementById("price-to-add").value;

  const options = {    
    method: "POST",    
    credentials: "include",    
    headers: {      
      Accept: "application/json",      
      "Content-Type": "application/json",     
    },    
    body: JSON.stringify({ item, name, price }),  
  };

  await fetch(`http://${backendIPAddress}/items`, options)
    .catch((error) => console.error(error));

  console.log(
    "This function should fetch 'add item' route from backend server and update items in the table."
  );

  await getItemsFromDB()
  showItemsInTable(itemsData);
};

// TODO 2.6: Send Delete an item ("DELETE") request to backend server and update items in the table
const deleteItem = async (item_id) => {
  console.log(
    "This function should fetch 'delete item' route in backend server and update items in the table."
  );

  const options = {
    method: "DELETE",
    credentials: "include",
  };

  await fetch(`http://${backendIPAddress}/items/` + item_id, options)
    .catch((error) => console.error(error));

  await getItemsFromDB()  
  showItemsInTable(itemsData);
};

const redrawDOM = () => {
  window.document.dispatchEvent(
    new Event("DOMContentLoaded", {
      bubbles: true,
      cancelable: true,
    })
  );
  document.getElementById("item-to-add").value = "";
  document.getElementById("name-to-add").value = "0";
  document.getElementById("price-to-add").value = "";
};

document.getElementById("group-no").innerHTML = getGroupNumber();

document.addEventListener("DOMContentLoaded", async function (event) {
  console.log("Showing group members.");
  await showGroupMembers();
  console.log("Showing items from database.");
  await getItemsFromDB();
  showItemsInTable(itemsData);
});
