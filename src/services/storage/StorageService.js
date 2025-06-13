const { nanoid } = require('nanoid');
    // const config = require('../../utils/config'); // Tidak dibutuhkan jika hanya local storage
    const fs = require('fs'); // Diperlukan untuk local storage
    const path = require('path'); // Diperlukan untuk local storage

    class StorageService {
      constructor() {
        // Menggunakan S3 Client (DI-COMMENT OUT ATAU HAPUS JIKA TIDAK DIGUNAKAN)
        // this._s3 = new S3Client({
        //   region: config.aws.region,
        //   credentials: {
        //     accessKeyId: config.aws.accessKeyId,
        //     secretAccessKey: config.aws.secretAccessKey,
        //   },
        // });

        // >>> AKTIFKAN: Local File System
        const uploadsPath = path.resolve(__dirname, '../../public/uploads/covers');
        if (!fs.existsSync(uploadsPath)) {
          fs.mkdirSync(uploadsPath, { recursive: true }); // Buat folder jika belum ada
        }
        this._folder = uploadsPath; // Path folder penyimpanan
      }

      async writeFile(file, meta) {
        const filename = `${nanoid(16)}.${meta['content-type'].split('/')[1]}`;
        
        // S3 Upload (DI-COMMENT OUT ATAU HAPUS JIKA TIDAK DIGUNAKAN)
        // const params = {
        //   Bucket: config.aws.bucketName,
        //   Key: filename,
        //   Body: file._data,
        //   ContentType: meta['content-type'],
        // };
        // await this._s3.send(new PutObjectCommand(params));
        
        // >>> AKTIFKAN: Local File System Write
        const fileStream = fs.createWriteStream(path.join(this._folder, filename));
        await new Promise((resolve, reject) => {
          file.pipe(fileStream); // Mengalirkan data file ke stream tulisan
          file.on('end', () => fileStream.end()); // Pastikan stream ditutup
          fileStream.on('finish', resolve); // Selesai ketika stream selesai menulis
          fileStream.on('error', reject); // Error jika ada masalah penulisan
        });

        return filename;
      }

      async deleteFile(filename) {
        // S3 Delete (DI-COMMENT OUT ATAU HAPUS JIKA TIDAK DIGUNAKAN)
        // const params = {
        //   Bucket: config.aws.bucketName,
        //   Key: filename,
        // };
        // await this._s3.send(new DeleteObjectCommand(params));

        // >>> AKTIFKAN: Local File System Delete
        const filePath = path.join(this._folder, filename);
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath); // Hapus file
        }
      }
    }

    module.exports = StorageService;