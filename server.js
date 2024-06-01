var express = require('express') // import express
var cors = require('cors')
var app = express();
const User=require('./models/user')
const auth=require('./routes/auth')
app.use(cors());
const mongoose = require('mongoose');
mongoose
.connect('mongodb+srv://Preethi:Sl7w70g8SGW4Su1v@cluster0.pppeqsv.mongodb.net/Book-Recommendation')
.then(()=>console.log("Connected to MongoDB"));

const bookschema = new mongoose.Schema({
    title: {type:String, required:true},
    author: {type:String, required:true},
    description: {type:String, required:true},
    genre: {type:String,required:true},
    imageUrl: {type:String,required:true}
});
app.use(express.json())
app.get("/api",async (req,res)=>{
    const Book = await Books.find();
    res.json(Book);
});

app.use('/api/auth',auth);

app.get('/api/:id', async (req, res) => {
    try {
        const Book = await Books.findById(req.params.id);
        if (!Book) {
            return res.status(404).json({ message: 'Book not found' });
        }
        res.json(Book);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});
const Books = mongoose.model('Books',bookschema);
app.post('/api', async (req, res) => {
    console.log('Request Body:', req.body); // Log the request body for debugging
    try {
        const newBooks = new Books(req.body);
        await newBooks.save();
        console.log("Books created successfully");
        res.status(201).json(newBooks);
    } catch (error) {
        console.error('Error creating books:', error);
        res.status(400).json({ message: error.message });
    }
});


app.put('/api/:id', async(req, res) => {
    let _id = req.params.id;
    console.log(_id);
    const itemToUpdate = await Books.findByIdAndUpdate(_id,req.body);
    if(!itemToUpdate) return res.status(404).send("not found");
    res.send("modified")
});

app.delete('/api/:id', async (req, res) => {
        let _id = req.params.id;
        // console.log(_id);
        const deletedItem = await Books.findByIdAndDelete(_id);

        if (!deletedItem) return res.status(404).send("not found");
        res.send("deleted");  
});
app.listen(3001, ()=>{
    console.log('Server is running on port 3001');
})