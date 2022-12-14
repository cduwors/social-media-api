const { User } = require("../models");

const userController = {
	//get all Users
	getAllUsers(req, res) {
		User.find({})
			.populate({
				path: "thoughts",
				select: "-__v",
			})
			.select("-__v")
			.sort({ _id: -1 })
			.then((dbUserData) => res.json(dbUserData))
			.catch((err) => {
				console.log(err);
				res.sendStatus(400);
			});
	},

	//get one User
	getUserById({ params }, res) {
		User.findOne({ _id: params.id })
			.populate({
				path: "thoughts",
				select: "-__v",
			})
			.select("-__v")
			.then((dbUserData) => res.json(dbUserData))
			.catch((err) => {
				console.log(err);
				res.sendStatus(400);
			});
	},

	// create User
	createUser({ body }, res) {
		User.create(body)
			.then((dbUserData) => res.json(dbUserData))
			.catch((err) => res.json(err));
	},

	//update user by id
	updateUser({ params, body }, res) {
		//runValidators on an update explicitly tells app to validate new info that is being updated
		User.findOneAndUpdate({ _id: params.id }, body, {
			new: true,
			runValidators: true,
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

	//delete user by id
	deleteUser({ params }, res) {
		User.findOneAndDelete({ _id: params.id })
			.then((dbUserData) => res.json(dbUserData))
			.catch((err) => res.json(err));
	},

	//add friend
	addFriend(rec, res) {
		User.findOneAndUpdate(
			{ _id: rec.params.userId },
			{ $addToSet: { friends: rec.params.friendId } },
			{ new: true }
		)
			.then((dbUserData) => {
				if (!dbUserData) {
					return res
						.status(404)
						.json({ message: "No user found with this id" });
				}
				res.json(dbUserData);
			})
			.catch((err) => res.json(err));
	},
	//delete friend
	removeFriend(rec, res) {
		User.findOneAndUpdate(
			{ _id: rec.params.userId },
			{ $pull: { friends: rec.params.friendId } },
			{ new: true }
		)
			.then((dbUserData) => {
				if (!dbUserData) {
					return res
						.status(404)
						.json({ message: "No user found with this id" });
				}
				res.json(dbUserData);
			})
			.catch((err) => res.json(err));
	}
};

module.exports = userController;
