const User = require('../../models/User');
const Offer = require('../../models/Offers');
const UserSession = require('../../models/UserSession');
const Subscription = require('../../models/Subscription');
var router = require('express').Router();
var ObjectId = require('mongodb').ObjectID;


  router.post('/register', (req, res, next) => {
    const { body } = req;
    const {password} = body;
    let {email} = body;
    let {firstName} = body;
    let {lastName} = body;
    let {password2}=body;
    if (!email) {
      return res.send({
        success: false,
        message: 'Error: Email cannot be blank.'
      });
    }
    if (!password) {
      return res.send({
        success: false,
        message: 'Error: Password cannot be blank.'
      });
    }
    if (!firstName) {
      return res.send({
        success: false,
        message: 'Error: First Name cannot be blank.'
      });
    }
    if (!lastName) {
      return res.send({
        success: false,
        message: 'Error: Last Name cannot be blank.'
      });
    }
 
    if (password!==password2) {
      return res.send({
        success: false,
        message: 'Error: The passwors are not identic'
      });
    }

    email = email.toLowerCase();
    email = email.trim();
    // Steps:
    // 1. Verify email doesn't exist
    // 2. Save
    User.find({
      email: email
    }, (err, previousUsers) => {
      if (err) {
        return res.send({
          success: false,
          message: 'Error: Server error'
        });
      } else if (previousUsers.length > 0) {
        return res.send({
          success: false,
          message: 'Error: Account already exist.'
        });
      }

      // Save the new user
      const newUser = new User();
      newUser.email = email;
      newUser.firstName=firstName,
      newUser.lastName=lastName,
      newUser.password = newUser.generateHash(password);
      newUser.save((err) => {
        if (err) {
          return res.send({
            success: false,
            message: 'Error: Server error'
          });
        }    
            // Otherwise correct user
          const userSession = new UserSession();
          userSession.userId = newUser._id;
          userSession.isDeleted=false;
          userSession.timestamp=Date.now();
          userSession.save((err, doc) => {
            if (err) {
              return res.send({
                success: false,
                message: 'Error: server error'
              });
            }
            else{
            return res.send({
              success: true,
              message: 'Valid sign in',
              token: doc._id
            });}
          });
        });
        });
        });
 
//--**************************************************************************************
//------------------------------logout-----------------------------------------------------



router.post('/logout', (req, res, next) => {
  const { query } = req;
  const { token } = query;
  
  if(!token){
    return res.send({
      success: false,
      message: 'Error: Server error'
    });
  }else{
  UserSession.findOneAndUpdate({
    _id: token,
    isDeleted: false
  }, {
    $set: {
      isDeleted:true
    }
  }, null, (err, sessions) => {
    if (err) {
      return res.send({
        success: false,
        message: 'Error: Server error'
      });
    }
    else if(sessions){
      return res.send({
        success: true,
        message: 'Good',
        token:''
    });}
  });}
});

//*********************************************************************************************** */
//****************************login***************************************************** */

router.post("/login", (req, res)=> {
  const { email, password} = req.body
  User.findOne({ email: email}, (err, user) => {
      if(user){
          if(user.validPassword(password)){
                UserSession.findOne({
                  userId : user._id,
                  isDeleted: false
                }, (err, sessions) => {
                      if(err){
                        return res.send({success:false, message:'erreur '})}
                        else{
                           if(sessions){
                              return res.send({
                                success:true, 
                                message:'deja connecté ',
                                token: sessions._id})}
                            else{

                                UserSession.findOneAndUpdate({
                                    userId : user._id,
                                    isDeleted: true
                                  }, {
                                    $set: {
                                      isDeleted:false
                                    }
                                  }, null, (err, sessions) => {
                                    
                                    if (err) {
                                        return res.send({
                                        success: false,
                                        message: 'Error: Server error'
                                      });
                                    }
                                    if (sessions) {
                                      return res.send({
                                        success: true,
                                        message: 'success',
                                        token:sessions._id
                                      });
                                    } else {       
                                    const userSession = new UserSession();
                                    userSession.userId = user._id;
                                    userSession.isDeleted=false;
                                    userSession.timestamp=Date.now();
                                    userSession.save((err, doc) => {
                                      if (err) {
                                        return res.send({
                                          success: false,
                                          message: 'Error: server error'
                                        });
                                      }
                                      return res.send({
                                        success: true,
                                        message: 'success',
                                        token: doc._id
                                      });
                                    });

                  }     
                });
              }
              }
            })
          }//if valid pasword
          else {
              res.send({message: "Password didn't match"})
          }
      
    }
      else {
        res.send({ message: "user n'existe pas"})
      }
 
}
 );   
});

//***************************************************************************************** */
//***************************************************************************************** */

router.get('/verify', (req, res, next) => {
  // Get the token
  const { query } = req;
  const { token } = query;
  // ?token=test
  // Verify the token is one of a kind and it's not deleted.
  UserSession.find({
    _id: token,
    isDeleted: false
  }, (err, sessions) => {
    if (err) {
      return res.send({
        success: false,
        message: 'Error: Server error'
      });
    }
    if (!sessions) {
      return res.send({
        success: false,
        message: 'Error: Invalid'
      });
    } else {
      // DO ACTION
      return res.send({
        success: true,
        message: 'Good',
        
      });
    }
  });
});
  //************************************************************************** */
  //*************************************getUser********************************* */

router.get("/getUser",(req, res, next)=>{
const {query}=req;
const {token}=query;

UserSession.findOne({
  _id: ObjectId(token),
}, (err, sessions) => {
  if (err) {
    return res.send({
      success: false,
      message: 'Error: Server error'
    });
  }
  if (!sessions) {
    return res.send({
      success: false,
      message: 'Error: Invalid'
    });
  } else {
    // DO ACTION

    const id=sessions.userId; 
    
    User.findOne({
    _id:ObjectId(id)
    },(err,users)=>{
      if (err){
        return res.send({
          success: false,
          message: 'Error: Server error'
        });
      }
        if(users){
            const user=new User();
            return res.send({
              success:true,
              message:"success",
              user:users
            });
        }
        else{
          return res.send({
          success: false,
          message: 'Error: user non trouvé'
        });
        }

        });
        }
        });
        });
/*//************************-****************************************** */

router.get("/getAllUsers",(req,res)=>{

User.find({}, (err, result)=> {
  console.log('11');
  if (err) {
    console.log("err")
      res.send({success:false,message:'error'});  

  } else {
    console.log("trrr")
   
      res.send({
        data:result,
        success:true,
      });        
  }

})


  });
/***********************************************************Delete **********/
/***********************************************************Delete **********/
router.post("/DeleteUser",(req,res)=>{
const {query}=req;
const {email}=query;

  User.deleteOne({email: email}, function(err, obj) {
    if (err) {
      res.send({
        success:false
      });
    }
    else{ console.log('delleete')
    res.send({
      success:true
    }); 
    }
  });
});
/*-------------------------***********************-----------------------------------**/
  /*-------------------------*********AddOffer********-----------------------------------**/

  router.post('/AddOffer', (req, res,next) => {
    const { body } = req;
    const {internet} = body;
    let {calls} = body;
    let {duration} = body;
    let {price} = body;
    let {description} = body;
    console.log('ollll');
    if (!duration) {
      return res.send({
        success: false,
        message: 'Error: duration cannot be blank.'
      });
    }
    if (!price) {
      return res.send({
        success: false,
        message: 'Error: price cannot be blank.'
      });
    }
    if (!internet && !calls) {
      return res.send({
        success: false,
        message: 'Error: internet and calls cannot be blank.'
      });
    }
      // Save the new Offer
      console.log('jdjdjd')
      const Offerr = new Offer({});
      Offerr.internet = internet;
      Offerr.calls=calls,
      Offerr.description=description,
      Offerr.duration=duration,
      Offerr.price=price,
     
      Offerr.save((err) => {
        if (err) {
          return res.send({
            success: false,
            message: 'Error: Server error'
          });
        }    
           else{
            return res.send({
              success: true,
              message: 'Valid add new offer',
            });}
          });
        });

/****-------------------------------------- */
router.get("/getAllOffers",(req,res)=>{

  Offer.find({}, (err, result)=> {
    console.log('555');
    if (err) {
      console.log("err")
        res.send({success:false,message:'error'});  
  
    } else {
      console.log("dhhd")
     
        res.send({
          data:result,
          success:true,
        });        
    }
  
  })  
    });
    

    router.post("/DeleteOffer",(req,res)=>{
      const {query}=req;
      const {id}=query;
      
        Offer.deleteOne({ _id: ObjectId(id)}, function(err, obj) {
          if (err) {
            res.send({
              success:false
            });
          }
          else{ console.log('delleted')
          res.send({
            success:true
          }); 
          }
        });
      });

//**************************************************** */
    router.post( "/UpdateOffer",(req,res)=>{
      const { body } = req;
      const {id} = body;
      const {internet} = body;
      let {calls} = body;
      let {duration} = body;
      let {price} = body;
      let {description} = body;

     Offer.update({_id:ObjectId(id)}, 
                {$set:{internet:internet,
                  calls:calls,
                  duration:duration,
                  price:price,
                  description:description}}, function(err, result) {
        if (err){
        return res.send({
          success: false,
          message: 'Error: Server error'
        });
      }    
         else{
          return res.send({
            success: true,
            message: 'Valid update offer',
          });}
    });
    })

    /********************* */
    router.post('/AddSubscription', (req, res,next) => {
      console.log('zzzzz');
      const { body } = req;
      const {userid} = body;
      const {offerid} = body;
      const {email} = body;
      
     
     
      console.log('sub1');
      if (!userid) {
        return res.send({
          success: false,
          message: 'Error: userid cannot be blank.'
        });
      }
      if (!offerid) {
        return res.send({
          success: false,
          message: 'Error: offerid cannot be blank.'
        });
      }
      if (!email) {
        return res.send({
          success: false,
          message: 'Error: email cannot be blank.'
        });
      }
     
        // Save the new Offer
        console.log('sub2')
        const Subs = new Subscription({});
        Subs.UserId = userid;
        Subs.OfferId=offerid,
        Subs.email=email,
        Subs.indx=0,
        Subs.date=Date.now();
      
       
        Subs.save((err) => {
          if (err) {
            return res.send({
              success: false,
              message: 'Error: Server error'
            });
          }    
             else{
              return res.send({
                success: true,
                message: 'Valid add new subscription',
              });}
            });
          });
  //********************************* */
  router.get("/getSubscriptions",(req, res, next)=>{
    const {query}=req;
    const {userid}=query;
    
    Subscription.find({
      UserId: userid,
    }, (err, subs) => {
      if (err) {
        return res.send({
          success: false,
          message: 'Error: Server error'
        });
      }
      if (!subs) {
        return res.send({
          success: false,
          message: 'you have no subscription !'
        });
      } else {
          return res.send({
            success:true,
            message:"success",
            subs:subs
        
             
            });
            }
            });
            });
/*********************** */
router.get("/getOfferById",(req, res, next)=>{
  const {query}=req;
  const {offerid}=query;
  
  Offer.findOne({
    _id: ObjectId(offerid),
  }, (err, offer) => {
    if (err) {
      return res.send({
        success: false,
        message: 'Error: Server error'
      });
    }
    if (!offer) {
      return res.send({
        success: false,
        message: 'Error: Invalid'
      });
    } else {
      // DO ACTION
          return res.send({
            success:true,
            message:"success",
            offers:offer
          });
          }
          });
          });
            
  module.exports = router