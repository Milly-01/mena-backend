
require("dotenv").config();


const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cors = require("cors");



const app = express();


app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));


app.use(express.json());
app.use(cors({
    credentials: true,
    origin: ["http://localhost:3000", "https://mena-e-commerce.onrender.com"]
}));





mongoose.connect(process.env.MONGOATLASSURL, {useNewUrlParser: true})
    .then((result)=>console.log("Connected to database"))
    .catch((error)=>console.log("There has been an error: " + error))

    
const usersSchema = mongoose.Schema({
    u_name: String,
    u_surname: String,
    u_email: String,
    u_password: String
}) 

const productsSchema = mongoose.Schema({
    p_id: Number,
    p_name: String,
    p_category: String,
    p_image: String,
    p_price: Number,
    p_description: String
});

const purchasesSchema = mongoose.Schema({
    ap_logged_in_user_name: String,
    ap_logged_in_user_email: String,
    ap_product_name: String,
    ap_product_price: Number
});

const User = new mongoose.model("User", usersSchema);
const Product = new mongoose.model("Product", productsSchema);
const Purchase = new mongoose.model("Purchase", purchasesSchema);

// app.get("/", function(req, res){
//     const my_prod = Product({
//         p_id: 4,
//         p_name: "Amagwinya",
//         p_category: "Food",
//         p_image: "/products-images1/amagwinya.jpeg",
//         p_price: 5,
//         p_description: "Best tasty fat cakes around"

//     });

//     my_prod.save();
//     res.send("Done");

// });

// Request to signup
app.post("/signup", function(req, res){
    const {su_name, su_surname, su_email, su_password} = req.body;
    User.find({u_email: su_email}).then(
        function(result){
            if(result.length !== 0){
                res.json("Fail");

            }else{
                const my_user = User({
                    u_name: su_name,
                    u_surname: su_surname,
                    u_email: su_email,
                    u_password: su_password
                });
                my_user.save();
                res.json("Success");
            }  
        }   
    )
});
// 

// Request to signin
app.post("/signin", function(req, res){
    const {si_email, si_password, si_name} = req.body;
    User.find({u_email: si_email, u_password: si_password, u_name: si_name}).then(
        function(result){
            if(result.length !== 0){
                res.json("Success");
            }else{
                res.json("Fail");
            }
        }
    );
});


// Request to home
app.get("/home", function(req, res){
    Product.find().then(function(result){
        res.send(result);
    });
});


// Request to product
app.post("/product", function(req, res){
    const {l_p_name} = req.body;

    Product.find({p_name: l_p_name}).then(function(result){
        res.send(result[0]);
    });
});

// Request to add to cart
app.post("/addtocart", function(req, res){
    const  {sii_name, sii_email, name, price} = req.body;
    const my_purchase = Purchase({
        ap_logged_in_user_name: sii_name,
        ap_logged_in_user_email: sii_email,
        ap_product_name: name,
        ap_product_price: price
    });

    my_purchase.save();
    res.json("Purchase added to cart");
});


// Request to get food
app.post("/getfood", function(req, res){
    const {sii_email} = req.body;
    Purchase.find({ap_logged_in_user_email: sii_email}).then(
        function(result){
          res.json(result);
        }
    );
});


// Request to checkout
app.post("/checkout", function(req, res){
    const {sii_email} = req.body;
    Purchase.deleteMany({ap_logged_in_user_email: sii_email}).then();
    res.json("Done");
});


const PORT = process.env.PORT || 3001;

app.listen(PORT, function(){
    console.log("Server is up and running at port " + PORT);
});