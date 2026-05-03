exports.me = async (req, res) => {
  res.json(req.user.toPublic());
};

exports.updateMe = async (req, res) => {
  const { name, profilePic } = req.body || {};
  if (typeof name === 'string' && name.trim()) req.user.name = name.trim();
  if (typeof profilePic === 'string') req.user.profilePic = profilePic;
  await req.user.save();
  res.json(req.user.toPublic());
};
