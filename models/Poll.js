import mongoose from "mongoose";

const pollSchema = new mongoose.Schema({
  question: String,
  options: [
    {
      text: String,
      votes: { type: Number, default: 0 },
    },
  ],
  likes: { type: Number, default: 0 },
  // store user identifiers who liked this poll so we can look up a user's liked polls
  likedBy: [{ type: String }],
  // keep track of votes by user so each user can vote only once per poll
  votesBy: [
    {
      userId: { type: String },
      optionIndex: { type: Number }
    }
  ],
}, { timestamps: true });

export default mongoose.model("Poll", pollSchema);
