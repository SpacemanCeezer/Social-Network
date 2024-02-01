// thoughtController.js

const { Thought } = require('../models');

const thoughtController = {
  getAllThoughts: async (req, res) => {
    try {
      const thoughts = await Thought.find({})
        .populate({
          path: 'reactions',
          select: '-__v',
        })
        .select('-__v')
        .sort({ createdAt: -1 });

      res.json(thoughts);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "An unexpected error occurred while fetching thoughts." });
    }
  },

  getThoughtById: async ({ params }, res) => {
    try {
      const thought = await Thought.findOne({ _id: params.id })
        .populate({
          path: 'reactions',
          select: '-__v',
        })
        .select('-__v');

      if (!thought) {
        res.status(404).json({ message: 'Thought not found with this ID' });
        return;
      }

      res.json(thought);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "An unexpected error occurred while fetching the thought." });
    }
  },

  createThought: async ({ body }, res) => {
    try {
      const { _id } = await Thought.create(body);
      const updatedUser = await User.findOneAndUpdate(
        { username: body.username },
        { $push: { thoughts: _id } },
        { new: true, runValidators: true }
      );

      if (!updatedUser) {
        res.status(404).json({ message: 'No user found with this username' });
        return;
      }

      res.json({ message: 'Thought created successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "An unexpected error occurred while creating the thought." });
    }
  },

  updateThought: async ({ params, body }, res) => {
    try {
      const updatedThought = await Thought.findOneAndUpdate(
        { _id: params.id },
        body,
        { new: true, runValidators: true }
      );

      if (!updatedThought) {
        res.status(404).json({ message: 'Thought not found with this ID' });
        return;
      }

      res.json(updatedThought);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "An unexpected error occurred while updating the thought." });
    }
  },

  deleteThought: async ({ params }, res) => {
    try {
      const deletedThought = await Thought.findOneAndDelete({ _id: params.id });

      if (!deletedThought) {
        res.status(404).json({ message: 'Thought not found with this ID' });
        return;
      }

      res.json({ message: 'Thought deleted successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "An unexpected error occurred while deleting the thought." });
    }
  },

  createReaction: async ({ params, body }, res) => {
    try {
      const updatedThought = await Thought.findOneAndUpdate(
        { _id: params.thoughtId },
        { $push: { reactions: body } },
        { new: true, runValidators: true }
      );

      if (!updatedThought) {
        res.status(404).json({ message: 'Thought not found with this ID' });
        return;
      }

      res.json(updatedThought);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "An unexpected error occurred while adding the reaction." });
    }
  },

  deleteReaction: async ({ params }, res) => {
    try {
      const updatedThought = await Thought.findOneAndUpdate(
        { _id: params.thoughtId },
        { $pull: { reactions: { reactionId: params.reactionId } } },
        { new: true }
      );

      res.json(updatedThought);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "An unexpected error occurred while deleting the reaction." });
    }
  },
};

module.exports = thoughtController;

