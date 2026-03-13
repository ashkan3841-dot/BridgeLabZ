import fs from  "fs"
function updateUser(req, res) {
  try {
    let id = req.params.id;
    id = Number(id.slice(1));
    console.log(id);
    const { name,department,salary,gender,notes,day,month,year } = req.body;  
    console.log(req.body);
    let startDate = `${day}-${month}-${year}`;

    if (!id || !department || !name || !salary || !gender || !startDate || !notes) {
      return res.status(400).send("ID, email, and name are required");
    }
    
    if (!fs.existsSync("Employee.json")) {
      return res.status(404).send("No users found");
    }

    const users = JSON.parse(fs.readFileSync("Employee.json", "utf-8"));

    const userIndex = users.findIndex(user => user.id == id);

    if (userIndex === -1) {
      return res.status(404).send("Employee not found");
    }

    // Update user data name and email
    users[userIndex].department = department;
    users[userIndex].name = name;
    users[userIndex].salary = salary;
    users[userIndex].gender = gender;
    users[userIndex].startDate = startDate;
    users[userIndex].notes = notes;

    // Save back to file
    fs.writeFileSync("Employee.json", JSON.stringify(users, null, 2));

    res.redirect("/");

  } catch (error) {
    console.error(error);
    res.status(500).send("Server error");
  }
}

export default updateUser