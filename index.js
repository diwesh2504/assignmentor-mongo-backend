const express=require("express");
const app=express();
const mongodb=require("mongodb");
const mongoClient=mongodb.MongoClient;
const cors=require("cors");
const object_id=mongodb.ObjectID;
app.use(express.json());
app.use(cors());
//db config
//const db_URL="mongodb://localhost:27017";
const db_URL="mongodb+srv://admin:admin123@cluster0.sln75.mongodb.net/assign_mentor?retryWrites=true&w=majority" 

app.post("/addmentor",async (req,res)=>{
    const client=await mongoClient.connect(db_URL);
    try {
        const db=client.db("assign_mentor");
        const entry=await db.collection("mentors").insertOne({...req.body});
        res.status(200).send("Mentor Added");
    } catch (error) {
        res.status(500).send("Couldn't Add Mentor");
    }finally{
        client.close();
    }
})

app.post("/addstudent",async (req,res)=>{
    const client=await mongoClient.connect(db_URL);
    try {
        const db=client.db("assign_mentor");
        const entry=await db.collection("students").insertOne({...req.body,mentor_name:"",mentor_id:""});
        res.status(200).send("Student Added");
    } catch (error) {
        res.status(500).send("Couldn't Add Student");
    }finally{
        client.close();
    }
})

app.get("/getstudents",async (req,res)=>{
    const client=await mongoClient.connect(db_URL);
    try {
        const db=client.db("assign_mentor");
        const get_data=await db.collection("students").find({mentor_name:""}).toArray();
        res.status(200).json(get_data);
    } catch (error) {
        res.status(500).send("Couldn't Get Students");
    }finally{
        client.close();
    }
})
app.get("/getmentors",async (req,res)=>{
    const client=await mongoClient.connect(db_URL);
    try {
        const db=client.db("assign_mentor");
        const get_data=await db.collection("mentors").find({},{_id:1,name:1,dept:0}).toArray();
        res.status(200).json(get_data);
    } catch (error) {
        res.status(500).send("Couldn't Get Mentors");
    }finally{
        client.close();
    }
})
app.post("/assignmentor",async (req,res)=>{
    const client=await mongoClient.connect(db_URL);
    //console.log(req.body);
    try {
        const db=client.db("assign_mentor");
        req.body.forEach(async (s)=>{
            let o_id=new object_id(s.student_id);
            let update=await db.collection("students").updateOne(
                {_id:o_id},
                {$set:{"mentor_name":s.mentor_name,"mentor_id":s.mentor_id}}
                
            )
        })
        res.status(200).send("Mentor Assigned");
    } catch (error) {
        res.status(500).send("Couldn't Assign Mentors");
        //console.log(error);
    }finally{
        client.close();
    }

})
app.get("/getallstudents",async (req,res)=>{
    const client=await mongoClient.connect(db_URL);
    try {
        const db=client.db("assign_mentor");
        const get_data=await db.collection("students").find().toArray();
        res.status(200).json(get_data);
    } catch (error) {
        res.status(500).send("Couldn't Get Students");
    }finally{
        client.close();
    }
})
app.get("/getallmentors",async (req,res)=>{
    const client=await mongoClient.connect(db_URL);
    try {
        const db=client.db("assign_mentor");
        const get_data=await db.collection("mentors").find().toArray();
        res.status(200).json(get_data);
    } catch (error) {
        res.status(500).send("Couldn't Get Mentors");
    }finally{
        client.close();
    }
})
app.post("/changementor", async (req,res)=>{
    const client=await mongoClient.connect(db_URL);
    try {
        const db=client.db("assign_mentor");
        const data=db.collection("students").updateOne(
        {_id:new object_id(req.body.id)},
        {$set:{"mentor_name":req.body.mentor_name,"mentor_id":req.body.mentor_id}}
        )
        res.status(200).send("Mentor Changed");
    } catch (error) {
        res.status(500).send("Couldn't Change Mentor");
        //console.log(error);
    }finally{
        client.close();
    }

})
app.listen(process.env.PORT || 4040, ()=>{
    console.log("Server listening");
})
