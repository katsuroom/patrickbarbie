const baseURL = 'http://localhost:4000/auth';
// const baseURL = 'https://patrick-barbie-f64046e3bb4b.herokuapp.com/' + "auth"

// Function to perform a login request
const loginUser = (email, password) => {
  return fetch(`${baseURL}/login/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email: email,
      password: password,
    }),
  })
  .then(response => {
    // Parse JSON and include status in the resolved value
    return response.json().then(data => ({ status: response.status, data }));
  })
};
 
// Function to perform a registration request
const registerUser = (username, email, password) => {
  return fetch(`${baseURL}/register/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      username: username,
      email: email,
      password: password,
    }),
  })
  .then(response => {
    // Parse JSON and include status in the resolved value
    return response.json().then(data => ({ status: response.status, data }));
  })
};

// const getLoggedIn = () => {

//   return fetch(`${baseURL}/loggedIn/`, {
//     method: "GET",
//     headers: {
//       "Content-Type": "application/json",
//     },
//     // credentials: "include",
//   })
//     .then((response) => {
//       const contentType = response.headers.get("content-type");
//       if (!contentType || !contentType.includes("application/json")) {
//         throw new Error("Unexpected response content type");
//       }
//       return response.json().then((data) => ({ status: response.status, data }));
//     });
// };

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
}

export default {
  loginUser,
  registerUser,
  // getLoggedIn,
  logoutUser

};

