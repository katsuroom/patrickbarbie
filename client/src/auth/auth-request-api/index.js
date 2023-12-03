// const baseURL = 'http://localhost:4000/auth';
// const baseURL = "https://patrick-barbie-f64046e3bb4b.herokuapp.com/auth";

const baseURL = process.env.NODE_ENV == "development" ? "http://localhost:4000/auth" : "https://patrick-barbie-f64046e3bb4b.herokuapp.com/auth";

// Function to perform a login request
const loginUser = (email, password) => {
  return fetch(`${baseURL}/login/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: localStorage.getItem("token"),
    },
    body: JSON.stringify({
      email: email,
      password: password,
    }),
  }).then((response) => {
    // Parse JSON and include status in the resolved value
    return response.json().then((data) => ({ status: response.status, data }));
  });
};

// Function to perform a registration request
const registerUser = (username, email, password) => {
  return fetch(`${baseURL}/register/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      // "Authorization": localStorage.getItem("token"),
    },
    body: JSON.stringify({
      username: username,
      email: email,
      password: password,
    }),
  }).then((response) => {
    // Parse JSON and include status in the resolved value
    return response.json().then((data) => ({ status: response.status, data }));
  });
};

const getLoggedIn = () => {
  console.log("in api.");
  console.log("token: ", JSON.parse(localStorage.getItem("user"))?.data?.token);
  let token = JSON.parse(localStorage.getItem("user"))?.data?.token;

  return fetch(`${baseURL}/loggedIn/`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: token,
    },
    // credentials: "include",
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error(`Failed to create map. Status: ${response.status}`);
      }
      return response.json();
    })
    .then((data) => {
      console.log(data);
      return { status: 200, data }; // Assuming 200 for success, modify as needed
    });
};

const logoutUser = () => {
  return fetch(`${baseURL}/logout/`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    // credentials: "include",
  })
    .then((response) => {
      console.log("response: " + response);
      return {
        status: response.status,
      };
    })
    .catch((error) => {
      console.log("Error logging out: " + error);
      return {
        message: "Error logging out: " + error,
      };
    });
};


const getHashedPassword = (email) => {
  return fetch(`${baseURL}/hashedPw?email=${email}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    // credentials: "include",
  })
    .then((response) => {
      return response.json().then((data) => ({ status: response.status, PwHash: data.data }));
    })
    .catch((error) => {
      console.log("Error getHashedPassword: " + error);
      return {
        message: "Error getHashedPassword: " + error,
      };
    });
}

const sendPasswordRecoveryEmail = async (email) =>{

  if (!email){
    return {status: 400,
      message: "You have to provide email"}
  }
  console.log(await getHashedPassword(email));
  const hashedPassword = (await getHashedPassword(email)).PwHash;

  if (!hashedPassword){
    return {status: 404,
    message: "User Not Found"}
  }
  

  return fetch(`${baseURL}/sendPasswordRecoveryEmail?email=${email}&PwHash=${hashedPassword}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    // credentials: "include",
  })
    .then((response) => {
      console.log("response: " + response);
      return {
        status: response.status
      };
    })
    .catch((error) => {
      console.log("Error sendPasswordRecoveryEmail: " + error);
      return {
        status: 404,
        message: "Error sendPasswordRecoveryEmail: " + error
      };
    });
}

const setNewPassword = function (email, newPassword){
  if (!email || !newPassword){
    return {status: 400,
      message: "You have to provide email and new password"}
  }

  return fetch(`${baseURL}/setNewPassword?email=${email}&newPassword=${newPassword}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    // credentials: "include",
  })
    .then((response) => {
      console.log("response: " + response);
      return {
        status: response.status
      };
    })
    .catch((error) => {
      console.log("Error setNewPassword: " + error);
      return {
        status: 404,
        message: "Error setNewPassword: " + error
      };
    });

  

}



export default {
  loginUser,
  registerUser,
  getLoggedIn,
  logoutUser,
  getHashedPassword,
  sendPasswordRecoveryEmail,
  setNewPassword
};
