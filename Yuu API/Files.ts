

export const Files = {
  text: {
    create: createTextFile,
    update: updateTextFile,
    get: getTextFile,
  },
}


/**
 * Options used to select where a file will be saved (a few examples for now)
 * - 'user://templates/YuuPaint.zip' place to save template world zip files
 * - 'user://worlds/YuuPaint/scripts' example world script location
 * - 'user://profile' example to save user settings into
 *  */
export type DirectoryBasePaths = 'user://worlds' | 'user://profile' | 'user://templates';


/**
 * Create a text file (overwrites if it already exists)
 * @param baseDirPath all files must be stored in one of these base directories
 * @param subDirPath optional sub directory, can be left empty, ie '', otherwise formatted 'folder name' or '/folder name'
 * @param fileName to save the text to
 * @param fileExtension to append at the end of the text file, ie. '.json' or '.txt'
 * @param content to save into the text file
 */
function createTextFile(baseDirPath: DirectoryBasePaths, subDirPath: string, fileName: string, fileExtension: string, content: string) {
  const dirPath = combineBaseAndSubPaths(baseDirPath, subDirPath);

  Godot.files.text.create(dirPath, fileName, fileExtension, content);
}

/**
 * Update a text file (creates a file if it doesn't already exist)
 * @param baseDirPath all files must be stored in one of these base directories
 * @param subDirPath optional sub directory, can be left empty, ie '', otherwise formatted 'folder name' or '/folder name'
 * @param fileName to save the text to
 * @param fileExtension to append at the end of the text file, ie. '.json' or '.txt'
 * @param content to save into the text file
 */
function updateTextFile(baseDirPath: DirectoryBasePaths, subDirPath: string, fileName: string, fileExtension: string, content: string) {
  const dirPath = combineBaseAndSubPaths(baseDirPath, subDirPath);

  Godot.files.text.update(dirPath, fileName, fileExtension, content);
}

/**
 * Get the contents of a text file
 * @param baseDirPath all files are stored in one of these base directories
 * @param subDirPath optional sub directory, can be left empty, ie '', otherwise formatted 'folder name' or '/folder name'
 * @param fileName to get
 * @param fileExtension ie. '.txt'
 * @returns string contents, or undefined if unsuccessful
 */
function getTextFile(baseDirPath: DirectoryBasePaths, subDirPath: string, fileName: string, fileExtension: string): string | undefined {
  const dirPath = combineBaseAndSubPaths(baseDirPath, subDirPath);

  return Godot.files.text.get(dirPath, fileName, fileExtension);
}


function combineBaseAndSubPaths(baseDirPath: DirectoryBasePaths, subDirPath: string): string {
  let dirPath = baseDirPath;

  if (subDirPath.length > 0 && subDirPath.charAt(0) === '/') {
    dirPath += '/';
  }

  dirPath += subDirPath;

  return dirPath;
}