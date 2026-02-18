import User from "../models/User.js";
import FriendRequest from "../models/friendRequest.js";

export async function getRecommendedUsers(req, res) {
    try {
        const currentUserId = req.user._id;
        const currentUser = req.user;

        const recommendedUsers = await User.find({
            $and: [
                {_id: { $ne: currentUserId }}, // Exclude current user
                {_id: { $nin: currentUser.friends }}, // Exclude current user's friends
                {isOnboarded: true}
            ]
        })
        res.status(200).json(recommendedUsers);
    } catch (error) {
        console.error("Error in getRecommendedUsers controller:", error.message);
        res.status(500).json({ message: "Internal server error" });
    }
}

export async function getMyFriends(req, res) {
   try {
    const user = await User.findById(req.user._id)
    .select("friends")
    .populate("friends","fullName profilePic nativeLanguage learningLanguage");
    res.status(200).json(user.friends);
   } catch (error) {
    console.error("Error in getMyFriends controller:", error.message);
    res.status(500).json({ message: "Internal server error" });
   } 
}

export async function sendFriendRequest(req, res) {
    try {
        const myId = req.user._id;
        const { id: recepientId } = req.params

        //prevent sending request to self
        if (myId === recepientId) {
            return res.status(400).json({ message: "You cannot send a friend request to yourself" });
        }

        const recepient = await User.findById(recepientId);
        if (!recepient) {
            return res.status(404).json({ message: "Recepient not found" });
        }

        // Check if user is already a friend
        if (recepient.friends.includes(myId)) {
            return res.status(400).json({ message: "You are already friends with this user" });
        }

        // check if a req already exists
        const existingRequest = await FriendRequest.findOne({
            $or: [
                {sender :myId, recepient: recepientId},
                {sender: recepientId, recepient: myId}, 
            ],
        });

        if (existingRequest) {
            return res.status(400).json({ message: "A friend request already exists between you and this user" });
        }

        // Create friend request
        const friendRequest = await FriendRequest.create({
            sender: myId,
            recepient: recepientId,
        });

        res.status(201).json(friendRequest);

    } catch (error) {
        console.error("Error in sendFriendRequest controller:", error.message);
        res.status(500).json({ message: "Internal server error" });
    }
}


export async function acceptFriendRequest(req, res) {
    try {
        const {id:requestId} = req.params
        const friendRequest = await FriendRequest.findById(requestId);

        if (!friendRequest) {
            return res.status(404).json({ message: "Friend request not found" });
        }

        //verify the current user is the recepient
        if (friendRequest.recepient.toString() !== req.user.id) {
            return res.status(403).json({ message: "You are not authorized to accept this friend request" });
        }

        friendRequest.status = "accepted";
        await friendRequest.save();

        // add each user to the other's friend array
        // $addToSet: adds elements to an array only if they do not already exist
        await User.findByIdAndUpdate(friendRequest.sender, 
            {$addToSet: { friends: friendRequest.recepient}
        });

        await User.findByIdAndUpdate(friendRequest.recepient,
            {$addToSet: { friends: friendRequest.sender}
        });
        res.status(200).json({ message: "Friend request accepted" });

    } catch (error) {
        console.error("Error in acceptFriendRequest controller:", error.message);
        res.status(500).json({ message: "Internal server error" });
    }
}

export async function getFriendRequests(req, res) {
    try {
        const incomingReqs = await FriendRequest.find({
            recepient: req.user.id,
            status: "pending"
        }).populate("sender","fullName profilePic nativeLanguage learningLanguage");

        const acceptedReqs = await FriendRequest.find({
            sender: req.user._id,
            status: "accepted"
        }).populate("recepient","fullName, profilePic"); 

        res.status(200).json({ incomingReqs, acceptedReqs });
    } catch (error) {
        console.error("Error in getFriendRequests controller:", error.message);
        res.status(500).json({ message: "Internal server error" });
    }
}

export async function getOutgoingFriendReqs(req, res) {
    try {
        const outgoingRequests = await FriendRequest.find({
            sender: req.user.id,
            status: "pending"
        }).populate("recepient","fullName profilePic nativeLanguage learningLanguage");
        res.status(200).json(outgoingRequests);
    } catch (error) {
        console.error("Error in getOutgoingFriendReqs controller:", error.message);
        res.status(500).json({ message: "Internal server error" });
    }
}
