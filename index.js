const express = require("express");
const app = express();
const { initialiseDatabse } = require("./db/db.connect");
const Recipes = require("./models/recipes.models");

app.use(express.json());

initialiseDatabse();

async function createRecipes(newRecipe) {
  try {
    const recipe = new Recipes(newRecipe);
    const savedRecipe = await recipe.save();
    return savedRecipe;
  } catch (error) {
    throw error;
  }
}

const cors = require("cors");
const corsOptions = {
  origin: "*",
  credentials: true,
  optionSuccessStatus: 200,
};

app.use(cors(corsOptions));

app.post("/recipes", async (req, res) => {
  try {
    const savedRecipe2 = await createRecipes(req.body);
    res
      .status(201)
      .json({ message: "Recipe added successfully.", recipe: savedRecipe2 });
  } catch (error) {
    res.status(500).json({ error: "Failed to save the recipe" });
  }
});

async function readallRecipes() {
  try {
    const allRecipes = await Recipes.find();
    return allRecipes;
  } catch (error) {
    console.log(`Error in reading the recipes ${error}`);
  }
}

app.get("/recipes", async (req, res) => {
  try {
    const allRecipes2 = await readallRecipes();
    if (allRecipes2.length != 0) {
      res.json(allRecipes2);
    } else {
      res.status(404).json({ error: "No Recipes Found." });
    }
  } catch (error) {
    res
      .status(500)
      .json({ error: "Failed to fetch the recipes through APIs." });
  }
});

async function getRecipesByTitle(recipeTitle) {
  try {
    const foundRecipe = await Recipes.findOne({ title: recipeTitle });
    return foundRecipe;
  } catch (error) {
    console.error(`${error} in getting recipe through title.`);
  }
}

app.get("/recipes/category/:recipeTitle", async (req, res) => {
  try {
    const foundRecipe2 = await getRecipesByTitle(req.params.recipeTitle);
    if (foundRecipe2 != 0) {
      res.json(foundRecipe2);
    } else {
      res.status(404).json({ error: "No Recipes Found." });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch the recipe." });
  }
});

async function getRecipesByAuthor(recipeAuthor) {
  try {
    const foundRecipe = await Recipes.findOne({ author: recipeAuthor });
    return foundRecipe;
  } catch (error) {
    console.log(`${error} while getting recipes through author`);
  }
}

app.get("/recipes/authors/:authorName", async (req, res) => {
  try {
    const foundRecipe2 = await getRecipesByAuthor(req.params.authorName);
    if (foundRecipe2 != 0) {
      res.json(foundRecipe2);
    } else {
      res.status(404).json({ error: "No Recipes Found." });
    }
  } catch (error) {
    res
      .status(500)
      .json({ error: "Failed to fetch the recipes through author name." });
  }
});

async function getRecipesByDifficulty(difficultyLevel) {
  try {
    const foundRecipe = await Recipes.findOne({ difficulty: difficultyLevel });
    return foundRecipe;
  } catch (error) {
    console.log(`${error} while getting recipes through difficulty level.`);
  }
}

app.get("/recipes/difficulty/:difficultyLevel", async (req, res) => {
  try {
    const foundRecipe2 = await getRecipesByDifficulty(
      req.params.difficultyLevel
    );
    if (foundRecipe2 != 0) {
      res.json(foundRecipe2);
    } else {
      res.status(404).json({ error: "No Recipes Found." });
    }
  } catch (error) {
    res.status(500).send({ error: "Failed to fetch the recipes." });
  }
});

async function updateRecipeByID(recipeID, dataToUpdate) {
  try {
    const updatedRecipe = await Recipes.findByIdAndUpdate(
      recipeID,
      dataToUpdate,
      { new: true }
    );
    return updatedRecipe;
  } catch (error) {
    console.log(`Error in updating the recipe ${error}.`);
  }
}

app.post("/recipes/:recipeID", async (req, res) => {
  try {
    const updatedRecipe2 = await updateRecipeByID(
      req.params.recipeID,
      req.body
    );
    if (updatedRecipe2) {
      res.status(200).json({
        message: "Recipe updated successfully.",
        recipe: updatedRecipe2,
      });
    } else {
      res.status(404).json({ error: "Recipe not found" });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to update the recipe." });
  }
});

async function updateRecipeByTitle(recipeTitle, dataToUpdate) {
  try {
    const updatedRecipe = await Recipes.findOneAndUpdate(
      { title: recipeTitle },
      dataToUpdate,
      {
        new: true,
      }
    );
    return updatedRecipe;
  } catch (error) {
    console.log(`Error in updating the recipe ${error}`);
  }
}

app.post("/recipeName/:recipeTitle", async (req, res) => {
  try {
    const updatedRecipe2 = await updateRecipeByTitle(
      req.params.recipeTitle,
      req.body
    );
    if (updatedRecipe2) {
      res.status(200).json({
        message: "Recipe updated successfully.",
        recipe: updatedRecipe2,
      });
    } else {
      res.status(404).json({ error: "Recipe not found." });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to update the recipe" });
  }
});

async function deleteRecipeByID(recipeID) {
  try {
    const deleteRecipe = await Recipes.findByIdAndDelete(recipeID);
    return deleteRecipe;
  } catch (error) {
    console.log(`Error ocurred while deleting the recipe: ${error}`);
  }
}

app.delete("/recipes/:recipeID", async (req, res) => {
  try {
    const deletedRecipe = await deleteRecipeByID(req.params.recipeID);
    res.status(200).json({ message: "Recipe deleted successfully." });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete the recipe." });
  }
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on ${PORT} PORT.`);
});
