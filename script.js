const curatedImage = document.getElementById('curatedImage');
const ratingArea = document.getElementById('ratingArea');
const likertRating = document.getElementById('likertRating');
const feedbackContainer = document.getElementById('ratingArea');
const fixationArea = document.getElementById('fixationArea');


function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

let images = [
    { path: "p1.jpg", id: "p1", valence: "positive" },
    { path: "p2.jpg", id: "p2", valence: "positive" },
    { path: "p3.jpg", id: "p3", valence: "positive" },
    { path: "p4.jpg", id: "p4", valence: "positive" },
    { path: "p5.jpg", id: "p5", valence: "positive" },
    { path: "p6.jpg", id: "p6", valence: "positive" },
    { path: "p7.jpg", id: "p7", valence: "positive" },
    { path: "p8.jpg", id: "p8", valence: "positive" },
    { path: "p9.jpg", id: "p9", valence: "positive" },
    { path: "p10.jpg", id: "p10", valence: "positive" },
    { path: "n1.jpg", id: "n1", valence: "negative" },
    { path: "n2.jpg", id: "n2", valence: "negative" },
    { path: "n3.jpg", id: "n3", valence: "negative" },
    { path: "n4.jpg", id: "n4", valence: "negative" },
    { path: "n5.jpg", id: "n5", valence: "negative" },
    { path: "n6.jpg", id: "n6", valence: "negative" },
    { path: "n7.jpg", id: "n7", valence: "negative" },
    { path: "n8.jpg", id: "n8", valence: "negative" },
    { path: "n9.jpg", id: "n9", valence: "negative" },
    { path: "n10.jpg", id: "n10", valence: "negative" }
];

images = shuffleArray(images);



const ratings = [];
let currentTrial = 0;
let selectedImages = []; 
let currentRepetition = 1;
let currentSelectedImageIndex = 0;
let participantSID;

participantSID = prompt("Please enter your SID number:", "");


// Valence and Arousal ratings
function createFeedbackForm(videoId, onSubmit) {
    feedbackContainer.innerHTML = '';

    const questions = [
        { text: "How do you feel right now?", scale: ["Very unpleasant, negative", "Neutral", "Very pleasant, positive"] },
        { text: " ", scale: ["Not activated / aroused at all", "Somewhat activated / aroused", "Very activated / aroused"] }
    ];

    const responses = {};

    questions.forEach((questionObj, index) => {
        const question = document.createElement("p");
        question.style.fontWeight = 'bold'; // Add bold font-weight
        question.style.textAlign = 'center';
        question.textContent = questionObj.text;

        const likertContainer = document.createElement("div");
        likertContainer.classList.add("likert-container");

        for(let i = 0; i <= 6; i++){ // Update from 1-7 to 0-6
            const likertBox = document.createElement("div");
            likertBox.classList.add("likert-box");

            const number = document.createElement("div");
            number.textContent = i;
            number.classList.add("likert-number");
            likertBox.appendChild(number);

            const label = document.createElement("div");
            label.classList.add("likert-label");
            likertBox.appendChild(label);

            // Add labels on the edges and in the middle
            if (i === 0) label.textContent += questionObj.scale[0]; // Update from 1 to 0
            else if (i === 3) label.textContent += questionObj.scale[1];
            else if (i === 6) label.textContent += questionObj.scale[2]; // Update from 7 to 6

            likertBox.onclick = function() {
                likertContainer.querySelectorAll(".likert-box").forEach(box => box.style.backgroundColor = "");

                // Depending on the index, save to valence or arousal
                if(index === 0) {
                    responses['valence'] = i.toString(); // Convert to string
                } else if(index === 1) {
                    responses['arousal'] = i.toString(); // Convert to string
                }
                
                likertBox.style.backgroundColor = "#d8d8d8";  // Change color to indicate selection
            };

            likertContainer.appendChild(likertBox);
        }

        feedbackContainer.appendChild(question);
        feedbackContainer.appendChild(likertContainer);
    });

    const submitButton = document.createElement("button");
    submitButton.innerText = "Submit";
    submitButton.onclick = () => {
        if (Object.keys(responses).length === questions.length) {
            onSubmit(responses);
        } else {
            alert("Please answer all questions.");
        }
    };

    feedbackContainer.appendChild(submitButton);
    feedbackContainer.style.display = "block";
}


//Idiosyncrasy 
function showImage() {
    curatedImage.src = images[currentTrial].path;
    curatedImage.style.display = 'block';
    let startTime = new Date().getTime();
    setTimeout(() => {
        curatedImage.style.display = 'none';
        createFeedbackForm(images[currentTrial], (responses) => {
            let reactionTime = new Date().getTime() - startTime;
            let startingTime = new Date().getTime();
            ratings.push({ 
                SID: participantSID,
                task: "imageSelection",
                startingTime: startingTime,
                image: images[currentTrial], 
                id: images[currentTrial].id,
                repetition: currentTrial + 1,
                valence: responses.valence,
                arousal: responses.arousal,
                reactionTime: reactionTime 
            });
            ratingArea.style.display = 'none';
            fixationArea.style.display = 'block';
            setTimeout(() => {
                fixationArea.style.display = 'none';
                currentTrial++;
                if (currentTrial < images.length) {
                    showImage();
                    
                } else {
                    processRatings();
                    generateAndUploadCSV(ratings)
                }
            }, 500);
        });
    }, 5000); // should be 10 000; just testing 
}

//Select images
function processRatings() {
    // Filter out pos rated as neg, and viceversa
    const validPositive = ratings.filter(img => img.valence > 3 && img.image.valence === "positive");
    const validNegative = ratings.filter(img => img.valence < 3 && img.image.valence === "negative");
    //console.log("Valid negative:", validNegative);
    //console.log("Valid positive:", validPositive);

    // Sort valid positive images by valence, then get top 5
    const topFivePositive = validPositive.sort((a, b) => b.valence - a.valence).slice(0, 5);
    //console.log("Top 5 pos:", topFivePositive);

    // From top 5, sort by arousal and get top 2 (harder to get high arousal pos)
    const chosen_positive = topFivePositive.sort((a, b) => b.arousal - a.arousal).slice(0, 2);
    //console.log("Chosen pos (2):", chosen_positive);
    const chosen_negative = [];

    // For each chosen positive image, find the two negative images with the closest arousal
    for (const posImage of chosen_positive) {
        const closestArousalNegImages = validNegative.sort((a, b) => 
            Math.abs(a.arousal - posImage.arousal) - Math.abs(b.arousal - posImage.arousal)
        ).slice(0, 2);

       // From these two, choose the one with a valence most symmetrically distant to 3 as the posImage
        const matchedNegImage = closestArousalNegImages.sort((a, b) => 
        Math.abs((3 - a.valence) - (posImage.valence - 3)) - Math.abs((3 - b.valence) - (posImage.valence - 3))
        )[0];

        // Remove the matched image from the validNegative array to prevent it from being matched again
        validNegative.splice(validNegative.indexOf(matchedNegImage), 1);

        chosen_negative.push(matchedNegImage);
        //console.log("Chosen neg (2):", chosen_negative);
    }

    // Combine chosen_positive and chosen_negative
    selectedImages = chosen_positive.concat(chosen_negative);
    selectedImages = shuffleArray(selectedImages);

    //console.log("Selected (4}", selectedImages);
    showSelectedImage();
}




//Experimental set
function showSelectedImage() {
    if (currentSelectedImageIndex < selectedImages.length) {
        curatedImage.src = selectedImages[currentSelectedImageIndex].image.path;  
        curatedImage.style.display = 'block';
        let startTime = new Date().getTime();
        setTimeout(() => {
            curatedImage.style.display = 'none';
            createFeedbackForm(selectedImages[currentSelectedImageIndex].image, (responses) => { 
                let reactionTime = new Date().getTime() - startTime;
                let startingTime = new Date().getTime();
                ratings.push({ 
                    SID: participantSID,
                    task: "experimental",
                    startingTime: startingTime,
                    image: selectedImages[currentSelectedImageIndex],
                    id: selectedImages[currentSelectedImageIndex].image.id,  
                    repetition: currentRepetition,
                    valence: responses.valence, 
                    arousal: responses.arousal,
                    reactionTime: reactionTime
                });

                ratingArea.style.display = 'none';
                fixationArea.style.display = 'block';
                setTimeout(() => {
                    fixationArea.style.display = 'none';

                    currentRepetition++;
                    if (currentRepetition > 10) { // again, for testing. This should be 10
                        currentRepetition = 1;
                        currentSelectedImageIndex++;
                    }

                    if (currentSelectedImageIndex < selectedImages.length) {
                        showSelectedImage();
                        generateAndUploadCSV(ratings)
                        console.log('Upoload?');
                    } else {
                        downloadCSV();// 
                        generateAndUploadCSV(ratings)
                        console.log('Upoload?');
                    }
                }, 500);
            });
        }, 10000); // for testing. should be 10 000
    }
}

//Auxiliary
function createButton(text, callback) {
    const button = document.createElement("button");
    button.innerText = text;
    button.onclick = callback;
    button.style.padding = "10px 20px";
    button.style.backgroundColor = "#007BFF";
    button.style.color = "white";
    button.style.border = "none";
    button.style.borderRadius = "5px";
    button.style.cursor = "pointer";
    button.style.transition = "background-color 0.3s";
    button.style.display = "block";  // Makes the button a block element
    button.style.margin = "20px auto";  // Center the button
    button.addEventListener("mouseover", () => {
        button.style.backgroundColor = "#0056b3";
    });
    button.addEventListener("mouseout", () => {
        button.style.backgroundColor = "#007BFF";
    });
    return button;
}

function addButton(buttonElement, container = document.body) {
    container.appendChild(buttonElement);
}

//Download
function convertToCSV(objArray) {
    const array = typeof objArray !== 'object' ? JSON.parse(objArray) : objArray;
    let str = 'Task, ID, Trial, Valence, Arousal, ReactionTime\n';

    for (let i = 0; i < array.length; i++) {
        let line = '';
        for (let index in array[i]) {
            if (index !== 'image') { // skip image data
                if (line !== '') line += ',';
                line += array[i][index];
            }
        }
        str += line + '\n';
    }
    return str;
}

function downloadCSV() {
    const csv = convertToCSV(ratings);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", "ratings.csv");
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}


function generateAndUploadCSV(ratings) {
    const header = "SID, Task, startTime, Image, imageID, Repetition, Valence, Arousal, ReactionTime";
    const csvRows = [header];
    for (const rating of ratings) {
        const row = [rating.SID, rating.task, rating.startingTime, rating.image, rating.id, rating.repetition, rating.valence, rating.arousal, rating.reactionTime].join(",");
        csvRows.push(row);
    }
    
    const csvContent = csvRows.join("\n");

    const uploadUrl = '/.netlify/functions/upload-csv'; 
    
    // Create a new XMLHttpRequest object
    const xhr = new XMLHttpRequest();
    xhr.open('POST', uploadUrl, true);
    
    // Optionally set the request header to indicate the content type
     xhr.setRequestHeader('Content-Type', 'text/csv;charset=utf-8');
     
    // Retrieve the first non-empty ID as the filename, or use "default" if none found
    const validEntry = ratings.find(rating => rating.SID && rating.SID.trim().length > 0);
    const filename = (validEntry ? validEntry.SID : "default") + '.csv';
    // Set a custom request header with the filename
    xhr.setRequestHeader('X-Filename', filename);  
    xhr.onreadystatechange = function() {
        if (xhr.readyState === XMLHttpRequest.DONE) {
            if (xhr.status === 200) {
                console.log('File uploaded successfully');
            } else {
                console.error('Error uploading file');
            }
        }
    };

    // Send the CSV content as the request body
    xhr.send(csvContent);
}


// Start the experiment
showImage();

//CHEAT CODE (to update):
// <navigate to folder first>
// git status
// git add .                               (preparing all new changes to be added)
// git commit -m "Your commit message"     (commiting changes)
// git push
// npx netlify deploy --prod               (deploy to website)
// to check new files, go to AWS S3 (amazon), buckets, emotionregulation

// or in short:         git add . && git commit -m "update" && git push && npx netlify deploy --prod
