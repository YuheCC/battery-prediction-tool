// Features section tab switcher for about.html
window.addEventListener('DOMContentLoaded', function() {
  const tabs = document.querySelectorAll('.feature-tab');
  const details = document.querySelectorAll('.feature-detail');
  tabs.forEach(tab => {
    tab.addEventListener('click', function() {
      tabs.forEach(t => t.classList.remove('active'));
      details.forEach(d => d.style.display = 'none');
      this.classList.add('active');
      const key = this.getAttribute('data-feature');
      const detail = document.querySelector('.feature-detail[data-feature="' + key + '"]');
      if (detail) detail.style.display = '';
    });
  });
});

// Try MU button click: go to login page
const tryMuBtn = document.querySelector('.try-mu-button');
if (tryMuBtn) {
  tryMuBtn.addEventListener('click', function(e) {
    e.preventDefault();
    window.location.href = 'index.html';
  });
}

// Pricing group switcher
window.addEventListener('DOMContentLoaded', function() {
  const switchBtns = document.querySelectorAll('.pricing-switch-btn');
  const groups = document.querySelectorAll('.pricing-group');
  switchBtns.forEach(btn => {
    btn.addEventListener('click', function() {
      switchBtns.forEach(b => b.classList.remove('active'));
      this.classList.add('active');
      const group = this.getAttribute('data-group');
      groups.forEach(g => {
        if (g.getAttribute('data-group') === group) {
          g.style.display = '';
        } else {
          g.style.display = 'none';
        }
      });
    });
  });
}); 