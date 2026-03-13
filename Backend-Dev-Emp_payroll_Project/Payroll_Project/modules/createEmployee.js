import fs from "fs";
function createUser(req, res) {
  try {
    const { name,gender,department,salary,notes  } = req.body;
    const day = req.body.day
    const month =req.body.month
    const year =req.body.year
    let startDate = day+"-"+month+"-"+year
    if (!name || !gender || !department || !salary || !startDate || !notes) {
      return res.status(400).send("All fields are required");
    }
    if(salary<9999){
        return res.status(400).send("salary must be above 9999");
    }
    let id = Date.now();
    let users = [];

    if (fs.existsSync("Employee.json")) {
      const data = fs.readFileSync("Employee.json", "utf-8");
      users = JSON.parse(data);
      const isUser = users.find(a => a.id === id );
      if (isUser) {
        return res.status(409).send("Employee already exists");
      }
    }
    
    const newUser = {
      id,
      name,
      gender,
      department,
      salary,
      startDate,
      notes
    };

    users.push(newUser);

    fs.writeFileSync("Employee.json", JSON.stringify(users, null, 2));

    res.redirect("/");

  } catch (error) {
    console.error(error);
    res.status(500).send("Server error");
  }
}

export default createUser;
