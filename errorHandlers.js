// POSTGRES ERROR
const postgresErr = (err, req, res, next) => {
  if (err.code === "22P02") {
    res.status(400).send({ msg: "Bad Request" });
  } else {
    next(err);
  }
};

//CUSTOM ERROR HANDLER
const customErr = (err, req, res, next) => {
  if (err.status) {
    res.status(err.status).send({ msg: err.msg });
  } else {
    next(err);
  }
};

// INTERNAL SEVER ERROR
const internalErr = (err, req, res, next) => {
  res.status(500).send({ msg: "Internal Server Error" });
};

module.exports = { postgresErr, customErr, internalErr };
