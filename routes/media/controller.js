const upload = require("../../middlewares/fileMulter");
const multer = require("multer");
const { Media } = require("../../models");
var bodyParser = require('body-parser');
module.exports = {
  upload_single: async (req, res, next) => {
    upload.single("file")(req, res, async (err) => {
      try {
        if (err instanceof multer.MulterError) {
          res.status(501).json({ type: "MulterError", err: err });
        } else if (err) {
          res.status(502).json({ type: "UnknownError", err: err });
        } else {
          // const response = await insertDocument(
          //   {
          //     location: req.file.path,
          //     name: req.file.filename,
          //     employeeId: req.user._id,
          //     size: req.file.size,
          //   },
          //   'Media',
          // );
          const media = new Media({
            location: req.file.path,
            name: req.file.filename,
            employeeId: req.user._id,
            size: req.file.size,
          });

          const response = await media.save();

          res
            .status(200)
            .json({ message: "Tải lên thành công", payload: response });
        }
      } catch (error) {
        console.log("««««« error »»»»»", error);
        res.status(500).json({ message: "Upload file error", error });
      }
    });
  },
  upload_multiple: async (req, res, next) => {

    upload.array("files", 3)(req, res, async (err) => {
      try {
        if (err instanceof multer.MulterError) {
          res.status(500).json({ type: "MulterError", err: err });
        } else if (err) {
          res.status(500).json({ type: "UnknownError", err: err });
        } else {
          const dataInsert = req.files.reduce((prev, file) => {
            prev.push({
              name: file.filename,
              location: file.path,
              size: file.size,
              employeeId: req.user._id,
            });
            return prev;
          }, []);
          const response = await Media.insertMany(dataInsert);

          return res.send({
          code: 200,
          mesage: 'Thành công',
          payload: response,
          });
        }
      } catch (error) {
        console.log("««««« error »»»»»", error);
        return res.status(500).json({ message: "Upload files error", error });
      }
    });
  },
  get_file: async (req, res, next) => {
    const { id } = req.params;
    const payload = await Media.findById(id);

    if (payload) return res.status(200).json({ payload });

    return res.status(400).json({ message: "Không tìm thấy" });
  },
};
