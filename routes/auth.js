const { Router, response } = require("express");
const router = require("express").Router();
const user = require("../models/user");
const admin = require("../config/firebase.config");

router.get("/login", async (req, res) => {
  if (!req.headers.authorization) {
    return res.status(500).send({ message: "Invalid Token" });
  }
  const token = req.headers.authorization.split(" ")[1];
  try {
    const decodeValue = await admin.auth().verifyIdToken(token);
    if (!decodeValue) {
      return res.status(505).json({ message: "UnAuthorized" });
    } else {
      // Checking user exists or not
      const userExists = await user.findOne({ user_id: decodeValue.user_id });
      if (!userExists) {
        newUserData(decodeValue, req, res);
      } else {
        updateNewUserData(decodeValue, req, res);
      }
    }
  } catch (e) {
    return res.status(505).json({ message: e });
  }
});

const newUserData = async (decodeValue, req, res) => {
  const newUser = new user({
    name: decodeValue.name,
    email: decodeValue.email,
    imageURL: decodeValue.picture,
    user_id: decodeValue.user_id,
    email_verified: decodeValue.email_verified,
    role: "member",
    auth_time: decodeValue.auth_time,
    playlist: [],
  });

  try {
    const savedUser = await newUser.save();
    res.status(200).send({ user: savedUser });
  } catch (e) {
    res.status(400).send({ success: false, msg: e });
  }
};

const updateNewUserData = async (decodeValue, req, res) => {
  const filter = { user_id: decodeValue.user_id };
  const options = {
    upsert: true,
    new: true,
  };

  try {
    const result = await user.findOneAndUpdate(
      filter,
      {
        auth_time: decodeValue.auth_time,
      },
      options
    );
    res.status(200).send({ user: result });
  } catch (e) {
    res.status(400).send({ success: false, msg: e });
  }
};

router.put("/newPlaylist/:userId", async (req, res) => {
  const filter = { _id: req.params.userId };
  const playlist = req.body.data.playlist;
  const options = {
    upsert: true,
    new: true,
  };
  // console.log(filter);

  try {
    const result = await user.findOneAndUpdate(
      filter,
      { playlist: playlist },
      options
    );
    res.status(200).send({ user: result });
  } catch (error) {
    res.status(400).send({ success: false, msg: error });
  }
});

router.put("/newPlaylist/:userId", async (req, res) => {
  const filter = { _id: req.params.userId };
  const playlist = req.body.data.playlist;
  const options = {
    upsert: true,
    new: true,
  };
  // console.log(filter);

  try {
    const result = await user.findOneAndUpdate(
      filter,
      { playlist: playlist },
      options
    );
    res.status(200).send({ user: result });
  } catch (error) {
    res.status(400).send({ success: false, msg: error });
  }
});

router.get("/getUsers", async (req, res) => {
  const options = {
    sort: {
      createdAt: 1,
    },
  };
  const cursor = await user.find(options);
  if (cursor) {
    res.status(200).send({ success: true, data: cursor });
  } else {
    res.status(400).send({ success: false, msg: "No Data Found" });
  }
});

router.put("/updateRole/:userId", async (req, res) => {
  const filter = { _id: req.params.userId };
  const role = req.body.data.role;

  try {
    const result = await user.findOneAndUpdate(filter, { role: role });
    res.status(200).send({ user: result });
  } catch (error) {
    res.status(400).send({ success: false, msg: error });
  }
});

router.put("/updatePremium/:userId", async (req, res) => {
  const filter = { _id: req.params.userId };
  const permission = req.body.data.permission;

  try {
    const result = await user.findOneAndUpdate(filter, {
      permission: permission,
    });
    res.status(200).send({ user: result });
  } catch (error) {
    res.status(400).send({ success: false, msg: error });
  }
});

router.delete("/deleteUser/:userId", async (req, res) => {
  const filter = { _id: req.params.userId };
  const result = await user.deleteOne(filter);
  if (result.deletedCount === 1) {
    return res
      .status(200)
      .send({ success: true, msg: "User Removed Successfully", data: result });
  } else {
    return res.status(400).send({ success: false, msg: "User Not Found" });
  }
});

module.exports = router;
