/* js/script.js of ai-image-generator.bauska.org */
const generateForm = document.querySelector(".generate-form");
const generateBtn = generateForm.querySelector(".generate-btn");
const imageGallery = document.querySelector(".image-gallery");

const OPENAI_API_KEY = "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";

/* const OPENAI_API_KEY = "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" */
/* const OPENAI_API_KEY = "3c84dd9a9b6fb40972ad3da934285dc6" */
let isImageGenerating = false;

const updateImageCard = (imgDataArray) => {
  imgDataArray.forEach((imgObject, index) => {
    const imgCard = imageGallery.querySelectorAll(".img-card")[index];
    const imgElement = imgCard.querySelector("img");
    const downloadBtn = imgCard.querySelector(".download-btn");
    
    const aiGeneratedImage = `data:image/jpeg;base64,${imgObject.b64_json}`;
    imgElement.src = aiGeneratedImage;
    
    imgElement.onload = () => {
      imgCard.classList.remove("loading");
      downloadBtn.setAttribute("href", aiGeneratedImage);
      downloadBtn.setAttribute("download", `${new Date().getTime()}.jpg`);
    }
  });
}

const generateAiImages = async (userPrompt, userImgQuantity) => {
  try {
    const response = await fetch("https://api.openai.com/v1/images/generations", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        prompt: userPrompt,
        n: userImgQuantity,
        size: "512x512",
        response_format: "b64_json"
      }),
    });

    if(!response.ok) throw new Error("Failed to generate AI images. Make sure your API key is valid.");

    const { data } = await response.json(); 
    updateImageCard([...data]);
  } catch (error) {
    alert(error.message);
  } finally {
    generateBtn.removeAttribute("disabled");
    generateBtn.innerText = "Generate";
    isImageGenerating = false;
  }
}

const handleImageGeneration = (e) => {
  e.preventDefault();
  if(isImageGenerating) return;

  const userPrompt = e.srcElement[0].value;
  const userImgQuantity = parseInt(e.srcElement[1].value);
  
  generateBtn.setAttribute("disabled", true);
  generateBtn.innerText = "Generating";
  isImageGenerating = true;


const imgCardMarkup = Array.from({ length: userImgQuantity }, () => 
  <div class="img-card loading">
    <img src="images/loader.svg" alt="AI generated image">
    <a class="download-btn" href="#">
      <img src="images/download.svg" alt="download icon">
    </a>
  </div>`
  ).join("");

  imageGallery.innerHTML = imgCardMarkup;
  generateAiImages(userPrompt, userImgQuantity);
}

generateForm.addEventListener("submit", handleImageGeneration);
