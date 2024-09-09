const express = require("express");
const mysql = require("mysql2");
const bcrypt = require("bcrypt");

const app = express();

app.use(express.json());

const dbOptions = {
  user: "root",
  host: "localhost",
  password: "root",
  database: "ganimitedb",
};

const db = mysql.createConnection(dbOptions);

db.connect((err) => {
  if (err) {
    console.error("Error connecting to MySQL:", err);
  }
  console.log("Connected to MySQL database.");
});



app.get("/", async (req, res) => {
  const sql = "SELECT * FROM users";
  db.query(sql, (err, result) => {
    
    if (err) {
      console.error("This is an error: ", err); 
      res.status(500).send("An error occurred"); 
    } else {
      res.send(result); 
    }
  });
});

app.post("/create", async (req, res) => {
  const { email, username, password } = req.body;
  const create_date = new Date();
  const saltRounds = 10;
  const hash_password = await bcrypt.hash(password, saltRounds);

  const sql =
    "INSERT INTO users (email,username,password,create_date) VALUES (?, ?,?,?)";

  db.query(sql, [email, username, hash_password, create_date], (err, result) => {
    if (err) {
      if (err.code === "ER_DUP_ENTRY") {
        return res.status(409).send("Duplicate entry");
      } else if (err.code === "ER_BAD_FIELD_ERROR") {
        return res.status(400).send("Bad field error");
      } else {
        console.error("An error occurred:", err);
        return res.status(500).send("An error occurred");
      }
    }
    res.send("Values inserted");
    console.log(" Email : %s \n Username : %s \n Password : %s \n",email,username,hash_password)
  });
});

app.post("/delete", async (req, res) => {
  const id = req.body.id;
  const delete_sql = "DELETE FROM users WHERE id = ?";
  const checkid = "SELECT * FROM users WHERE id = ?";
  db.query(checkid, [id], (err, result) => {
    if (err) {
      console.log(err);
      return res.status(500).send("Database error");
    }
    if (result.length === 0) {
      return res.status(404).send("user not found");
    } else {
      db.query(delete_sql, [id], (err, result) => {
        if (err) {
          console.error("It's happen again!!", err);
          res.send(err);
        } else {
          res.send("Values Deleted");
          console.log("Delete user_id : ",id)
        }
      });
    }
  });
});

app.post("/update_username", async (req, res) => {
  const { id, username } = req.body;
  const update_username_Sql = "UPDATE users SET username = ? WHERE id = ?";
  const checkid = "SELECT * FROM users WHERE id = ?";
  db.query(checkid, [id], (err, result) => {
    if (err) {
      console.log(err);
      return res.status(500).send("Databese Error");
    }
    if (result.length === 0) {
      return res.status(404).send("User not found");
    } else {
      db.query(update_username_Sql, [username, id], (err, result) => {
        if (err) {
          console.log(err);
          res.send(500).send("UPDATE ERROR");
        } else {
          res.send("username updated successfully");
        }
      });
    }
  });
});

app.post("/update_email", async (req, res) => {
  const { id, username } = req.body;
  const update_email_Sql = "UPDATE users SET email = ? WHERE id = ?";
  const checkid = "SELECT * FROM users WHERE id = ?";
  db.query(checkid, [id], (err, result) => {
    if (err) {
      console.log(err);
      return res.status(500).send("Databese Error");
    }
    if (result.length === 0) {
      return res.status(404).send("User not found");
    } else {
      db.query(updateSql, [username, id], (err, result) => {
        if (err) {
          console.log(err);
          res.send(500).send("UPDATE ERROR");
        } else {
          res.send("email updated successfully");
        }
      });
    }
  });
});

app.listen(3030, () => {
  console.log("Server is running on port 3002");
});
