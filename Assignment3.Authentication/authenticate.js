function authenticateUser(req, res) {
  return new Promise((resolve, reject) => {
      const body = [];

      req.on('data', (chunk) => {
          body.push(chunk);
      });

      req.on('end', async () => {
          const parsedBody = Buffer.concat(body).toString();
          if (!parsedBody) {
              reject("Please enter your username and password");
          }

          const loginDetails = JSON.parse(parsedBody);

          const users = await getAllUsers();
          const userFound = users.find(user => user.username === loginDetails.username && user.password === loginDetails.password);

          if (!userFound) {
              reject("Username or password incorrect");
          }

          resolve(userFound)

      });
  })
}

