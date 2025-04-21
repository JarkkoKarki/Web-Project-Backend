const getUser = async (req, res, next) => {
  console.log(req);
  res.send("Users: ");
};

export { getUser };
