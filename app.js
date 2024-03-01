const express = require("express");
const cors = require("cors");
const Port ={
    Port: process.env.PORT,
    folder: process.env.ROOT_FOLDER
};

const app = express();
const morgan = require("morgan");



// middleware
app.use(express.json());
app.use(cors({ origin: '*' }));
app.use(express.urlencoded({ extended: true }));
app.use(express.urlencoded({ extended: true }));
app.use(morgan("combined"));
app.use(express.urlencoded({ extended: true }));


const MasterRouter = require('./router/masterRouter')
const PointRouter = require("./router/point_router")
const UserRouter = require("./router/user-router")
const FileRouter = require("./router/file-router")
const ReplicaseRouter = require('./router/replicase-router')

app.use("/api/point", PointRouter);
app.use("/api/user", UserRouter)
app.use("/api/file", FileRouter)
app.use("/api/rep", ReplicaseRouter)
app.use("/api/master",MasterRouter)

app.listen(Port.Port, () => {
    console.log('Server running on port http://localhost:' + Port.Port);
});



