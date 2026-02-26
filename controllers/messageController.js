

const Message = require("../models/Message");

exports.getMessages = async (req, res) => {
  const { cursor, limit = 20 } = req.query;

  const query = {
    $or: [
      { sender: req.user },
      { receiver: req.user }
    ]
  };

  if (cursor) {
    query._id = { $lt: cursor };
  }

  const messages = await Message.find(query)
    .sort({ _id: -1 })
    .limit(parseInt(limit));

  res.json(messages);
};