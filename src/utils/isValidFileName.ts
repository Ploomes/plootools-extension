function isValidFileName(fileName: string) {
 return /^[a-z0-9_.@()-]+$/i.test(fileName);
};

export default isValidFileName;
