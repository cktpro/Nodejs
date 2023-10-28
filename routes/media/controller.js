const multer = require("multer");
const {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
} = require("@aws-sdk/client-s3");

const {
  toSafeFileName,
  updateDocument,
  insertDocuments,
} = require("../../helper/MongoDbHelper");
const { Media } = require("../../models");

const TYPE = {
  SMALL_IMG: "smallImg",
  LARGE_IMG: "largeImg",
};

const storage = multer.memoryStorage();
const upload = multer({
  storage,
});

function generateUniqueFileName() {
  const timestamp = Date.now();
  const randomChars = Math.random().toString(36).substring(2, 15);
  return `${timestamp}-${randomChars}`;
}

module.exports = {
  upload_single: (req, res, next) => {
    const { objid } = req.params;
    console.log(
      "◀◀◀  ▶▶▶",
      process.env.R2_ENDPOINT,
      process.env.R2_ACCESS_KEY,
      process.env.R2_SECRET_ACCESS_KEY
    );
    upload.single("image")(req, res, async (err) => {
      try {
        const S3 = new S3Client({
          region: "auto",
          endpoint: process.env.R2_ENDPOINT,
          credentials: {
            accessKeyId: process.env.R2_ACCESS_KEY,
            secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
          },
        });

        const fileName = toSafeFileName(req.file.originalname);
        await S3.send(
          new PutObjectCommand({
            Body: req.file.buffer,
            Bucket: "e-shop",
            Key: fileName,
            ContentType: req.file.mimetype,
          })
        );

        console.log("««««« req.file »»»»»", req.file);

        const url = `${process.env.R2_URL}/${fileName}`;

        const found = await Media.findOne({
          objectId: objid,
          type: TYPE.LARGE_IMG,
        });

        if (found) {
          const response = await updateDocument(
            { objectId: objid, type: TYPE.LARGE_IMG },
            {
              location: url,
              name: fileName,
              employeeId: req.user._id,
              size: req.file.size,
              type: TYPE.LARGE_IMG,
            },
            "Media"
          );

          return res
            .status(200)
            .json({ message: "Update hình ảnh thành công", payload: response });
        } else {
          const media = new Media({
            location: url,
            name: fileName,
            employeeId: req.user._id,
            objectId: objid,
            size: req.file.size,
            type: TYPE.LARGE_IMG,
          });

          const response = await media.save();

          return res
            .status(200)
            .json({ message: "Tải lên thành công", payload: response });
        }
      } catch (error) {
        console.log("««««« error »»»»»", error);
        return res.status(500).json({ message: "Upload file error", error });
      }
    });
  },

  upload_multiple: (req, res, next) => {
    const { objid } = req.params;

    upload.array("images", 4)(req, res, async (err) => {
      try {
        const S3 = new S3Client({
          region: "auto",
          endpoint: process.env.ENDPOINT,
          credentials: {
            accessKeyId: process.env.R2_ACCESS_KEY_ID,
            secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
          },
        });

        const listFiles = req.files.reduce((prev, file) => {
          prev.push({
            Body: file.buffer,
            Bucket: "demobackend",
            Key: generateUniqueFileName(file.originalname),
            ContentType: file.mimetype,
          });

          return prev;
        }, []);

        await Promise.all(
          listFiles.map(async (file) => {
            try {
              const params = {
                Body: file.Body,
                Bucket: file.Bucket,
                Key: file.Key,
                ContentType: file.ContentType,
              };

              await S3.send(new PutObjectCommand(params));

              console.log(`File ${file.Key} uploaded to S3.`);
            } catch (error) {
              console.error(`Error uploading file ${file.Key} to S3:`, error);
            }
          })
        );

        const url = `https://pub-50cd0051de0b47509baf9c4fc482606a.r2.dev/demobackend`;

        const found = await Media.find({
          objectId: objid,
          type: TYPE.SMALL_IMG,
        });

        if (found) {
          await Media.deleteMany({
            objectId: objid,
            type: TYPE.SMALL_IMG,
          });

          const dataInsert = listFiles.reduce((prev, file) => {
            prev.push({
              name: file.Key,
              location: `${url}/${file.Key}`,
              size: file.size,
              employeeId: req.user._id,
              objectId: objid,
              type: TYPE.SMALL_IMG,
            });

            return prev;
          }, []);

          let response = await insertDocuments(dataInsert, "Media");

          return res
            .status(200)
            .json({ message: "Update thành công", payload: response });
        } else {
          const dataInsert = req.files.reduce((prev, file) => {
            prev.push({
              name: fileName,
              location: url,
              size: file.size,
              employeeId: req.user._id,
              objectId: objid,
              type: TYPE.SMALL_IMG,
            });
            return prev;
          }, []);

          let response = await insertDocuments(dataInsert, "Media");

          return res
            .status(200)
            .json({ message: "Tải lên thành công", payload: response });
        }
      } catch (error) {
        console.log("««««« error »»»»»", error);
        return res.status(500).json({ message: "Upload file error", error });
      }
    });
  },
  get_file_detail: async (req, res, next) => {
    try {
      const { id } = req.params;
      const payload = await Media.findById(id);

      if (payload)
        return res.status(200).json({ code: 200, mesage: "Thành công",payload: payload });

      return res.status(400).json({ message: "Không tìm thấy" });
    } catch (error) {
      return res.status(500).json({
        code: 500,
        mesage: "Thất bại",
        error: error,
      });
    }
  },
  get_list: async (req, res, next) => {
    try {
      const payload = await Media.find();

      if (payload) return res.status(200).json({ payload });

      return res.status(400).json({ message: "Không tìm thấy" });
    } catch (error) {
      return res.status(500).json({
        code: 500,
        mesage: "Thất bại",
        error: error,
      });
    }
  },
  delete_single: async (req, res, next) => {
    const { id } = req.params;
    try {
      const S3 = new S3Client({
        region: "auto",
        endpoint: process.env.R2_ENDPOINT,
        credentials: {
          accessKeyId: process.env.R2_ACCESS_KEY,
          secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
        },
      });
      const result = await Media.findById(id);
      if (result) {
        const s3delete = await S3.send(
          new DeleteObjectCommand({
            Bucket: "e-shop",
            Key: result.name,
          })
        );

        const mediaDelete = await Media.findByIdAndDelete(id);
        Promise.all[(s3delete, mediaDelete)];
        return res.status(200).json({
          code: 200,
          mesage: "Thành công",
        });
      }
      return res.status(400).json({
        code: 404,
        mesage: "Không tìm thấy",
      });
      // const fileName = toSafeFileName(req.file.originalname)
      // const res =  await S3.send(
      //   new DeleteObjectCommand({
      //     Bucket: 'e-shop',
      //     Key: "1698471474827-iphone-14-pro-max.png",
      //   })
      // );

      // console.log('««««« req.file »»»»»', req.file);

      // const url = `${process.env.R2_URL}/${fileName}`

      // const found = await Media.findOne({ objectId: objid, type: TYPE.LARGE_IMG });

      // if (found) {
      //   const response = await updateDocument(
      //     { objectId: objid, type: TYPE.LARGE_IMG },
      //     {
      //       location: url,
      //       name: fileName,
      //       employeeId: req.user._id,
      //       size: req.file.size,
      //       type: TYPE.LARGE_IMG
      //     },
      //     'Media',
      //   );

      //   return res.status(200).json({ message: "Update hình ảnh thành công", payload: response });
      // } else {
      //   const media = new Media({
      //     location: url,
      //     name: fileName,
      //     employeeId: req.user._id,
      //     objectId: objid,
      //     size: req.file.size,
      //     type: TYPE.LARGE_IMG,
      //   });

      //   const response = await media.save();
    } catch (error) {
      console.log("««««« error »»»»»", error);
      return res.status(500).json({ message: "Upload file error", error });
    }
  },
};
