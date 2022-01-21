const express = require("express");
const fs = require("fs");
const router = express.Router();

let readFilePromise=(dataPath)=>{
  return new Promise((resolve,reject)=>{
    fs.readFile(dataPath,"utf8",(err,data)=>{
      if (err) reject (err)
      else resolve (JSON.parse(data))
    })
    
  })
}

router.get("/page",(req,res)=>{
  res.render("dramas.html")
})

router.get("/list",async(req,res)=>{
  
  try{
    let data=await readFilePromise("./models/sample2.json")
    
    let type=req.query.type
    if(type==="全"){
      res.json({result:data})
    }else{
      let filterData=data.filter(ele=>ele["category"]===type)
      res.json({result:filterData})
    }

  }catch(err){
    console.log(err)
  }
})



// let readFilePromise=(dataPath)=>{
//   return new Promise((resolve,reject)=>{
//     let data=fs.readFile(dataPath,"utf8",(err,data)=>{
//       if (err) reject (err)
//       else resolve (JSON.parse(data))
//     })
//   })
// }
// // /dramas/page --> 回傳 dramas.html
// router.get("/page" , (req,res)=>{
//   res.render("dramas.html");
// }); 

// router.get("/list" , async (req,res)=>{   

//   try {
//     let data = await readFilePromise("./models/sample2.json");
//     let type = req.query.type;
    
//     // 過濾資料
//     if( type === "全"){
//       res.json({ result : data });
//     }else{
//       let filteredData = data.filter( ele => ele["category"] === type );
//       res.json({ result : filteredData });
//     };

//   } catch (err){
    
//     console.log(err);
//     res.status(500).json({ message: "系統有問題！"});
//   };
// });

router.post("/data" , async (req,res) =>{  // API 佳 ！！！
// router.post("/CreateNewDramaData" , async (req,res)=>{ // API 不佳
  try{
    // 取得前端傳來 Form Data 的參數值
    // console.log("req.body:",req.body);
    let payload = req.body;
    console.log(payload["category"]);
    console.log(payload["name"]);

    // 將 req.body (Form Data) 寫入到 sample2.json 裡
    // 1. 先讀出此 Array
    let data = await readFilePromise("models/sample2.json");

    // 2. 使用 .push 
    let latestDramaId=data.map(ele=>ele["dramaId"]).filter(v=>v!==undefined).sort((a,b)=>b-a)[0]

    let newDramaId=Number(latestDramaId)+1

    req.body.dramaId=String(newDramaId)
    
    data.push(req.body);

    // 3. 再把 資料寫出去 sample2.json (同步處理)
    // fs.writeFileSync("models/sample2.json", data , "utf8");  // 會錯誤 , fs.writeFileSync 只接受 string
    fs.writeFileSync("./models/sample2.json", JSON.stringify(data) , "utf8");

    res.json({message : "ok."});
  } catch(err){
    console.log(err);
    res.status(500).json({ message : "系統有問題！"});
  };
});

module.exports = router;