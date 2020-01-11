const express = require('express')
const router = express.Router()
const fileUpload = require('express-fileupload');
const uploadController = require('./controllers/uploadController')
const Image = require('./model/Image')
const db = require('./db');
const ObjectId=require('mongodb').ObjectID;

//Main page
router.get('/', function(req, res) {
    res.render('main-page')
})

//New game page
router.get('/new-game', function(req, res) {
    /*
    db.collection('images').find().sort({rank: 1}).limit(2).toArray((err, images) => {
      res.render('new-game', {images})
    })
    */
   db.collection('images').find({}).sort({rank:1}).limit(2).toArray((err, images) =>{
    res.render('new-game', {images})
})
})


//Ranks

router.get('/ranking', function(req, res) {
  db.collection('images').find().toArray((err, items) => {
    res.render('rank', {items})
  })
})
//Upload
router.get('/upload', uploadController.uploadPage)

router.post('/upload', function(req, res) {
    let sampleFile;
    let uploadPath;

    if (!req.files || Object.keys(req.files).length === 0) {
      res.status(400).send('No files were uploaded.');
      return;
    }
  
    //console.log('req.files >>>', req.files); // eslint-disable-line
  
    sampleFile = req.files.sampleFile;
    
    uploadPath = __dirname + '/public/pictures/' + sampleFile.name;
  
    sampleFile.mv(uploadPath, function(err) {
      if (err) {
        return res.status(500).send(err);
      }
  
      res.render('main-page');
      
    });
    let imageData={
      name:sampleFile.name,
      rank:1
    }
    let image = new Image(imageData)
    image.saveImage()

  });

router.post('/vote',(req,res,next)=>{
  let b=req.body;
  // winner & loser
  db.collection('images').findOne({_id: ObjectId(b.loser)},{},(err, loserImage)=>{
    if(err) return next(err);

    if(loserImage){
      //update winner image rank
      db.collection('images').findOneAndUpdate({_id: ObjectId(b.winner)},{
        $inc:{rank:loserImage.rank}},
        {returnNewDocument:true},
        (err, updatedWinnerImage)=>{
        if(err) return next(err);
        if(updatedWinnerImage){
         // console.log('updated, rank:'+updatedWinnerImage);
         // console.log(updatedWinnerImage)
        }
      });

      // send new image
      db.collection('images').findOne({
        _id:{$ne:loserImage._id}
      },(err, newImage)=>{
        if(err) return next(err);
        //console.log(newImage);
        if(newImage){
          res.json({
            result:'success',
            ...newImage
          });
        }else{
          res.json({
            result:'error',
            message:'image was not found'
          });
        }
        
      });
    }else{
      res.json({
        result:'error',
        message:'Loser id is not found: '+b.loser
      });
    }
    
  });
  
})




router.get('*', function(req, res) {  
  //error handler
  res.render('404');
});
module.exports = router