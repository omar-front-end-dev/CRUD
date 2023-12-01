class User {
      constructor(name, email, role) {
        this.name = name;
        this.email = email;
        this.role = role;
      }
    
      updateInfo(username, email, role) {
        this.name = username;
        this.email = email;
        this.role = role;
      }
    }
    
    class localStorageHandler {
        constructor(key) {
          this.key = key;
        }
      
        loadData() {
          return JSON.parse(localStorage.getItem(this.key));
        }
      
        saveData(data) {
          localStorage.setItem(this.key, JSON.stringify(data));
        }
      }

    class App {
      constructor() {
        this.usersStorageHandler = new localStorageHandler("users");
    
        this.users = this.usersStorageHandler.loadData() || [];
    
        this.users = this.users.map((user) => {
          return new User(user.name, user.email, user.role);
        });
    
        this.displayUsers(this.users);
        this.addEventsToApp();
        this.isUpdating = false;
        this.userToUpdate;
    
      }
    
      addUser(name, email, role) {
        const userObj = this.users.find((user) => user.name === name);
        if (userObj) {
          console.log("User already added");
          return;
        }
    
        const newUser = new User(name, email, role);
        console.log(newUser);
        this.users.push(newUser);
        this.usersStorageHandler.saveData(this.users);
        this.displayUsers(this.users);
      }
    
      removeUser(username) {
        this.users = this.users.filter((user) => user.name !== username);
        this.usersStorageHandler.saveData(this.users);
        this.displayUsers(this.users);
      }
    
      updateUserInfo(username, newUsername, newEmail, newRole) {
        const user = this.users.find((user) => user.name === username);
        user.updateInfo(newUsername, newEmail, newRole);
        this.usersStorageHandler.saveData(this.users);
        this.displayUsers(this.users);
      }
    
      displayUsers(data) {
        const usersCont = document.querySelector(".users-container");
    
        let elements = "";
        data.forEach((user) => {
          elements += `
          <tr class="user">
            <th class="username">${user.name}</th>
            <td>${user.email}</td>
            <td>${user.role}</td>
            <td><button class="btn btn-danger delete-btn" data-id="${user.name}">Delete</button></td>
            <td><button class="btn btn-info update-btn" data-id="${user.name}">Update</button></td> 
          </tr>
          `;
        });
        usersCont.innerHTML = elements;
      }
    
      addEventsToApp() {
        const addUserBtn = document.querySelector(".add-user-btn");
        const updateUserBtn = document.querySelector(".update-user-btn");
        const usernameInput = document.querySelector("#user-name-input");
        const emailInput = document.querySelector("#user-email-input");
        const roleInput = document.querySelector("#user-role-input");
        const form = document.querySelector(".edit-user-form");
        const searchInp = document.querySelector(".user-search__input");
    
        addUserBtn.addEventListener("click", (e) => {
          e.preventDefault();
          this.addUser(usernameInput.value, emailInput.value, roleInput.value);
          form.reset();
        });
    
        updateUserBtn.addEventListener("click", (e) => {
          e.preventDefault();
          this.updateUserInfo(
            this.userToUpdate,
            usernameInput.value,
            emailInput.value,
            roleInput.value
          );
          form.reset();
          this.isUpdating = false;
          this.toggleUpdateBtn();
        });
    
        document.addEventListener("click", (e) => {
          const isDeleteBtn = e.target.classList.contains("delete-btn");
          const isUpdateBtn = e.target.classList.contains("update-btn");
    
          if (isDeleteBtn) {
            this.handleDeleteBtn(e.target);
          } else if (isUpdateBtn) {
            this.handleUpdateBtn(e.target);
          }
        });
    
        searchInp.addEventListener("input", (e) => {
          this.searchInpHandler(e);
        });
    
        logoutBtn.addEventListener('click', () => {
          localStorage.removeItem('loggedInUser')
          location.href = '/login.html'
        })
      }
    
      handleDeleteBtn(btn) {
        const username = btn.dataset.id;
        this.removeUser(username);
      }
    
      handleUpdateBtn(btn) {
        const username = btn.dataset.id;
        const userObj = this.users.find((user) => user.name === username);
        const usernameInput = document.querySelector("#user-name-input");
        const emailInput = document.querySelector("#user-email-input");
        const roleInput = document.querySelector("#user-role-input");
    
        usernameInput.value = userObj.name;
        emailInput.value = userObj.email;
        roleInput.value = userObj.role;
    
        this.isUpdating = true;
        this.userToUpdate = userObj.name;
        this.toggleUpdateBtn();
      }
    
      toggleUpdateBtn() {
        const addUserBtn = document.querySelector(".add-user-btn");
        const updateUserBtn = document.querySelector(".update-user-btn");
    
        if (this.isUpdating) {
          addUserBtn.classList.add("d-none");
          updateUserBtn.classList.remove("d-none");
        } else {
          addUserBtn.classList.remove("d-none");
          updateUserBtn.classList.add("d-none");
        }
      }
    
      searchInpHandler(e) {
        const nameToSearch = e.target.value;
    
        const searchedUsers = this.users.filter((user) =>
          user.name.toLowerCase().includes(nameToSearch.toLowerCase()) ||
          user.role.toLowerCase().includes(nameToSearch.toLowerCase()) ||
          user.email.toLowerCase().includes(nameToSearch.toLowerCase()) 
        );
        this.displayUsers(searchedUsers);
      }
    }

    const app = new App();