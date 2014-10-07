// change title
document.title = document.title.replace(/Oh-o!/,'Hey!');
document.querySelector('img[alt="Oh-o!Meiji"]').src = chrome.extension.getURL('/imgs/logo.svg');
document.querySelector('#mainVisualSection').style.backgroundImage = 'url("'+chrome.extension.getURL('/imgs/login/nakano.png')+'")';

// set error message
if (location.search.substr(1) === "sessionTimeout&passwordInvalid") {
  var popup = document.querySelector('#fancybox-frame').contentDocument;
  var message = popup.querySelector('#contentSection > p');
  message.innerText = "学生番号もしくはパスワードが違います。\n再度入力してください。";
}

// make login form elements
var inputTemplate = document.createElement('p');
inputTemplate.classList.add('input');
inputTemplate.insertBefore(document.createElement('input'), null);
inputTemplate.insertBefore(document.createElement('span'), null);

var studentID = inputTemplate.cloneNode(true);
var studentIDInput = studentID.querySelector('input');
studentIDInput.classList.add('studentID');
studentIDInput.setAttribute('name', 'usrid');
studentIDInput.setAttribute('type', 'text');
studentIDInput.setAttribute('placeholder', 'StudentID');
studentIDInput.setAttribute('pattern', '[0-9]{10}');
studentIDInput.setAttribute('required', 'required');

var password = inputTemplate.cloneNode(true);
var passwordInput = password.querySelector('input');
passwordInput.classList.add('password');
passwordInput.setAttribute('name', 'passwd');
passwordInput.setAttribute('type', 'password');
passwordInput.setAttribute('placeholder', 'Password');
passwordInput.setAttribute('required', 'required');

var hiddenInput = document.createElement('input');
hiddenInput.classList.add('hiddenInput');
hiddenInput.setAttribute('name', 'url');
hiddenInput.setAttribute('type', 'hidden');
hiddenInput.value = 'https%3A%2F%2Foh-o2.meiji.ac.jp%2Fportal%2Finitiatessologin';

var submitButton = document.createElement('button');
submitButton.classList.add('submit');
submitButton.setAttribute('type', 'submit');

var loginForm = document.createElement('form');
loginForm.setAttribute('action', 'https://com-web.mind.meiji.ac.jp/SSO/icpn200');
loginForm.setAttribute('method', 'POST');
loginForm.insertBefore(studentID, null);
loginForm.insertBefore(password, null);
loginForm.insertBefore(hiddenInput, null);
loginForm.insertBefore(submitButton, null);

// fix layout
document.querySelector('.mobile').remove();
document.querySelector('.login').style.height = 'auto';
document.querySelector('.help').style.position = 'relative';

document.querySelector('#loginField > dl > dt').style.maxHeight = '';
document.querySelector('#loginField > dl > dt').insertBefore(loginForm, null);
submitButton.insertBefore(document.querySelector('#loginField > dl > dt > a'), null);
submitButton.querySelector('a').href = '#';