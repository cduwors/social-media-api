const { User, Thought } = require("../models");

const thoughtController = {
	//get all thoughts
	getAllThoughts(req, res) {
		Thought.find({})
			.then((dbUserData) => res.json(dbUserData))
			.catch((err) => {
				console.log(err);
				res.sendStatus(400);
			});
	},

	//get thought by id
	getThoughtById({ params }, res) {
		Thought.findOne({ thoughtId: params.id })
			.then((dbUserData) => res.json(dbUserData))
			.catch((err) => {
				console.log(err);
				res.sendStatus(400);
			});
	},

	//add thought to user
	addThought({ params, body }, res) {
		console.log(body);
		Thought.create(body)
			.then(({ _id }) => {
				return User.findOneAndUpdate(
					{ _id: body.userId },
					{ $push: { thoughts: _id } },
					{ new: true }
				);
			})
			.then((dbUserData) => {
				if (!dbUserData) {
					res.status(404).json({ message: "No user found with this id" });
					return;
				}
				res.json(dbUserData);
			})
			.catch((err) => res.json(err));
	},

	//update Thought
	updateThought({ params, body }, res) {
		Thought.findOneAndUpdate({ thoughtId: params.id }, body, {
			new: true,
			runValidators: true,
		})
		.then((dbUserData) => {
			if(!dbUserData) {
				res.status(404).json({ message: "No user found with this id" });
				return;
			}
			res.json(dbUserData);
		})
		.catch((err) => res.json(err));
	},

	//add reaction to Thought
	addReaction({ params, body }, res) {
		Thought.findOneAndUpdate(
			{ _id: params.thoughtId },
			{ $push: { reactions: body } },
			{ new: true, runValidators: true }
		)
			.then((dbUserData) => {
				if (!dbUserData) {
					res.status(404).json({ message: "No user found with this id" });
					return;
				}
				res.json(dbUserData);
			})
			.catch((err) => res.json(err));
	},

	//remove thought
	removeThought({ params }, res) {
		Thought.findOneAndDelete({ _id: params.thoughtId })
			.then((deletedThought) => {
				if (!deletedThought) {
					return res.status(404).json({ message: "No thought with this id!" });
				}
				return User.findOneAndUpdate(
					{ thoughts: params.thoughtId },
					{ $pull: { thoughts: params.thoughtId } },
					{ new: true }
				);
			})
			.then((dbUserData) => {
				if (!dbUserData) {
					res.status(404).json({ message: "No user found with this id!" });
					return;
				}
				res.json(dbUserData);
			})
			.catch((err) => res.json(err));
	},

	//remove reaction
	removeReaction({ params }, res) {
		Thought.findOneAndUpdate(
			{ _id: params.thoughtId },
			{ $pull: { reactions: { reactionId: params.reactionId } } },
			{ new: true }
		)
			.then((dbUserData) => res.json(dbUserData))
			.catch((err) => res.json(err));
	},
};

module.exports = thoughtController;
