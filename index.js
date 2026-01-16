//1Hello world
console.log("Node Js Backend Started");

//2variables
let name = "John Doe"; //String
let age =20; //number
const country = "India"; // constant
let isStudent = true; // bollean

console.log(name);
console.log(age);
console.log(country);
console.log(isStudent);

//3data types
let score; //undefined
let data = null; //null

console.log(score);
console.log(data);

//object
let user = {
    name:"rahul",
    age:25,
    email:"user@gmail.com"
};

console.log(user);
console.log(user.name);

//Operators
let a = 10;
let b = 5;
 console.log("Addition:", a + b);
 console.log("Subtraction:", a - b);
 console.log("Multiplication:", a * b);
 console.log("Division:", a / b);

 //conditional statements
 let loginAge = 18;
 if(loginAge >= 18){
    console.log("User is eligible to login");
 } else {
    console.log("User is not eligible to login");
 }

 //loop(for loop)
    for(let i = 1; i <= 5; i++){
        console.log("Iteration:", i);
    }
//function
function add(x, y){
    return x + y;
}

let result = add(10, 20);
console.log("Addition Result:", result);

//Simple Backend Login
const admin = {
    username: "admin",
    password: "password123" 
};

function login(user,pass){
    if(user === admin.username && pass=== admin.password){
        console.log("login Sucess");
        
    }
    else{
        console.log("Invalid username or password");
        
    }
}

let loginResult = login("admin","password");
 console.log(loginResult);
 