// POSTGRES ERROR
const postgresErr = (err, req, res, next) => {
  if (err.code === "22P02") {
    res.status(400).send({ msg: "Bad Request" }); // 	INVALID TEXT REPRESENTATION
  }
  if (err.code === "23502") {
    res.status(400).send({ msg: "Bad Request" }); //NOT NULL VIOLATION
  }
  if (err.code === "23503") {
    res.status(404).send({ msg: "Not Found" });
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
