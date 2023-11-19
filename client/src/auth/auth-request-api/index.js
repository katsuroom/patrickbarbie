/*
    This is our http api for all things auth, which we use to 
    send authorization requests to our back-end API. Note we`re 
    using the Axios library for doing this, which is an easy to 
    use AJAX-based library. We could (and maybe should) use Fetch, 
    which is a native (to browsers) standard, but Axios is easier
    to use when sending JSON back and forth and it`s a Promise-
    based API which helps a lot with asynchronous communication.
    
    @author McKilla Gorilla
*/
const baseURL = 'http://localhost:4000/auth';

// Helper function for handling JSON responses
const handleJsonResponse = (response, data) => {
    console.log("handleJsonResponse");
    console.log(response.json());
    // console.log(data);
  return response.json();
};

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

export default {
  loginUser,
  registerUser,
};
