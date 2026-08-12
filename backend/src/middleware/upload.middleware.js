import multer from "multer";
import path from "path";
import fs from "fs";


const uploadDirectory =
    path.join(
        process.cwd(),
        "uploads",
        "profiles"
    );


if (
    !fs.existsSync(
        uploadDirectory
    )
) {

    fs.mkdirSync(
        uploadDirectory,
        {
            recursive: true,
        }
    );

}


const storage =
    multer.diskStorage({

        destination: (
            req,
            file,
            cb
        ) => {

            cb(
                null,
                uploadDirectory
            );

        },


        filename: (
            req,
            file,
            cb
        ) => {

            const extension =
                path
                    .extname(
                        file.originalname
                    )
                    .toLowerCase();


            const filename =
                `profile-${req.user.id}-${Date.now()}${extension}`;


            cb(
                null,
                filename
            );

        },

    });


const fileFilter =
    (
        req,
        file,
        cb
    ) => {

        const allowedTypes = [
            "image/jpeg",
            "image/png",
            "image/webp",
        ];


        if (
            allowedTypes.includes(
                file.mimetype
            )
        ) {

            cb(
                null,
                true
            );

        } else {

            cb(

                new Error(
                    "Only JPG, PNG, and WEBP images are allowed."
                ),

                false

            );

        }

    };


const uploadProfileImage =
    multer({

        storage,

        fileFilter,

        limits: {

            fileSize:
                5 * 1024 * 1024,

        },

    });


export default uploadProfileImage;