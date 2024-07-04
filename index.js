const express = require('express');
const fs = require("fs")
const app = express()
const port = 3000
const UsersData = require("./MOCK_DATA.json");

function FindUserUponEmail(email) {
    return UsersData.filter((user) => {
        return user.email == email
    })
}

function PutUserDetails(userFound, userInfo, res) {

    const id = userFound[0].id

    const newInfo = {
        "id": id,
        "email": `${userInfo.newMail}`,
        "gender": `${userInfo.Ngender}`
    }

    UsersData.splice(id - 1, 1, newInfo);

    nud = JSON.stringify(UsersData);

    fs.writeFile("./MOCK_DATA.json", `${nud}`, (err) => {
        if (err) {
            console.log(err);
        }
    })

}

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get("/", (req, res) => {
    res.status(200).send("Welcome To HomePage Go to User Pages")
}) 

app.get("/user", (req, res) => {
    const view = `
    <ul>
    ${UsersData.map(val => `
        <li>ID: ${val.id}</li>
        <li>Email: ${val.email}</li>
        <li>Gender: ${val.gender}</li>
        <br>
    `).join(" ")}
    </ul>
    `;

    res.status(200).send(view);
    console.log("printed....");
});

app.get("/user/:id", (req, res) => {

    id = req.params.id;

    const foundId = UsersData.find(user => user.id == id);

    if (foundId) {
        const view = `
            <ul>
                <li>ID: ${foundId.id}</li>
                <li>Email: ${foundId.email}</li>
                <li>Gender: ${foundId.gender}</li>
            </ul>
        `;

        console.log(foundId);
        res.status(200).send(view);
    } else {
        console.log("User not found");
        res.status(404).send('User not found');
    }

    console.log("printed....");
});

app.get("/api/user/:id", (req, res) => {

    id = req.params.id;

    const foundId = UsersData.find(user => user.id == id);

    if (foundId) {
        res.status(200).json(foundId);
    } else {
        console.log("User not found");
        res.status(404).send('User not found');
    }

    console.log("printed....");
});

app.get("/api/users", (req, res) => {
    res.status(200).json(UsersData);
    console.log("printed....");
});

app.post("/user", (req, res) => {
    const newUser = req.body;
    const Userid = UsersData.length;

    const newUserInfo = {
        "id": Userid + 1,
        "email": `${newUser.email}`,
        "gender": `${newUser.gender}`
    }

    UsersData.push(newUserInfo);

    var ud = JSON.stringify(UsersData);

    fs.writeFile("./MOCK_DATA.json", `${ud}`, (err) => {
        if (err) console.log(err);
    })

    res.status(201).send("Details Are Entered...!!");

})

app.post("/api/user", (req, res) => {
    const newUser = req.body;
    const Userid = UsersData.length;

    const newUserInfo = {
        "id": Userid + 1,
        "email": `${newUser.email}`,
        "gender": `${newUser.gender}`
    }

    UsersData.push(newUserInfo);

    var ud = JSON.stringify(UsersData);

    fs.writeFile("./MOCK_DATA.json", `${ud}`, (err) => {
        if (err) console.log(err);
    })

    // res.json(ud);
    // or
    res.status(201).json(UsersData);

})

app.put("/user", (req, res) => {
    const userInfo = req.body;
    const Uemail = userInfo.email;

    var userFound = FindUserUponEmail(Uemail);

    if (userFound) {
        PutUserDetails(userFound, userInfo, res);
        res.status(202).send("User Details Updated");
    }
    else {
        res.status(404).send("User not found")
    }
})

app.put("/api/user", (req, res) => {

    const userInfo = req.body;
    const Uemail = userInfo.email;

    var userFound = FindUserUponEmail(Uemail);

    if (userFound) {
        PutUserDetails(userFound, userInfo, res);
        const updated = require("./MOCK_DATA.json")
        res.status(202).json(updated);
    }
    else {
        res.status(404).send("User not found")
    }

})

app.patch("/user", (req, res) => {
    const userInfo = req.body;
    const Uemail = userInfo.email;

    var foundUser = FindUserUponEmail(Uemail);

    if (foundUser.length === 0) {
        return res.status(404).send("User not found");
    }

    // Get the user index in UsersData array
    const userIndex = UsersData.findIndex(user => user.email === Uemail);

    if (userInfo.newMail) {
        foundUser[0].email = userInfo.newMail;
    }
    if (userInfo.gender) {
        foundUser[0].gender = userInfo.Ngender;
    }

    // Update the user in UsersData array
    UsersData[userIndex] = foundUser[0];

    fs.writeFile("./MOCK_DATA.json", JSON.stringify(UsersData), (err) => {
        if (err) {
            console.error(err);
            return res.status(500).send("Error writing to file");
        }
        res.status(202).send("User information updated");
    });
});

app.patch("/api/user", (req, res) => {
    const userInfo = req.body;
    const Uemail = userInfo.email;

    var foundUser = FindUserUponEmail(Uemail);

    if (foundUser.length === 0) {
        return res.status(404).send("User not found");
    }

    // Get the user index in UsersData array
    const userIndex = UsersData.findIndex(user => user.email === Uemail);

    if (userInfo.newMail) {
        foundUser[0].email = userInfo.newMail;
    }
    if (userInfo.gender) {
        foundUser[0].gender = userInfo.Ngender;
    }

    // Update the user in UsersData array
    UsersData[userIndex] = foundUser[0];

    fs.writeFile("./MOCK_DATA.json", JSON.stringify(UsersData), (err) => {
        if (err) {
            console.error(err);
            return res.status(500).send("Error writing to file");
        }
        res.status(202).json(UsersData);
    });
});

app.delete("/user", (req, res) => {
    const userInfo = req.body;
    const Uemail = userInfo.email;

    var foundUser = FindUserUponEmail(Uemail);

    const UserIndex = foundUser[0].id - 1;

    if (UserIndex) {

        const deletedUser = UsersData.splice(UserIndex, 1);
        console.log(deletedUser);

        fs.writeFile("./MOCK_DATA.json", JSON.stringify(UsersData), (err) => {
            if (err) {
                console.log(err);
            }
        })

        res.status(202).send(`${deletedUser[0].email} is Deleted`);
    }

    else {
        res.send("User Index is not found");
    }

});

app.delete("/api/user", (req, res) => {
    const userInfo = req.body;
    const Uemail = userInfo.email;

    var foundUser = FindUserUponEmail(Uemail);

    const UserIndex = foundUser[0].id - 1;

    if (UserIndex) {

        const deletedUser = UsersData.splice(UserIndex, 1);
        console.log(deletedUser);

        fs.writeFile("./MOCK_DATA.json", JSON.stringify(UsersData), (err) => {
            if (err) {
                console.log(err);
            }
        })

        res.json(deletedUser);
    }

    else {
        res.status(202).send("User Index is not found");
    }

})

app.listen(port, (err) => {
    if (err) {
        console.log(err);
    }
})