const express = require("express");
const router = express.Router();
const Recipe = require("../../Models/Recipe");
const { check, validationResult } = require("express-validator");
const auth = require("../../middleware/auth");
const { findById, findOneAndUpdate } = require("../../Models/Recipe");

//@route    POST api/recipes
//@desc     Post a recipe (title & description) to user account
//@access   Private
router.post(
  "/",
  [
    auth,
    [
      check("title", "Recipe title is required").not().isEmpty(),
      check("description", "Recipe description is required").not().isEmpty(),
    ],
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) res.status(400).json({ errors: errors.array() });

    // Destructure all elements in model
    const {
      name,
      title,
      description,
      ingredients,
      procedures,
      serves,
      preptime,
      cooktime,
      pairswith,
      tags,
    } = req.body;

    // Build a recipe object with all elements available in request
    const recipeFields = {};
    const username = await User.findById({ _id: req.user.id });
    recipeFields.user = req.user.id;

    if (username) recipeFields.name = username.name;
    if (title) recipeFields.title = title;
    if (description) recipeFields.description = description;
    if (ingredients) recipeFields.ingredients = ingredients;
    if (procedures) recipeFields.procedures = procedures;
    if (serves) recipeFields.serves = serves;
    if (preptime) recipeFields.preptime = preptime;
    if (cooktime) recipeFields.cooktime = cooktime;
    if (pairswith) recipeFields.pairswith = pairswith;
    if (tags) recipeFields.tags = tags;

    //Grab Ingredients from Req
    const recipeIngredients = req.body.ingredients;

    //Map Over Each Ingredient Obj in Req and Push to Ingredients Array
    recipeFields.ingredients = [];
    recipeIngredients.map((ingredient) =>
      recipeFields.ingredients.push(ingredient)
    );

    //Grab Procedures from Req
    const recipeProcedures = req.body.procedures;

    //Map Over Each Ingredient Obj in Req and Push to Ingredients Array
    recipeFields.procedures = [];
    recipeProcedures.map((procedure) =>
      recipeFields.procedures.push(procedure)
    );

    // Assign recipe object to new Recipe model and save & return
    try {
      const recipe = new Recipe(recipeFields);
      await recipe.save();
      res.send(recipe);
    } catch (err) {
      console.error(err);
      res.status(500).send("Server Error");
    }
  }
);

//@route    GET api/recipes/myrecipes
//@desc     Get all recipes for a user
//@access   Private
router.get("/myrecipes", auth, async (req, res) => {
  try {
    const userRecipes = await Recipe.find({ user: req.user.id });
    res.send(userRecipes);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
});

//@route    GET api/recipes/myrecipes/:id
//@desc     Get a user's recipe by recipe ID
//@access   Private
router.get("/myrecipes/:id", auth, async (req, res) => {
  try {
    const userRecipe = await Recipe.findById(req.params.id);
    if (!userRecipe) res.status(400).send("Recipe Not Found");
    res.send(userRecipe);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
});

//@route    GET api/recipes/recipesfeed
//@desc     Get all recipes in DB
//@access   Private
router.get("/recipesfeed", auth, async (req, res) => {
  try {
    const allRecipes = await Recipe.find();
    res.send(allRecipes);
  } catch (err) {}
});

//@route    PUT api/recipes/:id
//@desc     Update a recipe
//@access   Private
router.put("/:id", auth, async (req, res) => {
  const recipe = await Recipe.findById(req.params.id);

  const {
    title,
    description,
    ingredients,
    procedures,
    serves,
    preptime,
    cooktime,
    pairswith,
    tags,
  } = req.body;

  // Build a recipe object with all elements available in request
  const recipeFields = {};
  recipeFields.user = req.user.id;
  if (title) recipeFields.title = title;
  if (description) recipeFields.description = description;
  if (ingredients) recipeFields.ingredients = ingredients;
  if (procedures) recipeFields.procedures = procedures;
  if (serves) recipeFields.serves = serves;
  if (preptime) recipeFields.preptime = preptime;
  if (cooktime) recipeFields.cooktime = cooktime;
  if (pairswith) recipeFields.pairswith = pairswith;
  if (tags) recipeFields.tags = tags;

  //Grab Ingredients from Req
  const recipeIngredients = req.body.ingredients;

  //Map Over Each Ingredient Obj in Req and Push to Ingredients Array
  recipeFields.ingredients = [];
  recipeIngredients.map((ingredient) =>
    recipeFields.ingredients.push(ingredient)
  );

  //Grab Procedures from Req
  const recipeProcedures = req.body.procedures;

  //Map Over Each Ingredient Obj in Req and Push to Ingredients Array
  recipeFields.procedures = [];
  recipeProcedures.map((procedure) => recipeFields.procedures.push(procedure));

  try {
    if (recipe) {
      updatedRecipe = await Recipe.findOneAndUpdate(
        { user: req.user.id, _id: req.params.id },
        { $set: recipeFields },
        { new: true, useFindAndModify: false }
      );
    }
    res.send(updatedRecipe);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
  if (recipe) {
    updatedRecipe = await Recipe.findOneAndUpdate(
      { user: req.user.id, _id: req.params.id },
      { $set: recipeFields },
      { new: true }
    );
  }
  res.send(updatedRecipe);
});

//@route    DELETE api/recipes/:id
//@desc     Delete a recipe
//@access   Private
router.delete("/:id", auth, async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);

    if (!recipe) return res.status(400).send("Recipe not found");

    if (recipe.user.toString() !== req.user.id)
      return res.status(401).send("Not authorized");

    await recipe.remove();
    res.json("Recipe Removed");
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
});

//@route    PUT api/recipes/like/:id
//@desc     Like a recipe
//@access   Private
router.put("/like/:id", auth, async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);

    //Check if recipe already liked by this user
    if (
      recipe.likes.filter((like) => like.user.toString() === req.user.id)
        .length > 0
    ) {
      return res.status(400).json({ msg: "Post already liked" });
    }

    recipe.likes.unshift({ user: req.user.id });
    await recipe.save();

    res.json(recipe.likes);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
});

//@route    PUT api/recipes/unlike/:id
//@desc     Unlike a recipe
//@access   Private
router.put("/unlike/:id", auth, async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);
    console.log(recipe.likes);
    //Check if user has already liked the post
    if (
      recipe.likes.filter((like) => like.user.toString() === req.user.id)
        .length === 0
    ) {
      res
        .status(400)
        .json({ msg: "Unable to unlike recipe. Recipe must first be liked" });
    }
    //Get index of user's like in recipe.likes array
    // Map over each like in array of recipe.likes and convert each to a string then find the index of the like that matches the req.user
    const removeIndex = recipe.likes
      .map((like) => like.user.toString())
      .indexOf(req.user.id);
    //Remove the like from the array of likes by index
    recipe.likes.splice(removeIndex, 1);

    await recipe.save();

    res.json(recipe.likes);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
});

//@route    POST api/recipes/comment/:id
//@desc     Comment on a recipe
//@access   Private
router.post(
  "/comment/:id",
  [auth, [check("text", "Comment cannot be blank").not().isEmpty()]],
  async (req, res) => {
    //Validation
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });

    try {
      const user = await User.findById(req.user.id);
      const recipe = await Recipe.findById(req.params.id);

      const newComment = {
        text: req.body.text,
        name: user.name,
        user: req.user.id,
      };

      recipe.comments.unshift(newComment);
      await recipe.save();
      res.json(recipe.comments);
    } catch (err) {
      console.error(err);
      res.status(500).send("Server Error");
    }
  }
);

//@route    DELETE api/recipes/comment/:id/:comment_id
//@desc     Delete comment on a recipe
//@access   Private
router.delete("/comment/:id/:comment_id", auth, async (req, res) => {
  try {
    //Get recipe by ID
    const recipe = await Recipe.findById(req.params.id);
    //Get comment from recipe by comment ID
    const comment = recipe.comments.find(
      (comment) => comment.id === req.params.comment_id
    );

    //Check if comment exists
    if (!comment)
      return res.status(404).json({ msg: "Comment does not exist" });

    //Check if comment belongs to user
    if (comment.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: "User not authorized" });
    }

    //Get index of comment to be removed
    const removeIndex = recipe.comments
      .map((comment) => comment.user.toString())
      .indexOf(req.user.id);

    //Remove comment from array of comments by index
    recipe.comments.splice(removeIndex, 1);

    await recipe.save();

    res.json(recipe.comments);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
});

module.exports = router;
