// Browser-side checks for the login and register forms.
// The server checks the same rules again (see server.js).
(function () {
  var form = document.querySelector('form[action="/register"], form[action="/login"]');
  if (!form) return;
  var isRegister = form.getAttribute('action') === '/register';

  function value(name) {
    var el = form.elements[name];
    return el ? el.value : '';
  }

  function check() {
    var errors = [];
    if (isRegister) {
      if (!value('name').trim()) errors.push('Name is required');
      if (!value('email').trim()) errors.push('Email is required');
      if (!value('password')) errors.push('Password is required');
      if (!value('confirm_password')) errors.push('Confirm password is required');
      if (value('password') && value('confirm_password') &&
          value('password') !== value('confirm_password')) errors.push('Passwords do not match');
    } else {
      if (!value('email').trim()) errors.push('Email is required');
      if (!value('password')) errors.push('Password is required');
    }
    return errors;
  }

  function show(errors) {
    var box = document.getElementById('js-errors');
    if (!box) {
      box = document.createElement('div');
      box.id = 'js-errors';
      box.className = 'errors';
      form.parentNode.insertBefore(box, form);
    }
    var old = document.querySelector('.errors:not(#js-errors)'); // server messages, if any
    if (old) old.style.display = 'none';
    box.innerHTML = '';
    var ul = document.createElement('ul');
    errors.forEach(function (msg) {
      var li = document.createElement('li');
      li.textContent = msg;
      ul.appendChild(li);
    });
    box.appendChild(ul);
  }

  form.addEventListener('submit', function (e) {
    var errors = check();
    if (errors.length) {
      e.preventDefault();
      show(errors);
    }
  });
})();
