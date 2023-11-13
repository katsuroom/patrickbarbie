import apis from "../auth/auth-request-api";

describe("Auth Test", () => {
  let username, email, password;
  it("register a new account", async () => {
    var currentdate = new Date();
    username =
      "Test User: " +
      currentdate.getDate() +
      "/" +
      (currentdate.getMonth() + 1) +
      "/" +
      currentdate.getFullYear() +
      " @ " +
      currentdate.getHours() +
      ":" +
      currentdate.getMinutes() +
      ":" +
      currentdate.getSeconds();

    email = Date.now() + "@gmail.com";
    password = "Asdfghjkl;'!";
    const response = await apis.registerUser(username, email, password);
    expect(response.status).toEqual(200);
  });

  it("log in account", async () => {
    const response = await apis.loginUser(email, password);

    expect(response.status).toEqual(200);
  });
});
