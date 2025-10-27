// API Configuration
const API_BASE_URL = 'http://localhost:5005/api';
const AUTH_ENDPOINT = `${API_BASE_URL}/auth`;

// Global State
let currentUser = null;
let authToken = localStorage.getItem('authToken');
let products = [];

// DOM Elements
const navMenu = document.getElementById('nav-menu');
const hamburger = document.getElementById('hamburger');
const sections = document.querySelectorAll('.section');
const navLinks = document.querySelectorAll('.nav-link');

// Auth Elements
const loginBtn = document.getElementById('login-btn');
const registerBtn = document.getElementById('register-btn');
const logoutBtn = document.getElementById('logout-btn');
const profileLink = document.getElementById('profile-link');
const loginForm = document.getElementById('login-form');
const registerForm = document.getElementById('register-form');
const switchToLogin = document.getElementById('switch-to-login');
const switchToRegister = document.getElementById('switch-to-register');

// Product Elements
const addProductBtn = document.getElementById('add-product-btn');
const productsGrid = document.getElementById('products-grid');
const productModal = document.getElementById('product-modal');
const productForm = document.getElementById('product-form');
const modalTitle = document.getElementById('modal-title');
const closeModal = document.querySelector('.close');
const cancelProduct = document.getElementById('cancel-product');

// Other Elements
const loadingSpinner = document.getElementById('loading-spinner');
const toastContainer = document.getElementById('toast-container');

// Initialize App
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
    setupEventListeners();
    checkAuthStatus();
});

function initializeApp() {
    // Show home section by default
    showSection('home');
    
    // Check if user is already logged in
    if (authToken) {
        loadUserProfile();
    }
}

function setupEventListeners() {
    // Navigation
    hamburger.addEventListener('click', toggleMobileMenu);
    navLinks.forEach(link => {
        link.addEventListener('click', handleNavClick);
    });

    // Auth
    loginBtn.addEventListener('click', () => showSection('login'));
    registerBtn.addEventListener('click', () => showSection('register'));
    logoutBtn.addEventListener('click', handleLogout);
    switchToLogin.addEventListener('click', (e) => {
        e.preventDefault();
        showSection('login');
    });
    switchToRegister.addEventListener('click', (e) => {
        e.preventDefault();
        showSection('register');
    });

    // Forms
    loginForm.addEventListener('submit', handleLogin);
    registerForm.addEventListener('submit', handleRegister);

    // Products
    addProductBtn.addEventListener('click', () => openProductModal());
    productForm.addEventListener('submit', handleProductSubmit);
    closeModal.addEventListener('click', closeProductModal);
    cancelProduct.addEventListener('click', closeProductModal);
    productModal.addEventListener('click', (e) => {
        if (e.target === productModal) {
            closeProductModal();
        }
    });

    // Close modal on escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeProductModal();
        }
    });
}

// Navigation Functions
function toggleMobileMenu() {
    navMenu.classList.toggle('active');
    hamburger.classList.toggle('active');
}

function handleNavClick(e) {
    e.preventDefault();
    const targetId = e.target.getAttribute('href')?.substring(1);
    if (targetId && targetId !== 'home') {
        showSection(targetId);
    } else if (targetId === 'home') {
        showSection('home');
    }
    navMenu.classList.remove('active');
}

function showSection(sectionId) {
    sections.forEach(section => {
        section.classList.remove('active');
    });
    const targetSection = document.getElementById(sectionId);
    if (targetSection) {
        targetSection.classList.add('active');
    }
}

// Authentication Functions
async function handleLogin(e) {
    e.preventDefault();
    const formData = new FormData(loginForm);
    const loginData = {
        email: formData.get('email'),
        password: formData.get('password')
    };

    try {
        showLoading(true);
        const response = await fetch(`${AUTH_ENDPOINT}/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(loginData)
        });

        const result = await response.json();

        if (response.ok) {
            authToken = result.data.token;
            localStorage.setItem('authToken', authToken);
            currentUser = await loadUserProfile();
            updateAuthUI();
            showToast('Login successful!', 'success');
            showSection('home');
            loginForm.reset();
        } else {
            showToast(result.message || 'Login failed', 'error');
        }
    } catch (error) {
        showToast('Network error. Please try again.', 'error');
        console.error('Login error:', error);
    } finally {
        showLoading(false);
    }
}

async function handleRegister(e) {
    e.preventDefault();
    const formData = new FormData(registerForm);
    const registerData = {
        name: formData.get('name'),
        email: formData.get('email'),
        password: formData.get('password'),
        phonenumber: formData.get('phonenumber')
    };

    try {
        showLoading(true);
        const response = await fetch(`${AUTH_ENDPOINT}/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(registerData)
        });

        const result = await response.json();

        if (response.ok) {
            authToken = result.data.token;
            localStorage.setItem('authToken', authToken);
            currentUser = await loadUserProfile();
            updateAuthUI();
            showToast('Registration successful!', 'success');
            showSection('home');
            registerForm.reset();
        } else {
            showToast(result.message || 'Registration failed', 'error');
        }
    } catch (error) {
        showToast('Network error. Please try again.', 'error');
        console.error('Registration error:', error);
    } finally {
        showLoading(false);
    }
}

async function loadUserProfile() {
    if (!authToken) return null;

    try {
        // Since we don't have a profile endpoint, we'll create a mock user object
        // In a real app, you'd fetch this from the server
        const user = {
            name: 'User Name', // This would come from the server
            email: 'user@example.com', // This would come from the server
            role: 'user'
        };
        return user;
    } catch (error) {
        console.error('Error loading user profile:', error);
        return null;
    }
}

function handleLogout() {
    authToken = null;
    currentUser = null;
    localStorage.removeItem('authToken');
    updateAuthUI();
    showToast('Logged out successfully', 'success');
    showSection('home');
}

function checkAuthStatus() {
    if (authToken) {
        loadUserProfile().then(user => {
            currentUser = user;
            updateAuthUI();
        });
    }
}

function updateAuthUI() {
    const isLoggedIn = !!authToken;
    
    loginBtn.style.display = isLoggedIn ? 'none' : 'block';
    registerBtn.style.display = isLoggedIn ? 'none' : 'block';
    logoutBtn.style.display = isLoggedIn ? 'block' : 'none';
    profileLink.style.display = isLoggedIn ? 'block' : 'none';
    
    if (isLoggedIn) {
        loadProducts();
    }
}

// Product Functions
async function loadProducts() {
    try {
        showLoading(true);
        const response = await fetch(`${API_BASE_URL}/products`, {
            headers: {
                'Authorization': `Bearer ${authToken}`
            }
        });
        
        if (response.ok) {
            const result = await response.json();
            products = result.data || [];
        } else {
            // If not authenticated or no products, use empty array
            products = [];
        }
        
        renderProducts();
    } catch (error) {
        showToast('Error loading products', 'error');
        console.error('Error loading products:', error);
        products = [];
        renderProducts();
    } finally {
        showLoading(false);
    }
}

function renderProducts() {
    if (!products.length) {
        productsGrid.innerHTML = '<p class="text-center">No products found. Add your first product!</p>';
        return;
    }

    productsGrid.innerHTML = products.map(product => `
        <div class="product-card">
            <h3>${product.name}</h3>
            <p>${product.description}</p>
            <div class="product-price">$${product.price}</div>
            <div class="product-category">Category: ${product.category}</div>
            <div class="product-actions">
                <button class="btn btn-warning btn-small" onclick="editProduct(${product.id})">
                    <i class="fas fa-edit"></i> Edit
                </button>
                <button class="btn btn-danger btn-small" onclick="deleteProduct(${product.id})">
                    <i class="fas fa-trash"></i> Delete
                </button>
            </div>
        </div>
    `).join('');
}

function openProductModal(productId = null) {
    if (!authToken) {
        showToast('Please login to add products', 'warning');
        showSection('login');
        return;
    }

    modalTitle.textContent = productId ? 'Edit Product' : 'Add Product';
    productForm.reset();
    
    if (productId) {
        const product = products.find(p => p.id === productId);
        if (product) {
            document.getElementById('product-name').value = product.name;
            document.getElementById('product-description').value = product.description;
            document.getElementById('product-price').value = product.price;
            document.getElementById('product-category').value = product.category;
        }
    }
    
    productModal.style.display = 'block';
}

function closeProductModal() {
    productModal.style.display = 'none';
    productForm.reset();
}

async function handleProductSubmit(e) {
    e.preventDefault();
    const formData = new FormData(productForm);
    const productData = {
        name: formData.get('name'),
        description: formData.get('description'),
        price: parseFloat(formData.get('price')),
        category: formData.get('category')
    };

    try {
        showLoading(true);
        
        const response = await fetch(`${API_BASE_URL}/products`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authToken}`
            },
            body: JSON.stringify(productData)
        });

        const result = await response.json();

        if (response.ok) {
            showToast('Product saved successfully!', 'success');
            closeProductModal();
            loadProducts(); // Reload products from server
        } else {
            showToast(result.message || 'Error saving product', 'error');
        }
        
    } catch (error) {
        showToast('Error saving product', 'error');
        console.error('Error saving product:', error);
    } finally {
        showLoading(false);
    }
}

function editProduct(productId) {
    openProductModal(productId);
}

async function deleteProduct(productId) {
    if (confirm('Are you sure you want to delete this product?')) {
        try {
            showLoading(true);
            const response = await fetch(`${API_BASE_URL}/products/${productId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${authToken}`
                }
            });

            if (response.ok) {
                showToast('Product deleted successfully', 'success');
                loadProducts(); // Reload products from server
            } else {
                const result = await response.json();
                showToast(result.message || 'Error deleting product', 'error');
            }
        } catch (error) {
            showToast('Error deleting product', 'error');
            console.error('Error deleting product:', error);
        } finally {
            showLoading(false);
        }
    }
}

// Profile Functions
function loadProfile() {
    if (!currentUser) {
        showToast('Please login to view profile', 'warning');
        showSection('login');
        return;
    }

    const profileInfo = document.getElementById('profile-info');
    profileInfo.innerHTML = `
        <div class="profile-item">
            <strong>Name:</strong>
            <span>${currentUser.name || 'Not provided'}</span>
        </div>
        <div class="profile-item">
            <strong>Email:</strong>
            <span>${currentUser.email || 'Not provided'}</span>
        </div>
        <div class="profile-item">
            <strong>Role:</strong>
            <span>${currentUser.role || 'user'}</span>
        </div>
    `;
}

// Utility Functions
function showLoading(show) {
    loadingSpinner.style.display = show ? 'flex' : 'none';
}

function showToast(message, type = 'success') {
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    
    const icon = type === 'success' ? 'fas fa-check-circle' : 
                 type === 'error' ? 'fas fa-exclamation-circle' : 
                 'fas fa-exclamation-triangle';
    
    toast.innerHTML = `
        <i class="${icon}"></i>
        <span>${message}</span>
    `;
    
    toastContainer.appendChild(toast);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (toast.parentNode) {
            toast.parentNode.removeChild(toast);
        }
    }, 5000);
}

// Event listeners for profile section
document.addEventListener('click', (e) => {
    if (e.target.getAttribute('href') === '#profile') {
        loadProfile();
    }
});

// Handle get started button
document.getElementById('get-started-btn').addEventListener('click', () => {
    if (authToken) {
        showSection('products');
    } else {
        showSection('register');
    }
});

// Handle learn more button
document.getElementById('learn-more-btn').addEventListener('click', () => {
    showToast('This is a demo application for user and product management!', 'info');
});

// Export functions for global access
window.editProduct = editProduct;
window.deleteProduct = deleteProduct;
