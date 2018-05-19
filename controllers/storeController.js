exports.myMiddleware = (req, res, next) => {
  req.name = 'Michael';
  if (req.name == 'Michael') {
    throw Error('that is a stupid name');
  }
  next();
}
exports.homePage = (req, res) => {
  console.log(req.name);
  res.render('index');
}