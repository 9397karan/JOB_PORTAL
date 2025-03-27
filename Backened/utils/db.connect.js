import mongoose from "mongoose"

async function dbConnect(){
    await mongoose.connect('mongodb://localhost:27017/')
    .then(()=>console.log('db connected'))
    .catch((err)=>console.log(`Error in connecting db ${err}`));
}

export default dbConnect;