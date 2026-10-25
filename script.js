// Select DOM elements
const searchInput = document.querySelector("#searchInput");
const loadingMessage = document.querySelector("#loadingMessage");
const errorMessage = document.querySelector("#errorMessage");
const emptyMessage = document.querySelector("#emptyMessage");
const postsContainer = document.querySelector("#postsContainer");

// Global state array to store fetched posts
let allPosts = [];

// Function to render posts into the DOM
function renderPosts(postsToRender) {
    postsContainer.innerHTML = "";

    // Handle empty search result
    if (postsToRender.length === 0) {
        emptyMessage.classList.remove("hidden");
        return;
    } else {
        emptyMessage.classList.add("hidden");
    }

    // Loop through posts and create cards dynamically
    postsToRender.forEach(post => {
        const card = document.createElement("article");
        card.className = "post-card";

        const titleHeading = document.createElement("h2");
        titleHeading.className = "post-title";
        titleHeading.textContent = post.title;

        const bodyParagraph = document.createElement("p");
        bodyParagraph.className = "post-body";
        
        // Provide a readable preview (truncate if necessary or display clean body)
        bodyParagraph.textContent = post.body.length > 120 
            ? post.body.substring(0, 120) + "..." 
            : post.body;

        card.appendChild(titleHeading);
        card.appendChild(bodyParagraph);
        postsContainer.appendChild(card);
    });
}

// Asynchronous function to fetch posts from API
async function fetchPosts() {
    // Show loading message, hide errors/empty states
    loadingMessage.classList.remove("hidden");
    errorMessage.classList.add("hidden");
    emptyMessage.classList.add("hidden");

    try {
        const response = await fetch("https://jsonplaceholder.typicode.com/posts");

        // Check if network response is successful
        if (!response.ok) {
            throw new Error(`HTTP Error! Status: ${response.status}`);
        }

        allPosts = await response.json();
        
        // Hide loading message and render fetched posts
        loadingMessage.classList.add("hidden");
        renderPosts(allPosts);

    } catch (error) {
        console.error("Failed to fetch posts:", error);
        loadingMessage.classList.add("hidden");
        
        // Display a useful error message to the user
        errorMessage.textContent = "❌ Failed to load posts. Please check your internet connection and try again later.";
        errorMessage.classList.remove("hidden");
    }
}

// Event listener for live searching by title
searchInput.addEventListener("input", (event) => {
    const searchTerm = event.target.value.toLowerCase().trim();

    // Filter posts array where title includes search query
    const filteredPosts = allPosts.filter(post => 
        post.title.toLowerCase().includes(searchTerm)
    );

    renderPosts(filteredPosts);
});

// Initialize application by fetching posts on load
fetchPosts();