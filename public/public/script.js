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

const productImagesInput = document.getElementById("productImages");
const imagePreview = document.getElementById("imagePreview");

productImagesInput.addEventListener("change", () => {
  imagePreview.innerHTML = ""; // clear old previews

  const files = Array.from(productImagesInput.files);

  if (files.length > 5) {
    alert("You can only upload a maximum of 5 images.");
    productImagesInput.value = ""; // reset
    return;
  }

  files.forEach((file) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = document.createElement("img");
      img.src = e.target.result;
      imagePreview.appendChild(img);
    };
    reader.readAsDataURL(file);
  });
});

// --- Translation Feature ---
const translateBtn = document.getElementById("translateBtn");
const languageSelect = document.getElementById("language");

translateBtn.addEventListener("click", async () => {
  const text = document.getElementById("result").innerText;
  const targetLang = languageSelect.value;

  if (!text || !targetLang) {
    alert("Please generate text and select a language.");
    return;
  }

  document.getElementById("result").innerText = "⏳ Translating...";

  try {
    const response = await fetch("http://localhost:3000/translate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text, targetLang }),
    });

    const data = await response.json();
    document.getElementById("result").innerText = data.translatedText || "⚠️ Translation failed.";
  } catch (error) {
    console.error(error);
    document.getElementById("result").innerText = "⚠️ Translation failed.";
  }
});

