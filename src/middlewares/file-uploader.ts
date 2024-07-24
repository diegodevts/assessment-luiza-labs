import multer from 'multer'

export class FileUploader {
  private storage: multer.StorageEngine
  public uploader: multer.Multer

  constructor() {
    this.storage = multer.diskStorage({
      destination: function (req, file, cb) {
        cb(null, 'src/uploads')
      },
      filename: function (req, file, cb) {
        const uniqueSuffix = 'orders.txt'
        cb(null, (file.fieldname = uniqueSuffix))
      }
    })

    this.uploader = multer({ storage: this.storage })
  }
}
