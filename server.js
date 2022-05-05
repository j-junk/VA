const fs = require("fs")

const port = 6789

const express = require("express")
const app = express()
app.use(express.static("public"))
const server = app.listen(port)

console.log(`Webserver is running on port ${port}.`)

const socket = require("socket.io")
const io = socket(server)

io.sockets.on("connection", (socket) => {
    console.log(`Client ${socket.id} connected.`)


let disconnect = () => {
    console.log(`Client ${socket.id} disconnected.`)
}

let visualisation = () => {
    console.log("Received request")
    //const string = 'Visualisation'
    //socket.emit("visualisation", string)
    var json_data = fs.readFileSync("../data_01/Feinstaub_2019.json", "utf8")
    var datafile = JSON.parse(json_data)
    let data = datafile.data
    let keys = Object.keys(data)
    var avgs = {};
    for (let i = 0; i < keys.length; i++){
        let entry = data[keys[i]]
        let keys_of_entry = Object.keys(entry)
        let sum = 0
        for (let j = 0; j < keys_of_entry.length; j++){
            let item = entry[keys_of_entry[j]]
            sum = sum + item[2]
            avg = sum/keys_of_entry.length
            if (avg != 0){
                avgs[i] = {avg};
            }
        }

    }
    socket.emit("visualisation", avgs)
    

}

socket.on("disconnect", disconnect)
socket.on("paint_histogram", visualisation)

})