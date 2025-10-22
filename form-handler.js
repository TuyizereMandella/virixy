// Handle form submissions
document.addEventListener('DOMContentLoaded', function() {
    const forms = document.querySelectorAll('.waitlist-form');
    
    forms.forEach(form => {
        form.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const email = this.querySelector('input[type="email"]').value;
            const submitButton = this.querySelector('button[type="submit"]');
            
            // Disable button and show loading state
            submitButton.disabled = true;
            const originalText = submitButton.textContent;
            submitButton.textContent = 'Joining...';
            
            try {
                const response = await fetch('https://formsubmit.co/willaaa269@gmail.com', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    },
                    body: JSON.stringify({
                        email: email,
                        _subject: 'New Virixy Waitlist Signup',
                        _template: 'table'
                    })
                });
                
                if (response.ok) {
                    // Pass the submit button as anchor so notification appears near the button
                    showNotificationModal('🎉 Welcome to the waitlist! We\'ll keep you updated on our launch.', 'success', submitButton);
                    form.reset();
                } else {
                    throw new Error('Network response was not ok');
                }
            } catch (error) {
                showNotificationModal('Oops! Something went wrong. Please try again.', 'error', submitButton);
            } finally {
                // Re-enable button and restore text
                submitButton.disabled = false;
                submitButton.textContent = originalText;
            }
        });
    });
});