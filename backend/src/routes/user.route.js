import { Router } from "express";
import { registerUser } from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import {uploadImage} from '../controllers/image.controller.js'

const router = Router()

router.route('/register').post(registerUser)
router.route('/upload-file').post(
    upload.fields([
        {
            name: "file",
            maxCount: 1
        }
    ]), uploadImage)

export default router