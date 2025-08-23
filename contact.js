document.addEventListener('DOMContentLoaded', () => {
    const firebaseConfig = {
        apiKey: "AIzaSyAL8PpJIqdYLMQlTy-rAy25QMNA2ldPakI",
        authDomain: "food-hub-project.firebaseapp.com",
        projectId: "food-hub-project",
        storageBucket: "food-hub-project.firebasestorage.app",
        messagingSenderId: "1086250595919",
        appId: "1:1086250595919:web:b4efc6f470779aa1241c3a"
    };

    if (!firebase.apps.length) {
        firebase.initializeApp(firebaseConfig);
    }
    const db = firebase.firestore();
    const contactForm = document.getElementById('contact-form');
    const successMessage = document.getElementById('success-message');

    const handleFormSubmit = async (event) => {
        // Prevent the default form action (page reload)
        event.preventDefault();

        const name = contactForm.name.value;
        const email = contactForm.email.value;
        const message = contactForm.message.value;
        const messageData = {
            name: name,
            email: email,
            message: message,
            submittedAt: firebase.firestore.FieldValue.serverTimestamp()
        };

        try {
            await db.collection("messages").add(messageData);
            successMessage.textContent = "Thank you! Your message has been sent.";
            contactForm.reset();
            setTimeout(() => {
                successMessage.textContent = "";
            }, 5000);

        } catch (error) {
            console.error("Error sending message: ", error);
            successMessage.textContent = "Error sending message. Please try again.";
            successMessage.classList.replace('text-green-500', 'text-red-500');
        }
    };
    if (contactForm) {
        contactForm.addEventListener('submit', handleFormSubmit);
    }
});