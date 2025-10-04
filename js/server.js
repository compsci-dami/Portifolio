// Initialize EmailJS (only once at the start)
(function() {
    emailjs.init(config.EMAIL_PUBLIC_KEY);
})();

// Form submission handler
document.getElementById('contact-form').addEventListener('submit', function(event) {
    event.preventDefault();

    // First validate reCAPTCHA
    if (grecaptcha.getResponse() === '') {
        alert('Please complete the reCAPTCHA verification');
        return;
    }

    // Show loading state
    const submitButton = this.querySelector('button[type="submit"]');
    const originalButtonText = submitButton.innerHTML;
    submitButton.innerHTML = 'Sending...';
    submitButton.disabled = true;

    // Get form data
    const formData = {
        name: document.getElementById('name_field').value,
        email: document.getElementById('email_field').value,
        subject: document.getElementById('subject_field').value,
        message: document.getElementById('message_area').value,
        'g-recaptcha-response': grecaptcha.getResponse()
    };

    // Send email using EmailJS
    emailjs.send(
        config.EMAIL_SERVICE_ID,
        config.EMAIL_TEMPLATE_ID,
        {
            from_name: formData.name,
            from_email: formData.email,
            subject: formData.subject,
            message: formData.message,
        }
    )
    .then(function(response) {
        // Show success message
        document.getElementById('contact-form-result').innerHTML = 
            '<div class="alert alert-success">Thank you! Your message has been sent successfully.</div>';
        
        // Reset form
        document.getElementById('contact-form').reset();
        grecaptcha.reset();
    })
    .catch(function(error) {
        // Show error message
        document.getElementById('contact-form-result').innerHTML = 
            '<div class="alert alert-danger">Sorry, there was an error sending your message. Please try again later.</div>';
    })
    .finally(function() {
        // Restore button state
        submitButton.innerHTML = originalButtonText;
        submitButton.disabled = false;
    });
});