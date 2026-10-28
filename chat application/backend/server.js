require('dotenv').config();

const express=require('express');
const cors=require('cors');
const http=require('http');

const connectDB=require('./config/db');
const userRoutes=require('./routes/userRoutes');
const messageRoutes=require('./routes/messageRoutes');
const conversationRoutes=require('./routes/conversationRoutes');

const setupSocket=require('./socket');

const app=express();
const server=http.createServer(app);

connectDB();


app.use(cors());
app.use(express.json());

app.use('/api/users',userRoutes);
app.use('/api/messages',messageRoutes);
app.use('/api/conversations',conversationRoutes);

setupSocket(server);

const PORT=process.env.PORT||5000;

server.listen(PORT,()=>{
    console.log(`Server running on port ${PORT}`);
});