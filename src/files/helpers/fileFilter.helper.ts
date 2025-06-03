export const fileFilter = (
  req: Express.Request,
  file: Express.Multer.File,
  callback: Function,
) => {
    
  if (!file) return callback(new Error('File is empty'), false);

  const fileExtension = file.mimetype.split('/')[1];

  const validExtensions = ['jpg', 'png', 'png', 'gif'];

  if (!validExtensions.includes(fileExtension)) return callback(null, false);

  callback(null, true);
};
