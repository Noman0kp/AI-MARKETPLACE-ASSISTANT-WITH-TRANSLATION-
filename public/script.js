document.getElementById("artisanForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const productName = document.getElementById("productName").value;
  const artisanStory = document.getElementById("artisanStory").value;
  const resultDiv = document.getElementById("result");

  resultDiv.innerText = "⏳ Generating description...";

  try {
    const response = await fetch("http://localhost:3000/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productName, artisanStory }),
    });

    const data = await response.json();
    resultDiv.innerText = data.result || "⚠️ No description generated.";
  } catch (error) {
    console.error("Error:", error);
    resultDiv.innerText = "⚠️ Failed to generate description.";
  }
});
