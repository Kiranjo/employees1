let express=require("express");
let app=express();
app.use(express.json());
app.use(function (req,res,next){
    res.header("Access-Control-Allow-Origin","*");
    res.header(
        "Access-Control-Allow-Methods",
        "GET,POST,OPTIONS,PUT,PATCH,DELETE,HEAD"
    );
    res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept"
    );
    next();
});
const port =2410;
app.listen(port,()=>console.log(`Node app listening on port ${port}!`));
//let {mobilesData}=require("./mobilesFile.js");
let employeesData=[];
let fs=require("fs");
let fname="employees.json";
let mysql=require("mysql");
let connData={
    host:"localhost",
    user:"root",
    password:"",
    database:"mysql",
};
app.get("/employees/resetData",function(req,res){
    let connection=mysql.createConnection(connData);
    let sql="SELECT * FROM employeesTable";
    connection.query(sql,function(err,result){
        if(err) console.log(err);
        else {
        
            let data=JSON.stringify(result);
            fs.writeFile(fname,data,function(err){
                if(err) res.status(404),send(err);
                else res.send("Data in file is reset");
            });
        };
    });
  
});
app.get("/customers",function(req,res){
    console.log("GET /products",req.query);
    let city=req.query.city;
    let gender=req.query.gender;
    let payment=req.query.payment;
    let sortBy=req.query.sortBy;
    let arr1=customersData;
    if(city){
        arr1=arr1.filter((st)=>st.city===city);
    }
    if(gender){
        arr1=arr1.filter((st)=>st.gender===gender);
    }
    if(payment){
        arr1=arr1.filter((st)=>st.payment===payment);
    }
    if(sortBy==="payment"){
        arr1.sort((st1,st2)=>st1.payment.localeCompare(st2.payment));
   }
   if(sortBy==="city"){
     arr1.sort((st1,st2)=>st1.city.localeCompare(st2.city));
 }
 if(sortBy==="age"){
    arr1.sort((st1,st2)=>+st1.age-(+st2.age));
}
    res.send(arr1);
})

app.get("/employees",function(req,res){
    fs.readFile(fname,"utf8",function(err,data){
        if(err) res.status(404).send(err);
        else{
            let mobilesArray=JSON.parse(data);
            let department=req.query.department;
            let designation=req.query.designation;
            let gender=req.query.gender;
            let arr1=mobilesArray;
            if(department){
                arr1=arr1.filter((st)=>st.department===department);
            }
            if(designation){
                arr1=arr1.filter((st)=>st.designation===designation);
            }
            if(gender){
                arr1=arr1.filter((st)=>st.gender===gender);
            }
            res.send(arr1);
        }
    });
});
app.get("/employees/:id",function(req,res){
    let id=+req.params.id;
    fs.readFile(fname,"utf8",function(err,data){
        if(err) res.status(404).send(err);
        else{
            let studentsArray=JSON.parse(data);
            console.log(studentsArray);
            let student=studentsArray.find((st)=>st.empCode==id);
          if(student)  res.send(student);
          else res.status(404).send("No Mobile found");
        }
    });
});
app.get("/employees/designation/:designation",function(req,res){
    let designation=req.params.designation;
    fs.readFile(fname,"utf8",function(err,data){
        if(err) res.status(404).send(err);
        else{
            let studentsArray=JSON.parse(data);
            let student=studentsArray.filter((st)=>st.designation==designation); 
          if(student)  res.send(student);
          else res.status(404).send("No employee found");
        }
    });
});
app.get("/employees/department/:department",function(req,res){
    let department=req.params.department;
 
    fs.readFile(fname,"utf8",function(err,data){
        if(err) res.status(404).send(err);
        else{
            let studentsArray=JSON.parse(data);
            let student=studentsArray.filter((st)=>st.department==department); 
          if(student)  res.send(student);
          else res.status(404).send("No employee found");
        }
    });
});



app.post("/employees",function(req,res){
    let body=req.body;
    fs.readFile(fname,"utf-8",function(err,data){
        if (err){ res.status(404).send(err+"error in read part");
   }
        else{
            let mobilesArray=JSON.parse(data);
            let newCustomer={...body };
            
            mobilesArray.push(newCustomer);
            let data1=JSON.stringify(mobilesArray);
            fs.writeFile(fname,data1,function (err){
                if(err){ res.status(404).send(err+"err in write part")
            }
                else{ 
                  
                    res.send(newCustomer)
                };
            });
        }
    });
});
app.put("/employees/:id",function(req,res){
    let body=req.body;
    let id=req.params.id;
    fs.readFile(fname,"utf8",function(err,data){
        if (err) res.status(404).send(err);
        else{
            let mobilesArray=JSON.parse(data);
            let index=mobilesArray.findIndex((st)=>st.empCode===id);
            if(index>=0){
                updateMobile={...mobilesArray[index],...body};
                mobilesArray[index]=updateMobile;
            let data1=JSON.stringify(mobilesArray);
            fs.writeFile(fname,data1,function(err){
                if(err) res.status(404).send(err);
                else res.send(updateMobile);
            });
        }else res.status(404).send("NO mobile found");
    }
    });
});
app.delete("/employees/:id",function(req,res){
    let id=req.params.id;
    fs.readFile(fname,"utf8",function(err,data){
        if (err) res.status(404).send(err);
        else{
            let studentsArray=JSON.parse(data);
            let index=studentsArray.findIndex((st)=>st.empCode===id);
            if(index>=0){
               let deleteStudent=studentsArray.splice(index,1);
            let data1=JSON.stringify(studentsArray);
            fs.writeFile(fname,data1,function(err){
                if(err) res.status(404).send(err);
                else res.send(deleteStudent);
            });
        }else res.status(404).send("NO employee found");
    }
    });
});

/*app.get("/resetData",function(req,res){
    let data=JSON.stringify(mobilesData);
    fs.writeFile(fname,data,function(err){
        if(err) res.status(404),send(err);
        else res.send("Data in file is reset");
    });
});*/






