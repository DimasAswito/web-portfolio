import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import './i18n'; 

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

        // // Mobile menu toggle
        // document.getElementById('menu-toggle').addEventListener('click', function() {
        //     const mobileMenu = document.getElementById('mobile-menu');
        //     mobileMenu.classList.toggle('hidden');
        // });

        // Update active navigation based on scroll position
        // window.addEventListener('scroll', function() {
        //     const sections = document.querySelectorAll('section');
        //     const navLinks = document.querySelectorAll('.nav-link');
            
        //     let currentSection = '';
            
        //     sections.forEach(section => {
        //         const sectionTop = section.offsetTop;
        //         const sectionHeight = section.clientHeight;
                
        //         if (window.scrollY >= sectionTop - 100) {
        //             currentSection = section.getAttribute('id');
        //         }
        //     });
            
        //     navLinks.forEach(link => {
        //         link.classList.remove('active-nav');
        //         if (link.getAttribute('href') === `#${currentSection}`) {
        //             link.classList.add('active-nav');
        //         }
        //     });
        // });


// const togglePassword = document.querySelector('#togglePassword');
//         const password = document.querySelector('#password');
        
//         togglePassword.addEventListener('click', function (e) {
//             const icon = this.querySelector('i');
//             const type = password.getAttribute('type') === 'password' ? 'text' : 'password';
//             password.setAttribute('type', type);
            
//             if (type === 'password') {
//                 icon.classList.remove('fa-eye-slash');
//                 icon.classList.add('fa-eye');
//             } else {
//                 icon.classList.remove('fa-eye');
//                 icon.classList.add('fa-eye-slash');
//             }
//         });
        
//         // Add focus effects
//         const inputs = document.querySelectorAll('.input-field');
//         inputs.forEach(input => {
//             input.addEventListener('focus', function() {
//                 this.parentElement.querySelector('i').classList.add('text-blue-300');
//             });
            
//             input.addEventListener('blur', function() {
//                 this.parentElement.querySelector('i').classList.remove('text-blue-300');
//             });
//         });        
        