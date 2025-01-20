import multer from "multer"

//rwad the documnetation of multer from npm site

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, "./public/temp") //to have easy access of files
    },
    filename: function (req, file, cb) {
      
      cb(null, file.originalname)
      console.log(this.filename)
    }
  })
  
export  const upload = multer({ 
    storage,
})