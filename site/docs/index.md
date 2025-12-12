---
title: Emanuel Trandafir
---

# Emanuel Trandafir

_Hey there, I'm Emanuel - a Software Craftsman from Romania._

<br>

I value **simplicity and intentionality** over blindly applying patterns and abstractions.

I care deeply about the **design and testability** of the software I create.

I also value **communication and collaboration** and enjoy sharing my knowledge through open-source contributions and technical articles.

---

<div class="tag-container">
  <button class="tag-chip" onclick="showArticles('design')">#design</button>
  <button class="tag-chip" onclick="showArticles('functional-programming')">#functional programming</button>
  <button class="tag-chip" onclick="showArticles('testing')">#testing</button>
  <button class="tag-chip" onclick="showArticles('books')">#books</button>
</div>

<div id="design-articles" class="articles-container">
  <ul>
    <li><a href="blog/clean-code-dependency-principles/">Uncle Bob's Advice on Stability and Abstractions</a></li>
    <li><a href="blog/java-optional-vs-kotlin/">Java's Optional vs Kotlin: Side by Side</a></li>
    <li><a href="blog/less-mocks-more-functions/">Less Mocks, More Functions!</a></li>
  </ul>
</div>

<div id="functional-programming-articles" class="articles-container">
  <ul>
    <li><a href="blog/clojure-threading/">Clojure Threading for Dummy Java Devs (such as myself)</a></li>
    <li><a href="blog/java-optional-vs-kotlin/">Java's Optional vs Kotlin: Side by Side</a></li>
    <li><a href="blog/less-mocks-more-functions/">Less Mocks, More Functions!</a></li>
  </ul>
</div>

<div id="testing-articles" class="articles-container">
  <ul>
    <li><a href="blog/less-mocks-more-functions/">Less Mocks, More Functions!</a></li>
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
});
</script>
