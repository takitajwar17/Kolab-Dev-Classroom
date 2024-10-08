import mongoose from 'mongoose';

let initialized=false;

export const cnnect= async()=>{
    mongoose.set('strictQuery,true');

    if(initialized){
        console.log('Mongodb already connected')
        return;
    }

    try{
        await mongoose.connect(process.env.MONGODB_URI,{
              dbName:'Kolab_Classsroom',
              useNewUrlParser: true,
              useUnifiedTopology: true,
        });
        console.log('Mongodb connected');
    }catch(error){
        console.log("Mongodb connection error: ",error);
    }

}