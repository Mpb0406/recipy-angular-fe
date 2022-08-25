const express = require("express");
const router = express.Router();
const Profile = require("../../Models/Profile");
const auth = require("../../middleware/auth");

//@route    GET api/profile
//@desc     Get My Profile
//@access   Private
router.get("/", auth, async (req, res) => {
  try {
    const myProfile = await Profile.findOne({ user: req.user.id });

    if (!myProfile) {
      return res.send("You do not have a profile. Please create one.");
    }

    res.json(myProfile);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
});

//@route    POST api/profile
//@desc     Create or Edit New User Profile
//@access   Private
router.post("/", auth, async (req, res) => {
  //Destructure each item from req.body
  const { avatar, bio, instagram, twitter, facebook, youtube } = req.body;
  const user = await User.findById({ _id: req.user.id });

  //Build Profile Object
  const profileFields = {};
  profileFields.user = req.user.id;
  profileFields.avatar = user.email;

  if (bio) profileFields.bio = bio;
  profileFields.name = user.name;
  profileFields.memberSince = user.date;

  //Build Social Media Object
  profileFields.social = {};
  if (instagram) profileFields.social.instagram = instagram;
  if (twitter) profileFields.social.twitter = twitter;
  if (facebook) profileFields.social.facebook = facebook;
  if (youtube) profileFields.social.youtube = youtube;

  try {
    let profile = await Profile.findOne({ user: req.user.id });
    //Update Profile if one exists
    if (profile) {
      //Update Profile
      profile = await Profile.findOneAndUpdate(
        { user: req.user.id },
        { $set: profileFields },
        { new: true, useFindAndModify: true }
      );
      return res.json(profile);
    }

    //Create profile if none exist for user
    profile = new Profile(profileFields);
    await profile.save();
    res.json(profile);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
});

//@route    PUT api/profile/bookmark/:id
//@desc     Bookmark a Recipe
//@access   Private
router.put("/bookmark/:id", auth, async (req, res) => {
  //Find Recipe
  const recipe = await Recipe.findOne({ _id: req.params.id });

  const profile = await Profile.findOne({ user: req.user.id });

  if (
    profile.bookmarks.filter(
      (bookmark) => bookmark._id.toString() === req.params.id
    ).length > 0
  ) {
    return res.status(400).json({ msg: "Recipe already bookmarked" });
  }

  profile.bookmarks.push({
    _id: recipe._id,
    user: recipe.user._id,
    title: recipe.title,
    description: recipe.description,
    tags: recipe.tags,
    likes: recipe.likes,
  });
  await profile.save();
  res.json(profile.bookmarks);
});

//@route    PUT api/profile/remove-bookmark/:id
//@desc     Remove a Bookmarked Recipe
//@access   Private
router.put("/remove-bookmark/:id", auth, async (req, res) => {
  const profile = await Profile.findOne({ user: req.user.id });

  //   Check if Recipe Has Been Bookmarked
  if (
    profile.bookmarks.filter(
      (bookmark) => bookmark.id.toString() === req.params.id
    ).length === 0
  ) {
    return res.status(400).json({ msg: "Recipe has not yet been bookmarked" });
  }

  //Get Remove Index
  const removeIndex = profile.bookmarks
    .map((bookmark) => bookmark.id.toString())
    .indexOf(req.params.id);

  profile.bookmarks.splice(removeIndex, 1);

  await profile.save();
  res.json(profile.bookmarks);
});

//@route    PUT api/profile/follow/:id
//@desc     Follow a User
//@access   Private
router.put("/follow/:id", auth, async (req, res) => {
  //Get User to Follow
  const user = await User.findById({ _id: req.params.id }).select("name");
  const userProfile = await Profile.findOne({ user: req.params.id });

  //Get My Profile
  const me = await Profile.findOne({ user: req.user.id });
  const myName = await User.findById({ _id: req.user.id }).select("name");

  //Check if User is Already Followed
  if (me.following.filter((follow) => follow.id === req.params.id).length > 0) {
    return res.status(400).json({ msg: "You are already following this user" });
  }

  try {
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
  //Push User Onto Profile.Following
  me.following.push(user);

  //Push Me Onto User's Followers
  userProfile.followers.push(myName);

  await me.save();
  await userProfile.save();
  res.json(me.following);
});

//@route    PUT api/profile/unfollow/:id
//@desc     Unfollow a User
//@access   Private
router.put("/unfollow/:id", auth, async (req, res) => {
  //Get My Profile and User
  const myProfile = await Profile.findOne({ user: req.user.id });
  const me = await User.findById({ _id: req.user.id }).select("-password");

  //Get User Profile and User Info
  const userProfile = await Profile.findOne({ user: req.params.id });
  const user = await User.findById({ _id: req.params.id }).select("-password");

  //Check if User is Followed
  if (
    myProfile.following.filter((follow) => follow.id === req.params.id)
      .length === 0
  ) {
    return res.send("You are not following this user");
  }

  try {
    //Get Remove Index
    const removeIndex = myProfile.following
      .map((follow) => follow.id.toString())
      .indexOf(req.params.id);

    //Splice Out User From My Following Array Using removeIndex
    myProfile.following.splice(removeIndex, 1);
    await myProfile.save();

    //Remove Me from User's Followers
    const removeMyself = userProfile.followers
      .map((follower) => follower.id.toString())
      .indexOf(req.user.id);

    //Splice Myself Out of User's Followers Using removeMyself
    userProfile.followers.splice(removeMyself, 1);
    await userProfile.save();
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }

  res.json(myProfile.following);
});

//@route    PUT api/profile/:id
//@desc     Unfollow a User
//@access   Private
router.get("/:id", auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.params.id });

    if (!profile) {
      res.send("Profile Not Found");
    }

    res.json(profile);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
});

module.exports = router;
