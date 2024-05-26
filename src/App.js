import React, { useState } from "react";
import "./index.css";
import runChat from "./config/gemini";

function App() {
  const [ingredients, setIngredients] = useState("");
  const [type, setType] = useState("");
  const [region, setRegion] = useState("");
  const [generatedRecipe, setGeneratedRecipe] = useState("");
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showHome, setShowHome] = useState(true);
  const [showAbout, setShowAbout] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const query = `Generate a creative and unique recipe using the following ingredients: ${ingredients}. The recipe should be innovative and not a traditional dish. Include interesting and unexpected flavor combinations and cooking techniques. The type of dish is ${type} and it should reflect the culinary style of the ${region} region.`;

    try {
      const response = await runChat(query);

      setGeneratedRecipe(response);
      setIsModalOpen(true); // Open the modal when the recipe is generated
      setError(null); // Clear any previous errors
    } catch (error) {
      console.error("Error fetching recipe:", error);
      setError("Failed to generate recipe. Please try again."); // Update error state
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setGeneratedRecipe("");
  };

  const showHomeSection = () => {
    setShowHome(true);
    setShowAbout(false);
  };

  const showAboutSection = () => {
    setShowHome(false);
    setShowAbout(true);
  };

  return (
    <div className="wrapper">
      <nav className="nav">
        <div className="nav-logo">
          <h1>AI Based Creative Cooking Web Application</h1>
        </div>
        <div className="nav-button">
          <button className="btn" onClick={showHomeSection}>
            Home
          </button>
          <button className="btn" onClick={showAboutSection}>
            About Us
          </button>
        </div>
      </nav>

      {showHome && (
        <div className="form-box">
          <div className="home-container">
            <header>Home</header>
            <form onSubmit={handleSubmit}>
              <div className="input-box">
                <input
                  type="text"
                  className="input-field"
                  placeholder="Enter Ingredients..."
                  value={ingredients}
                  onChange={(e) => setIngredients(e.target.value)}
                  required
                />
              </div>
              <div className="input-box">
                <select
                  name="food-type"
                  id="food-type"
                  className="input-field"
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  required
                >
                  <option value="">Select Type</option>
                  <option value="veg">Vegetarian</option>
                  <option value="nonveg">Non-Vegetarian</option>
                </select>
              </div>
              <div className="input-box">
                <select
                  name="region"
                  id="region"
                  className="input-field"
                  value={region}
                  onChange={(e) => setRegion(e.target.value)}
                  required
                >
                  <option value="">Select Region</option>
                  <option value="north">North</option>
                  <option value="south">South</option>
                  <option value="east">East</option>
                  <option value="west">West</option>
                </select>
              </div>
              <div className="input-box">
                <input
                  type="submit"
                  className="submit"
                  value="Generate Recipe"
                />
              </div>
            </form>
          </div>
        </div>
      )}

      {showAbout && (
        <div className="about-us">
          <header>About Us</header>
          <p>
            Welcome to our AI-Based Creative Cooking Web Application. Our
            platform leverages advanced AI technology to help you create unique
            and delicious recipes based on the ingredients you have at hand.
            Whether you're a seasoned chef or a cooking novice, our application
            is designed to inspire and assist you in the kitchen. Thank you for
            visiting, and happy cooking!
          </p>
        </div>
      )}

      {error && <p className="error-message">{error}</p>}

      {isModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <span className="close-button" onClick={closeModal}>
              &times;
            </span>
            <h2>Generated Recipe</h2>
            <div id="recipe-content">
              <div
                dangerouslySetInnerHTML={{
                  __html: formatRecipe(generatedRecipe),
                }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );

  function formatRecipe(recipe) {
    const lines = recipe.split("\n");
    const title = lines.shift().replace(/\*\*/g, ""); // Remove asterisks from title
    let ingredients = "";
    let instructions = "";
    let tips = "";
    let isIngredients = true;
    let isTips = false;

    lines.forEach((line) => {
      if (line.startsWith("**Ingredients:**")) {
        ingredients += "<ul>";
      } else if (line.startsWith("**Instructions:**")) {
        ingredients += "</ul>";
        instructions += "<ol>";
        isIngredients = false;
      } else if (line.startsWith("**Tips:**")) {
        instructions += "</ol>";
        tips += "<ul>";
        isTips = true;
      } else if (line.startsWith("* ")) {
        if (isIngredients) {
          ingredients += `<li>${line.slice(2)}</li>`;
        } else if (isTips) {
          tips += `<li>${line.slice(2)}</li>`;
        } else {
          instructions += `<li>${line.slice(2)}</li>`;
        }
      } else if (line.startsWith("1. ")) {
        instructions += `<li>${line.slice(3)}</li>`;
      } else if (line.match(/^\d+\./)) {
        instructions += `<li>${line.slice(line.indexOf(" ") + 1)}</li>`;
      }
    });

    instructions += "</ol>";
    tips += "</ul>";

    return `<h3>${title}</h3>${ingredients}${instructions}${tips}`;
  }
}

export default App;
