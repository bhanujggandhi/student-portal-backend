const multer = require("multer");
const path = require("path");

var storage = multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, "./public/uploads/");
  },
  filename: function (req, file, callback) {
    callback(
      null,
      file.fieldname + "_" + Date.now() + path.extname(file.originalname)
    );
  },
});

var upload = multer({ storage: storage }).array("userPhoto", 2);

module.exports = upload;
