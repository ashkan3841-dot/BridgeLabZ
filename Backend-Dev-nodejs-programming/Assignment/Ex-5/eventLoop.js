console.log("a");

setTimeout(()=>{
    console.log("Timeout Called");
    
},0);

setImmediate(()=>{
    console.log("Immediate");
})
process.nextTick(()=>{
    console.log("Next Tick");
})
Promise.resolve().then(()=>{
    console.log("Resolved");
})

console.log("b");

