const { Schema, model } = require("mongoose");
const dateFormat = require("../utils/dateFormat");

const UserSchema = new Schema(
	{
		userName: {
			type: String,
			unique: true,
			required: "You must provide a valid username!",
			trim: true,
		},
		email: {
			type: String,
			trim: true,
			lowercase: true,
			unique: true,
			required: "Email address is required",
			match: [
				/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
				"Please enter a valid email address",
			],
		},
		thoughts: [
			{
				type: Schema.Types.ObjectId,
				ref: "Thought",
			},
		],
		friends: [
			{
				type: Schema.Types.ObjectId,
				ref: "User",
			},
		],
	},
	{
		toJSON: {
			virtuals: true,
			// getters: true,
		},
		id: false,
	}
);

//get friend count and retrieve length of user's friend array
UserSchema.virtual("friendCount").get(function () {
	return this.friends.length;
	// reduce((total, friends) => total + friends.length + 1, 0);
});

const User = model("User", UserSchema);

module.exports = User;
