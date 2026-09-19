// Minimal JS: mobile menu toggle, year injection, and subtle scroll-triggered animations
(function(){
  var toggle = document.getElementById('menu-toggle');
  var nav = document.getElementById('primary-navigation');
  if(toggle && nav){
    toggle.addEventListener('click', function(){
      var expanded = this.getAttribute('aria-expanded') === 'true';
      this.setAttribute('aria-expanded', String(!expanded));
      if(!expanded){
        nav.style.display = 'flex';
        nav.style.flexDirection = 'column';
        nav.style.gap = '0.75rem';
      } else {
        nav.style.display = '';
      }
    });
  }

  // Footer year
  var y = new Date().getFullYear();
  var el = document.getElementById('year');
  if(el) el.textContent = y;

  // Typing effect for the hero name
  var typedName = document.getElementById('typed-name');
  if(typedName){
    var fullName = typedName.textContent.trim();
    typedName.textContent = '';
    var nameIndex = 0;
    var typingTimer = setInterval(function(){
      typedName.textContent = fullName.slice(0, nameIndex + 1);
      nameIndex += 1;
      if(nameIndex >= fullName.length){
        clearInterval(typingTimer);
        typedName.classList.add('is-finished');
        var title = document.querySelector('.title-reveal');
        if(title){
          setTimeout(function(){
            title.classList.add('is-visible');
          }, 180);
        }
      }
    }, 120);
  }

  /* --------------------
     Scroll-triggered animations
     - Uses Intersection Observer
     - Adds .animate and .in-view classes
     - Sets --delay on elements for staggered appearance
     -------------------- */
  function applyStaggerToChildren(containerSelector, childSelector, baseDelay){
    var containers = document.querySelectorAll(containerSelector);
    containers.forEach(function(container){
      var children = container.querySelectorAll(childSelector);
      children.forEach(function(ch, i){
        ch.classList.add('animate','stagger-child');
        var delay = (baseDelay || 0) + (i * 0.08);
        ch.style.setProperty('--delay', delay + 's');
      });
    });
  }

  function applyStaggerToDirectChildren(containerSelector, baseDelay){
    var containers = document.querySelectorAll(containerSelector);
    containers.forEach(function(container){
      var children = Array.prototype.slice.call(container.children);
      children.forEach(function(ch, i){
        ch.classList.add('animate','stagger-child');
        var delay = (baseDelay || 0) + (i * 0.08);
        ch.style.setProperty('--delay', delay + 's');
      });
    });
  }

  // Apply to card lists with stagger
  applyStaggerToChildren('.cert-grid', '.cert-card', 0.05);
  applyStaggerToChildren('.projects-list', '.project-card', 0.05);
  applyStaggerToChildren('.events-list', '.event-card', 0.05);

  // Hero: animate the name and buttons; the title reveals after the typing effect completes
  applyStaggerToDirectChildren('.hero-inner', 0);
  var heroTitle = document.querySelector('.title-reveal');
  if(heroTitle){
    heroTitle.classList.remove('animate', 'in-view');
  }

  // Reveal each section as it enters the viewport, with a small stagger between sections
  var sections = document.querySelectorAll('main > section');
  sections.forEach(function(section, idx){
    section.classList.add('animate');
    section.style.setProperty('--delay', (0.05 + idx * 0.08) + 's');
  });

  // Section titles: small stagger (so title appears just before its content)
  var sectionTitles = document.querySelectorAll('.section-title');
  sectionTitles.forEach(function(t, idx){
    t.classList.add('animate');
    t.style.setProperty('--delay', (0.02 + idx * 0.03) + 's');
  });

  // Contact actions
  applyStaggerToDirectChildren('.contact-actions', 0);

  // Intersection Observer setup
  var observerOptions = {
    root: null,
    rootMargin: '0px 0px -10% 0px',
    threshold: 0.12
  };

  var observer = new IntersectionObserver(function(entries, obs){
    entries.forEach(function(entry){
      if(entry.isIntersecting){
        entry.target.classList.add('in-view');
        obs.unobserve(entry.target);
      }
    });
  }, observerOptions);

  // Observe all prepared animate elements
  var toObserve = document.querySelectorAll('.animate');
  toObserve.forEach(function(el){
    observer.observe(el);
  });

})();
