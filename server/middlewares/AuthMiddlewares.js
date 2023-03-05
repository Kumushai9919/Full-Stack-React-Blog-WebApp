 //here we grab the token that is sent throuth the fronend and validate by jwt function 'verify':if it's valid we continue the request(ex: send and add the comment), if not we return json response in the reqeust some sort of error
const {verify} = require("jsonwebtoken");
 //middlewares function(req,res,next): this func will run before the request
 const validateToken = (req, res, next) => {

    const accessToken = req.header("accessToken");
    if(!accessToken) return res.json({error: "user not logged in"});

    try{
        const validToken = verify(accessToken, "importantsecret");
        req.user = validToken;
        
        if(validToken){
            return next(); 
        }
    }catch(err){
        return res.json({error: err});
    }
 }

 module.exports = {validateToken};
