---
title: Emanuel Trandafir
---

# Emanuel Trandafir

_Hey there, I'm Emanuel - a Software Craftsman from Romania._

<br>

I value **simplicity and intentionality** over blindly applying patterns and abstractions.

I care deeply about the **design and testability** of the software I create.

I also value **communication and collaboration** and enjoy sharing my knowledge through open-source contributions and technical articles.

<p style="padding-top: 30px;">Browse articles by topic:</p>

<div class="tag-container">
  <button class="tag-chip" onclick="showArticles('design')">#design (5)</button>
  <button class="tag-chip" onclick="showArticles('functional-programming')">#functional programming (3)</button>
  <button class="tag-chip" onclick="showArticles('testing')">#testing (3)</button>
  <button class="tag-chip" onclick="showArticles('debugging')">#debugging (1)</button>
  <button class="tag-chip" onclick="showArticles('kafka')">#kafka (1)</button>
  <button class="tag-chip" onclick="showArticles('oop')">#oop (1)</button>
  <button class="tag-chip" onclick="showArticles('oss')">#oss (1)</button>
  <button class="tag-chip" onclick="showArticles('books')">#books (1)</button>
</div>

<div id="design-articles" class="articles-container">
  <ul>
    <li><a href="blog/avro-duplicate-class-mystery/">The Case of the Vanishing Schema Field</a></li>
    <li><a href="blog/clean-code-dependency-principles/">Uncle Bob's Advice on Stability and Abstractions</a></li>
    <li><a href="blog/java-optional-vs-kotlin/">Java's Optional vs Kotlin: Side by Side</a></li>
    <li><a href="blog/lombok-lazy-oop/">Lombok's "Lazy" Magic and the O.O.P. Alternative</a></li>
    <li><a href="blog/less-mocks-more-functions/">Less Mocks, More Functions!</a></li>
  </ul>
</div>

<div id="debugging-articles" class="articles-container">
  <ul>
    <li><a href="blog/avro-duplicate-class-mystery/">The Case of the Vanishing Schema Field</a></li>
  </ul>
</div>

<div id="kafka-articles" class="articles-container">
  <ul>
    <li><a href="blog/avro-duplicate-class-mystery/">The Case of the Vanishing Schema Field</a></li>
  </ul>
</div>

<div id="functional-programming-articles" class="articles-container">
  <ul>
    <li><a href="blog/clojure-threading/">Clojure Threading for Dummy Java Devs (such as myself)</a></li>
    <li><a href="blog/java-optional-vs-kotlin/">Java's Optional vs Kotlin: Side by Side</a></li>
    <li><a href="blog/less-mocks-more-functions/">Less Mocks, More Functions!</a></li>
  </ul>
</div>

<div id="oop-articles" class="articles-container">
  <ul>
    <li><a href="blog/lombok-lazy-oop/">Lombok's "Lazy" Magic and the O.O.P. Alternative</a></li>
  </ul>
</div>

<div id="testing-articles" class="articles-container">
  <ul>
    <li><a href="blog/micrometer-assertions-contribution/">My First Contribution to Micrometer</a></li>
    <li><a href="blog/avro-duplicate-class-mystery/">The Case of the Vanishing Schema Field</a></li>
    <li><a href="blog/less-mocks-more-functions/">Less Mocks, More Functions!</a></li>
  </ul>
</div>

<div id="oss-articles" class="articles-container">
  <ul>
    <li><a href="blog/micrometer-assertions-contribution/">My First Contribution to Micrometer</a></li>
  </ul>
</div>

<div id="books-articles" class="articles-container">
  <ul>
    <li><a href="blog/tidy-first-commitments/">'Tidy First?' and my Post-Reading Commitments</a></li>
  </ul>
</div>

<script>
let currentActive = null;

function showArticles(tag) {
  const articleDiv = document.getElementById(tag + '-articles');
  const buttons = document.querySelectorAll('.tag-chip');

  // If clicking the same tag, close it
  if (currentActive === articleDiv) {
    articleDiv.classList.remove('active');
    buttons.forEach(btn => btn.classList.remove('active'));
    currentActive = null;
    return;
  }

  // Hide all article containers and remove active state from buttons
  document.querySelectorAll('.articles-container').forEach(div => {
    div.classList.remove('active');
  });
  buttons.forEach(btn => btn.classList.remove('active'));

  // Show selected articles and highlight button
  articleDiv.classList.add('active');
  event.target.classList.add('active');
  currentActive = articleDiv;
}

// Auto-expand tag based on URL hash on page load
window.addEventListener('DOMContentLoaded', function() {
  const hash = window.location.hash.substring(1); // Remove the '#'
  if (hash) {
    const articleDiv = document.getElementById(hash + '-articles');
    const button = Array.from(document.querySelectorAll('.tag-chip'))
      .find(btn => btn.getAttribute('onclick').includes(`'${hash}'`));

    if (articleDiv && button) {
      articleDiv.classList.add('active');
      button.classList.add('active');
      currentActive = articleDiv;
    }
  }

  // Newsletter form handling
  const form = document.getElementById('newsletter-form');
  const messageDiv = document.getElementById('newsletter-message');

  form.addEventListener('submit', async function(e) {
    e.preventDefault();

    const email = document.getElementById('bd-email').value;
    const submitBtn = form.querySelector('input[type="submit"]');
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
        form.reset();
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
});
</script>
