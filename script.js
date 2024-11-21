const generateForm = document.querySelector(".generate-form");
const imageGallery = document.querySelector(".image-show");


const OPENAI_API_KEY = "Api key (Can't able to upload because of privacy of secret key)";

const updateImageCard = (imgDataArray) => {
    imgDataArray.forEach((imgObject , index) => {
        const imgCard = imageGallery.querySelectorAll(".image-card")[index];
        const imgElement = imgCard.querySelector("img");

        const aiGeneratedImg = `data:image/jpeg;base64,${imgObject.b64_json}`;
        imgElement.src = aiGeneratedImg;


        imgElement.onload = () =>{
            imgCard.classList.remove("loading");
        }
        
    });
    
}
const generateAiImages = async (userPrompt, userImgQuantity) => {
    try {
        const response = await fetch("https://api.openai.com/v1/images/generations", {
            method: "POST", 
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${OPENAI_API_KEY}`, 
            },
            body: JSON.stringify({
                prompt: userPrompt,
                n: parseInt(userImgQuantity), 
                size: "512x512", 
                response_format: "b64_json",
            }),
        });

        if (!response.ok) {
            const errorDetails = await response.json(); 
            throw new Error(
                `Error: ${errorDetails.error?.message || "Failed to Generate Images"}`
            );
        }

        const { data } = await response.json();
        updateImageCard(data); 
    } catch (error) {
        alert(error.message);
    }
};

const handFormSubmission = (e) =>{
e.preventDefault();

const userPromt = e.srcElement[0].value;
const userImgQuantity = e.srcElement[1].value;

const imgCardMarkup = Array.from({length: userImgQuantity}, () =>
` <div class="image-card loading">
            <img src="loader.gif" alt="image">

            <a href="#" class="download-btn">
                <img src="download.png" alt="download icon">

            </a>
        </div>`
).join("");

imageGallery.innerHTML = imgCardMarkup;
generateAiImages(userPromt , userImgQuantity);

}

generateForm.addEventListener("submit" , handFormSubmission);


