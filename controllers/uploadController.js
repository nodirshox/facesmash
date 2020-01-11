const Image = require('../model/Image')
const imagesCollection = require('../db')

exports.uploadPage = function(req, res) {
    res.render('upload')
}

exports.save = function(req, res) {
    let data={
        ...req.body,
        rank:0
    }
    let image = new Image(data);
    image.saveImage()
    res.send("Thanks")
}