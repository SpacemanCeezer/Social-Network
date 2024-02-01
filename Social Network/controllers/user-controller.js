// userController.js

const { User, Thought } = require('../models');

const userController = {
  getAllUsers: async (req, res) => {
    try {
      const users = await User.find({})
        .populate({
          path: 'thoughts friends',
          select: '-__v',
        })
        .select('-__v')
        .sort({ _id: -1 });

      res.json(users);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "An unexpected error occurred while fetching users." });
    }
  },

  getUserById: async ({ params }, res) => {
    try {
      const user = await User.findOne({ _id: params.id })
        .populate({
          path: 'thoughts friends',
          select: '-__v',
        })
        .select('-__v');

      if (!user) {
        res.status(404).json({ message: 'User not found with this ID' });
        return;
      }

      res.json(user);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "An unexpected error occurred while fetching the user." });
    }
  },

  createUser: async ({ body }, res) => {
    try {
      const createdUser = await User.create(body);
      res.json(createdUser);
    } catch (error) {
      console.error(error);
      res.status(400).json({ error: "An unexpected error occurred while creating the user." });
    }
  },

  updateUser: async ({ params, body }, res) => {
    try {
      const updatedUser = await User.findOneAndUpdate(
        { _id: params.id },
        body,
        { new: true, runValidators: true }
      );

      if (!updatedUser) {
        res.status(404).json({ message: 'User not found with this ID' });
        return;
      }

      res.json(updatedUser);
    } catch (error) {
      console.error(error);
      res.status(400).json({ error: "An unexpected error occurred while updating the user." });
    }
  },

  deleteUser: async ({ params }, res) => {
    try {
      const deletedUser = await User.findOneAndDelete({ _id: params.id });

      if (!deletedUser) {
        res.status(404).json({ message: 'User not found with this ID' });
        return;
      }

      await Thought.deleteMany({ username: deletedUser.username });

      res.json({ message: 'User and associated thoughts deleted' });
    } catch (error) {
      console.error(error);
      res.status(400).json({ error: "An unexpected error occurred while deleting the user." });
    }
  },

  addFriend: async ({ params }, res) => {
    try {
      const updatedUser = await User.findOneAndUpdate(
        { _id: params.userId },
        { $push: { friends: params.friendId } },
        { new: true, runValidators: true }
      );

      if (!updatedUser) {
        res.status(404).json({ message: 'User not found with this ID' });
        return;
      }

      res.json(updatedUser);
    } catch (error) {
      console.error(error);
      res.json({ error: "An unexpected error occurred while adding the friend." });
    }
  },
  
  removeFriend: async ({ params }, res) => {
    try {
      const updatedUser = await User.findOneAndUpdate(
        { _id: params.userId },
        { $pull: { friends: params.friendId } },
        { new: true }
      );

      if (!updatedUser) {
        res.status(404).json({ message: 'User not found with this ID' });
        return;
      }

      res.json(updatedUser);
    } catch (error) {
      console.error(error);
      res.json({ error: "An unexpected error occurred while removing the friend." });
    }
  },
};

module.exports = userController;
