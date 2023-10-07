const curatedImage = document.getElementById('curatedImage');
const ratingArea = document.getElementById('ratingArea');
const likertRating = document.getElementById('likertRating');
const feedbackContainer = document.getElementById('ratingArea');
const fixationArea = document.getElementById('fixationArea');
const message = document.getElementById("message");

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

let images = [
    { path: "p1.png", id: "p1", valence: "positive" },
    { path: "p2.png", id: "p2", valence: "positive" },
    { path: "p3.png", id: "p3", valence: "positive" },
    { path: "p4.png", id: "p4", valence: "positive" },
    // { path: "p5.png", id: "p5", valence: "positive" },
    // { path: "p6.png", id: "p6", valence: "positive" },
    // { path: "p7.png", id: "p7", valence: "positive" },
    // { path: "p8.png", id: "p8", valence: "positive" },
    // { path: "p9.png", id: "p9", valence: "positive" },
    // { path: "p10.png", id: "p10", valence: "positive" },
    { path: "n1.png", id: "n1", valence: "negative" },
    { path: "n2.png", id: "n2", valence: "negative" },
    { path: "n3.png", id: "n3", valence: "negative" },
    // { path: "n4.png", id: "n4", valence: "negative" },
    // { path: "n5.png", id: "n5", valence: "negative" },
    // { path: "n6.png", id: "n6", valence: "negative" },
    // { path: "n7.png", id: "n7", valence: "negative" },
    // { path: "n8.png", id: "n8", valence: "negative" },
    // { path: "n9.png", id: "n9", valence: "negative" },
    // { path: "n10.png", id: "n10", valence: "negative" }
];

images = shuffleArray(images);



const ratings = [];
let currentTrial = 0;
let selectedImages = []; 
let currentRepetition = 1;
let currentSelectedImageIndex = 0;



// Demographics
let age, racialIdentity, genderIdentity, fatherEducation, motherEducation, familyIncome, yearInSchool, timestamp1;

function demographics() {
    timestamp1 = new Date();
    //Anchor to top 
    document.body.classList.add('instructions-body-align');

    // Prompt the user to enter their SID number
    participantSID = prompt("Please enter your SID number:", "");

    // Keep prompting the user until they provide a valid 10-digit SID
    while (!isValidSID(participantSID)) {
        participantSID = prompt("Invalid SID. Please enter a 10-digit SID number:", "");
    }

    //participantName = prompt("What is your full name?", "")

    // Main wrapper
    let wrapper = document.createElement('div');
    wrapper.id = "demographicsContainer";
    wrapper.style.marginTop = '0rem'; // before 20rem
    wrapper.style.paddingBottom = '5rem';
    wrapper.style.fontFamily = "'Arial', sans-serif";

    // Adding a header
    let header = document.createElement('h2');
    header.textContent = "Please respond to the following questions";
    header.style.textAlign = 'center';
    header.style.marginBottom = '2rem';
    wrapper.appendChild(header);

    // Helper function to generate a styled label
    function createStyledLabel(content) {
        let label = document.createElement('label');
        label.textContent = content;
        label.style.fontWeight = 'bold';
        label.style.display = 'block';
        label.style.marginTop = '2rem';
        return label;
    }

    // Track sliders' interactions
    let slidersInteracted = {
        ageSlider: false,
        incomeSlider: false
    };

    // Helper function to create and style a slider
    function createStyledSlider(min, max, sliderName) {
        let div = document.createElement('div');

        noUiSlider.create(div, {
            start: [(min + max) / 2],
            range: {
                'min': [min],
                'max': [max]
            },
            format: {
                to: function (value) {
                    return parseInt(value);
                },
                from: function (value) {
                    return parseInt(value);
                }
            },
            tooltips: true
        });

        div.noUiSlider.on('change', () => {
            slidersInteracted[sliderName] = true;
            checkAllAnswered();
        });

        let minMaxLabel = document.createElement('div');
        minMaxLabel.style.display = 'flex';
        minMaxLabel.style.justifyContent = 'space-between';
        minMaxLabel.appendChild(document.createTextNode(min.toString()));
        let spacer = document.createElement('span');
        spacer.style.flexGrow = '1';
        minMaxLabel.appendChild(spacer);
        minMaxLabel.appendChild(document.createTextNode(max.toString()));

        let container = document.createElement('div');
        container.appendChild(div);
        container.appendChild(minMaxLabel);
        return container;
    }

    // Helper function to generate radio buttons
    function createRadioButtons(name, options) {
        let div = document.createElement('div');
        div.style.marginTop = '0.5rem';
        for (let option of options) {
            let label = document.createElement('label');
            label.style.display = 'block';
            let radio = document.createElement('input');
            radio.type = 'radio';
            radio.name = name;
            radio.value = option;
            label.appendChild(radio);
            label.appendChild(document.createTextNode(option));
            div.appendChild(label);
        }
        return div;
    }
    // Append and style each question and input
    wrapper.appendChild(createStyledLabel('What is your age?'));
    wrapper.appendChild(createStyledSlider(18, 80, 'ageSlider'));
    let ageSlider = wrapper.querySelector("#demographicsContainer div.noUi-target");
    if (ageSlider) {
     ageSlider.noUiSlider.set(80);
    }

    wrapper.appendChild(createStyledLabel('What is your racial identity?'));
    wrapper.appendChild(createRadioButtons('racialIdentity', ['Asian', 'Black', 'Latino', 'Native American', 'White']));

    wrapper.appendChild(createStyledLabel('What is your gender identity?'));
    wrapper.appendChild(createRadioButtons('genderIdentity', ['Female', 'Male', 'Non-binary']));

    wrapper.appendChild(createStyledLabel('What is the highest level of education obtained by your father?'));
    wrapper.appendChild(createRadioButtons('fatherEducation', ['Some high school', 'High school diploma', 'Associate degree', 'Bachelor\'s degree', 'Master\'s degree', 'Ph.D., M.D., J.D., Psy.D., or other']));

    wrapper.appendChild(createStyledLabel('What is the highest level of education obtained by your mother?'));
    wrapper.appendChild(createRadioButtons('motherEducation', ['Some high school', 'High school diploma', 'Associate degree', 'Bachelor\'s degree', 'Master\'s degree', 'Ph.D., M.D., J.D., Psy.D., or other']));

    wrapper.appendChild(createStyledLabel('What is your family income, in thousands of dollars?'));
    wrapper.appendChild(createStyledSlider(0, 200, 'incomeSlider'));
    let incomeSlider = wrapper.querySelectorAll("#demographicsContainer div.noUi-target")[1];
    if (incomeSlider) {
        incomeSlider.noUiSlider.set(0);
    }

    wrapper.appendChild(createStyledLabel('What year are you in?'));
    wrapper.appendChild(createRadioButtons('yearInSchool', ['Freshman', 'Sophomore', 'Junior', 'Senior']));

    // Create the button
    let nextButton = document.createElement('button');
    nextButton.textContent = "Next";
    nextButton.style.display = "none";  
nextButton.onclick = function() {
    // Extract data from the UI elements before hiding the demographics container
    age = document.querySelector('.noUi-tooltip').textContent;  // Gets the value from the age slider's tooltip
    racialIdentity = document.querySelector('input[name="racialIdentity"]:checked').value;
    genderIdentity = document.querySelector('input[name="genderIdentity"]:checked').value;
    fatherEducation = document.querySelector('input[name="fatherEducation"]:checked').value;
    motherEducation = document.querySelector('input[name="motherEducation"]:checked').value;
    familyIncome = document.querySelectorAll('.noUi-tooltip')[1].textContent;  // Gets the value from the income slider's tooltip
    yearInSchool = document.querySelector('input[name="yearInSchool"]:checked').value;

    let demoContainer = document.getElementById('demographicsContainer');
    demoContainer.parentNode.removeChild(demoContainer);  // Remove the demographics container from the DOM
        
    document.body.classList.remove('instructions-body-align');

    instructions();  

};
    

    wrapper.appendChild(nextButton);
    // Check if all questions are answered
    function checkAllAnswered() {
        let allRadios = wrapper.querySelectorAll('input[type="radio"]');
        let answeredQuestions = new Set();
        allRadios.forEach(radio => {
            if (radio.checked) {
                answeredQuestions.add(radio.name);
            }
        });

        // Also check sliders
        let allSlidersAnswered = Object.values(slidersInteracted).every(val => val === true);

        if (answeredQuestions.size === 5 && allSlidersAnswered) {
            nextButton.style.display = "block";
        } else {
            nextButton.style.display = "none";
        }
    }

    // Add event listeners to radio buttons
    let allRadios = wrapper.querySelectorAll('input[type="radio"]');
    allRadios.forEach(radio => {
        radio.addEventListener('change', checkAllAnswered);
    });

    // Append to main container
    document.getElementById('mainContainer').appendChild(wrapper);
}


//Instructions
function instructions() {
    let message = document.getElementById("message");
    message.innerHTML = `
    <div style="max-width: 600px; margin: auto; padding: 20px; font-family: 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; text-align: left; color: #333;">
    <strong style="font-size: 1.3em; display: block; text-align: center; margin-bottom: 20px;"></strong>
    <p style="margin-top: 20px;">You're about to watch a series of pictures.</p>
    <ol style="padding-left: 30px; margin-top: 20px;">
        <li style="margin-bottom: 10px;">Please sit back and immerse yourself!</li>
        <li style="margin-bottom: 10px;">After every picture, you will complete a couple quick ratings.</li>
    </ol>
    <p style="margin-top: 20px; text-align: center; text-decoration: underline;">Make sure your window covers the entire screen!</p>
</div>
    `;
    message.style.display = 'block';  // Make sure the message is visible

    // Use the new function to create and add the button
    const nextButton = createButton("Next", () => {
        message.style.display = 'none';  // Make sure the message is visible
        showImage();
    });
    message.appendChild(nextButton);  // Add the button to the message container
}


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
            ratings.push({ 
                task: "selection",
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
                }
            }, 500);
        });
    }, 1000); // should be 10 000; just testing 
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

        // From these two, choose the one with the closest valence
        const matchedNegImage = closestArousalNegImages.sort((a, b) =>
            Math.abs(a.valence - posImage.valence) - Math.abs(b.valence - posImage.valence)
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
        curatedImage.src = selectedImages[currentSelectedImageIndex].image.path;  // Change made here
        curatedImage.style.display = 'block';
        let startTime = new Date().getTime();
        setTimeout(() => {
            curatedImage.style.display = 'none';
            createFeedbackForm(selectedImages[currentSelectedImageIndex].image, (responses) => {  // Change made here
                let reactionTime = new Date().getTime() - startTime;
                ratings.push({ 
                    task: "experimental",
                    image: selectedImages[currentSelectedImageIndex],
                    id: selectedImages[currentSelectedImageIndex].image.id,  // Change made here
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
                    if (currentRepetition > 2) { // again, for testing. This should be 10
                        currentRepetition = 1;
                        currentSelectedImageIndex++;
                    }

                    if (currentSelectedImageIndex < selectedImages.length) {
                        showSelectedImage();
                    } else {
                        downloadCSV();// Optionally, you can handle the end of the experiment here.
                    }
                }, 500);
            });
        }, 1000); // for testing. should be 10 000
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



// Start the experiment
demographics();

