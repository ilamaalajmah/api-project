async function register(event) {
    event.preventDefault();

    const name = document.getElementById('registerName').value.trim();
    const email = document.getElementById('registerEmail').value.trim();
    const password = document.getElementById('registerPassword').value.trim();

    let hasError = false;
    localStorage.setItem('loggedIn', 'true');

    document.getElementById('nameError').textContent = '';
    document.getElementById('emailError').textContent = '';
    document.getElementById('passwordError').textContent = '';

    if (name.length < 3) {
        document.getElementById('nameError').textContent = 'Name must be at least 3 characters long';
        hasError = true;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        document.getElementById('emailError').textContent = 'Invalid email format';
        hasError = true;
    }

    if (password.length <= 8) {
        document.getElementById('passwordError').textContent = 'Password must be more than 8 characters';
        hasError = true;
    }

    if (hasError) return;

    const userData = { name, email, password };

    try {
        const response = await fetch('https://66e87333b17821a9d9dcc228.mockapi.io/HW', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(userData)
        });

        if (response.ok) {
            const result = await response.json();
            document.getElementById('registerForm').reset();
            localStorage.setItem('user', JSON.stringify(result));
            localStorage.setItem('loggedIn', 'true');
            window.location.href = 'index.html';
        } else {
            document.getElementById('nameError').textContent = 'Registration failed. Please try again.';
        }
    } catch (error) {
        document.getElementById('nameError').textContent = 'An error occurred. Please try again later.';
    }
}

async function login(event) {
    event.preventDefault();

    const email = document.getElementById('loginEmail').value.trim();
    const password = document.getElementById('loginPassword').value.trim();

    let hasError = false;

    document.getElementById('loginEmailError').textContent = '';
    document.getElementById('loginPasswordError').textContent = '';

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        document.getElementById('loginEmailError').textContent = 'Invalid email format';
        hasError = true;
    }

    if (password.length <= 8) {
        document.getElementById('loginPasswordError').textContent = 'Password must be more than 8 characters';
        hasError = true;
    }

    if (hasError) return;

    try {
        const response = await fetch('https://66e87333b17821a9d9dcc228.mockapi.io/HW');
        const users = await response.json();

        const user = users.find(u => u.email === email && u.password === password);

        if (user) {
            document.getElementById('loginForm').reset();
            localStorage.setItem('user', JSON.stringify(user));
            localStorage.setItem('loggedIn', 'true');
            window.location.href = 'index.html';
        } else {
            document.getElementById('loginEmailError').textContent = 'Invalid credentials. Please try again.';
        }
    } catch (error) {
        document.getElementById('loginEmailError').textContent = 'An error occurred. Please try again later.';
    }
}

document.getElementById('newArticleForm')?.addEventListener('submit', async function(e) {
    e.preventDefault(); 

    const title = document.getElementById('articleName').value.trim();
    const description = document.getElementById('articleDescription').value.trim();
    const imageUrl = document.getElementById('articleImage').value.trim();

    if (!title || !description || !imageUrl) {
        alert('All fields are required.');
        return;
    }

    const newArticle = { title, description, imageUrl };

    try {
        const response = await fetch('https://66e87333b17821a9d9dcc228.mockapi.io/HW', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newArticle)
        });

        if (response.ok) {
            alert('Article added successfully!');
            fetchArticles(); 
            document.getElementById('newArticleForm').reset(); 
        } else {
            alert('Failed to add article');
        }
    } catch (error) {
        console.error('Error:', error);
    }
});

async function deleteArticle(articleId) {
    try {
        const response = await fetch(`https://66e87333b17821a9d9dcc228.mockapi.io/HW/${articleId}`, {
            method: 'DELETE',
        });
        if (response.ok) {
            alert('Article deleted successfully!');
            fetchArticles(); 
        } else {
            alert('Failed to delete article');
        }
    } catch (error) {
        alert('An error occurred. Please try again later.');
    }
}

async function fetchArticles() {
    try {
        const response = await fetch('https://66e87333b17821a9d9dcc228.mockapi.io/HW');
        if (!response.ok) {
            throw new Error('Failed to fetch articles');
        }
        const articles = await response.json();

        const articlesContainer = document.getElementById('articlesContainer');
        articlesContainer.innerHTML = ''; 
        articles.forEach(article => {

            const articleElement = document.createElement('div');
            articleElement.classList.add('article');

            articleElement.innerHTML = `
                <h2>${article.title}</h2>
                <p>${article.description}</p>
                <img src="${article.imageUrl}" alt="${article.title}" />
                <button class="delete-button" onclick="deleteArticle(${article.id})">Delete</button>
            `;

            articlesContainer.appendChild(articleElement);
        });
    } catch (error) {
        console.error('Error:', error);
    }
}

document.getElementById('registerForm')?.addEventListener('submit', register);
document.getElementById('loginForm')?.addEventListener('submit', login);

document.addEventListener('DOMContentLoaded', fetchArticles);

document.addEventListener("DOMContentLoaded", () => {
    const burger = document.querySelector(".burger");
    const navLinks = document.querySelector(".nav-links");

    function handleScreenResize() {
        if (window.innerWidth >= 768) {
            navLinks.style.display = "flex";
            navLinks.style.position = "relative"; 
            navLinks.style.top = "auto"; 
        } else {
            navLinks.style.display = "none";
            navLinks.style.position = "absolute"; 
            navLinks.style.top = "60px"; 
        }
    }

    burger.addEventListener("click", () => {
        if (window.innerWidth < 768) { 
            if (navLinks.style.display === "none") {
                navLinks.style.display = "block";
            } else {
                navLinks.style.display = "none";
            }
        }
    });

    window.addEventListener("resize", handleScreenResize);
});
