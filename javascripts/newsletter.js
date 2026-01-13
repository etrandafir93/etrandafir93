// Newsletter form handling for footer (all pages)
document.addEventListener('DOMContentLoaded', function() {
  const footerForm = document.getElementById('newsletter-form-footer');

  if (footerForm) {
    const messageDiv = document.getElementById('newsletter-message-footer');

    footerForm.addEventListener('submit', async function(e) {
      e.preventDefault();

      const email = footerForm.querySelector('input[type="email"]').value;
      const submitBtn = footerForm.querySelector('input[type="submit"]');
      const originalBtnText = submitBtn.value;

      submitBtn.value = 'Subscribing...';
      submitBtn.disabled = true;

      try {
        const response = await fetch('https://buttondown.email/api/emails/embed-subscribe/etrandafir', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: `email=${encodeURIComponent(email)}`
        });

        if (response.ok) {
          messageDiv.textContent = 'Successfully subscribed! Check your email to confirm.';
          messageDiv.style.display = 'block';
          messageDiv.style.background = 'rgba(80, 250, 123, 0.2)';
          messageDiv.style.border = '2px solid #50fa7b';
          messageDiv.style.color = '#50fa7b';
          footerForm.reset();
        } else {
          throw new Error('Subscription failed');
        }
      } catch (error) {
        messageDiv.textContent = 'Something went wrong. Please try again.';
        messageDiv.style.display = 'block';
        messageDiv.style.background = 'rgba(255, 85, 85, 0.2)';
        messageDiv.style.border = '2px solid #ff5555';
        messageDiv.style.color = '#ff5555';
      } finally {
        submitBtn.value = originalBtnText;
        submitBtn.disabled = false;
      }
    });
  }
});
