// Generated by CoffeeScript 1.8.0
(function() {
  var $, attr, changeMessage, elem, hiddenInput, inputTemplate, libraryLogin, loginForm, password, passwordInput, popup, studentID, studentIDInput, submitButton, value, _i, _len, _ref, _ref1, _ref2, _ref3, _ref4, _ref5;

  $ = Sizzle;

  document.title = document.title.replace(/Oh-o!/, 'Hey!');

  $('img[alt="Oh-o!Meiji"]')[0].src = chrome.extension.getURL('/imgs/logo.svg');

  $('#mainVisualSection')[0].style.backgroundImage = "url(" + (chrome.extension.getURL('/imgs/login/nakano.png')) + ")";

  if (location.search.substr(1).match(/passwordInvalid/)) {
    popup = $('#fancybox-frame')[0].contentDocument;
    changeMessage = function() {
      var message;
      message = $('#contentSection > p', popup)[0];
      if (message != null) {
        return message.innerText = "学生番号もしくはパスワードが違います。\n再度入力してください。";
      } else {
        return setTimeout(changeMessage, 100);
      }
    };
    changeMessage();
  }

  inputTemplate = document.createElement('p');

  inputTemplate.classList.add('input');

  inputTemplate.insertBefore(document.createElement('input'), null);

  inputTemplate.insertBefore(document.createElement('span'), null);

  studentID = inputTemplate.cloneNode(true);

  studentIDInput = $('input', studentID)[0];

  _ref = {
    "class": 'studentID',
    name: 'usrid',
    type: 'text',
    placeholder: 'StudentID',
    pattern: '[0-9]{10}',
    required: 'required'
  };
  for (attr in _ref) {
    value = _ref[attr];
    studentIDInput.setAttribute(attr, value);
  }

  password = inputTemplate.cloneNode(true);

  passwordInput = $('input', password)[0];

  _ref1 = {
    "class": 'password',
    name: 'passwd',
    type: 'password',
    placeholder: 'Password',
    required: 'required'
  };
  for (attr in _ref1) {
    value = _ref1[attr];
    passwordInput.setAttribute(attr, value);
  }

  hiddenInput = document.createElement('input');

  _ref2 = {
    "class": 'hiddenInput',
    name: 'url',
    type: 'hidden',
    value: 'https%3A%2F%2Foh-o2.meiji.ac.jp%2Fportal%2Finitiatessologin'
  };
  for (attr in _ref2) {
    value = _ref2[attr];
    hiddenInput.setAttribute(attr, value);
  }

  submitButton = document.createElement('button');

  _ref3 = {
    "class": 'submit',
    type: 'submit'
  };
  for (attr in _ref3) {
    value = _ref3[attr];
    submitButton.setAttribute(attr, value);
  }

  loginForm = document.createElement('form');

  _ref4 = {
    "class": 'login_form',
    action: 'https://com-web.mind.meiji.ac.jp/SSO/icpn200',
    method: 'POST'
  };
  for (attr in _ref4) {
    value = _ref4[attr];
    loginForm.setAttribute(attr, value);
  }

  _ref5 = [studentID, password, hiddenInput, submitButton];
  for (_i = 0, _len = _ref5.length; _i < _len; _i++) {
    elem = _ref5[_i];
    loginForm.insertBefore(elem, null);
  }

  $('.mobile')[0].remove();

  $('.login')[0].style.height = 'auto';

  $('.help')[0].style.position = 'relative';

  $('#loginField > dl > dt')[0].style.maxHeight = '';

  $('#loginField > dl > dt')[0].insertBefore(loginForm, null);

  submitButton.insertBefore($('#loginField > dl > dt > a')[0], null);

  $('a', submitButton)[0].href = '#';

  libraryLogin = false;

  loginForm.addEventListener('submit', function(event) {
    var login;
    if (libraryLogin) {
      return;
    } else {
      event.preventDefault();
    }
    login = new XMLHttpRequest();
    login.responseType = 'document';
    login.addEventListener('load', function() {
      if (this.responseXML.title.match(/システム・メッセージ/)) {
        return location.href = location.origin + location.pathname + '?sessionTimeout&passwordInvalid';
      } else {
        libraryLogin = true;
        return loginForm.submit();
      }
    });
    login.open('POST', 'https://opac.lib.meiji.ac.jp/webopac/askidf.do');
    login.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    return login.send("userid=" + studentIDInput.value + "&password=" + passwordInput.value);
  });

}).call(this);
