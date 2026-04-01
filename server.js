require('dotenv').config();
const express = require('express');
const multer = require('multer');
const fetch = require('node-fetch');

const upload = multer({ dest: 'uploads/' });
const app = express();
app.use(express.json());

app.post('/ai', async (req,res)=>{
 const {cc,va,iop} = req.body;

 try{
  const response = await fetch("https://api.openai.com/v1/chat/completions",{
    method:"POST",
    headers:{
      "Authorization":"Bearer " + process.env.OPENAI_API_KEY,
      "Content-Type":"application/json"
    },
    body: JSON.stringify({
      model:"gpt-4o-mini",
      messages:[
        {
          role:"system",
          content:"You are an ophthalmology assistant. Be concise, structured, and clinically relevant."
        },
        {
          role:"user",
          content:`CC: ${cc}
VA: ${va}
IOP: ${iop}

Return:
1. Top 3 differentials (ranked)
2. Key concerns
3. Recommended tests
4. Plan`
        }
      ],
      temperature:0.2
    })
  });

  const data = await response.json();
  const result = data.choices?.[0]?.message?.content || "No response";

  res.json({result});

 }catch(e){
  res.json({result:"AI error"});
 }
});

app.post('/image', upload.single('image'), (req,res)=>{
 res.json({result:"Image uploaded. Future: OCT/fundus AI analysis."});
});

app.use(express.static('.'));
app.listen(3000, ()=>console.log("V20 running"));
