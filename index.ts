import express from "express"
import { appDataSource } from "./db";
import "reflect-metadata"

const app = express();

const port =3000;

app.listen(port,()=>{
    console.log("Corriendo")
})

appDataSource.initialize()
    .then(()=>{
        console.log("Base Conectada")
    })
    .catch((error)=>{
        console.log(error)
    })