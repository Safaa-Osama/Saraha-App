import multer from "multer"
import fs from "node:fs"

export const multer_local = ({ customPath = "General", customType = [] }) => {

  const fullPath = `uploads/${customPath}`
  if (!fs.existsSync(fullPath, { recursive: true })) {
    fs.mkdirSync(fullPath);
  }

  const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, fullPath)
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
      cb(null, uniqueSuffix + "_" + file.originalname)
    }
  })

  function fileFilter(req, file, cb) {
    if (!customType.includes(file.mimetype)) {
      cb(new Error("Invalid Image Type"))
    }
    cb(null, true)
  }

  const upload = multer({ storage, fileFilter })
  return upload;
}

export const multer_cloud = (customType = [] ) => {

  const storage = multer.diskStorage({})

  function fileFilter(req, file, cb) {
    if (!customType.includes(file.mimetype)) {
      cb(new Error("Invalid Image Type"))
    }
    cb(null, true)
  }

  const upload = multer({ storage, fileFilter })
  return upload;
}