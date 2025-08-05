const multer = require("multer");
const path = require("path");

//seting my multer storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "../uploads/"));
  },
  filename: function (req, file, cb) {
    cb(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  },
});

const checkFileFilter = (req, file, cb) => {
  if (
    file.mimetype.startsWith("image/") ||
    file.mimetype.startsWith("video/")
  ) {
    cb(null, true);
  } else {
    cb(new Error("Invalid file type"), false); // this is the error message that will be displayed if the file is not an image or video
  }
};

const upload = multer({
  storage,
  fileFilter: checkFileFilter,
  limits: { fileSize: 1024 * 1024 * 5 },
}); // 5MB is the maximum file size

module.exports = upload;
