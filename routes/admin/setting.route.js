const express = require("express")
const router = express.Router()

const multer = require("multer")
const upload = multer()

const controller = require("../../controllers/admin/setting.controller")
const uploadCloud = require("../../middlewares/admin/uploadCloud.middleware")

router.get("/general", controller.general)

router.patch("/general", upload.fields([{
        name: "logo",
        maxCount: 1
    }, // Chỉ upload 1 logo
    {
        name: "favicon",
        maxCount: 1
    } // Chỉ upload 1 favicon
]), uploadCloud.upload, controller.generalPatch)

module.exports = router