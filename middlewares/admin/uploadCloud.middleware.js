const cloudinary = require("cloudinary").v2
const streamifier = require('streamifier')

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_KEY,
    api_secret: process.env.CLOUD_SECRET
});

module.exports.upload = async (req, res, next) => {
    // Nếu có `req.file` (single upload)
    if (req.file) {
        let streamUpload = (file) => {
            return new Promise((resolve, reject) => {
                let stream = cloudinary.uploader.upload_stream(
                    (error, result) => {
                        if (result) {
                            resolve(result);
                        } else {
                            reject(error);
                        }
                    }
                );
                streamifier.createReadStream(file.buffer).pipe(stream);
            });
        };

        try {
            // Upload file và lưu kết quả vào `req.body`
            let result = await streamUpload(req.file);
            req.body[req.file.fieldname] = result.secure_url;
            next();
        } catch (error) {
            console.error("Error uploading single file to Cloudinary:", error);
            res.status(500).json({
                error: "Error uploading file"
            });
        }

        // Nếu có `req.files` (multiple upload)
    } else if (req.files) {
        const uploadPromises = Object.keys(req.files).map(fieldname => {
            let streamUpload = (file) => {
                return new Promise((resolve, reject) => {
                    let stream = cloudinary.uploader.upload_stream(
                        (error, result) => {
                            if (result) {
                                resolve(result);
                            } else {
                                reject(error);
                            }
                        }
                    );
                    streamifier.createReadStream(file.buffer).pipe(stream);
                });
            };

            return streamUpload(req.files[fieldname][0]).then(result => {
                req.body[fieldname] = result.secure_url;
            });
        });

        try {
            await Promise.all(uploadPromises);
            next();
        } catch (error) {
            console.error("Error uploading multiple files to Cloudinary:", error);
            res.status(500).json({
                error: "Error uploading files"
            });
        }

    } else {
        next();
    }
};