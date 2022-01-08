const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");
const Contacts = require("../../models/Contacts");
const User = require("../../models/User");
const { check, validationResult } = require("express-validator/check");

// @route         GET api/contacts
// @description   Test route
// @access        Public
router.get("/", auth, async (req, res) => {
    try {
      const contacts = await Contacts.find({ user: req.user.id }).populate(
        "user", // from the "user" collection, get "name" and "avatar" as well
        ["name", "email"]
      );
  
      // No contacts found?
      if (!contacts) {
        return res.status(400).json({ msg: "There is no contacts for this user" });
      }
  
      res.json(contacts);
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server Error");
    }
  });


// @route         POST api/contacts/
// @description   Create or update user contacts
// @access        Private
router.post(
    "/",
    [
      auth
    ],
    async (req, res) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
  
      const {
        status
      } = req.body;
  
      // Build contacts object
      const contactsFields = {};
      contactsFields.user = req.user.id;
      if (status) contactsFields.status = status;
      // Build social object
  
      try {
        let contacts = await Contacts.findOne({ user: req.user.id });
        let newContact = await Contacts.create({ user: req.user.id});
        
  
        // If contacts is not found, let's create it
        newContact = new Contacts(contactsFields);
        await newContact.save();
        res.json(newContact);
      } catch (err){
        console.error(err.message);
        res.status(500).send("Server Error");
      }
    }
  );
  
  // // @route         GET api/contacts
  // // @description   Get all contactss
  // // @access        Public
  // router.get("/", async (req, res) => {
  //   try {
  //     const contactss = await Contacts.find().populate("user", ["name", "avatar"]);
  //     res.json(contactss);
  //   } catch (err) {
  //     console.error(err.message);
  //     res.status(500).send("Server Error");
  //   }
  // });
  
  // @route         GET api/contacts/user/:user_id
  // @description   Get contacts by user ID
  // @access        Public
  router.get("/user/:user_id", async (req, res) => {
    try {
      const contacts = await Contacts.findOne({
        user: req.params.user_id
      }).populate("user", ["name", "avatar"]);
  
      if (!contacts) {
        return res.status(400).json({ msg: "Contacts not found" });
      }
  
      res.json(contacts);
    } catch (err) {
      console.error(err.message);
      if (err.kind == "ObjectId") {
        return res.status(400).json({ msg: "Contacts not found" });
      }
      res.status(500).send("Server Error");
    }
  });
  
  // @route         DELETE api/contacts
  // @description   Delete contacts, user and posts
  // @access        Private
  router.delete("/", auth, async (req, res) => {
    try {
      // @todo - remove users posts
      // Remove contacts
      await Contacts.findOneAndRemove({ user: req.user.id });
  
      // Remove user
      await User.findOneAndRemove({ _id: req.user.id });
  
      res.json({ msg: "User deleted" });
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server Error");
    }
  });
  
  // @route         PUT api/contacts/experience
  // @description   Add contacts experience
  // @access        Private
  router.put(
    "/experience",
    [
      auth,
      [
        check("title", "Title is required")
          .not()
          .isEmpty(),
        check("company", "Company is required")
          .not()
          .isEmpty(),
        check("from", "From date is required")
          .not()
          .isEmpty()
      ]
    ],
    async (req, res) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
  
      const {
        title,
        company,
        location,
        from,
        to,
        current,
        description
      } = req.body;
  
      const newExp = {
        title,
        company,
        location,
        from,
        to,
        current,
        description
      };
  
      try {
        const contacts = await Contacts.findOne({ user: req.user.id });
  
        contacts.experience.unshift(newExp); // like .push(), instead it pushes it to the beginning
  
        await contacts.save();
  
        res.json(contacts);
      } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error.");
      }
    }
  );
  
  // @route         DELETE api/contacts/experience/:exp_id
  // @description   Delete experience from contacts
  // @access        Private
  router.delete("/experience/:exp_id", auth, async (req, res) => {
    try {
      const contacts = await Contacts.findOne({ user: req.user.id });
  
      // Get remove index
      const removeIndex = contacts.experience
        .map(item => item.id)
        .indexOf(req.params.exp_id);
  
      contacts.experience.splice(removeIndex, 1);
  
      await contacts.save();
  
      res.json(contacts);
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server Error.");
    }
  });
module.exports = router;
