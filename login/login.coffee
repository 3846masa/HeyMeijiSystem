# sizzle settings
$ = Sizzle

# change title
document.title = document.title.replace /Oh-o!/, 'Hey!'
$('img[alt="Oh-o!Meiji"]')[0].src = chrome.extension.getURL '/imgs/logo.svg'
$('#mainVisualSection')[0].style.backgroundImage =
  "url(#{chrome.extension.getURL('/imgs/login/nakano.png')})"

# set error message
if location.search.substr(1).match /passwordInvalid/
  popup = $('#fancybox-frame')[0].contentDocument
  changeMessage = ->
    message = $('#contentSection > p', popup)[0]
    if message?
      message.innerText = "学生番号もしくはパスワードが違います。\n再度入力してください。"
    else
      setTimeout changeMessage, 100
  changeMessage()

# make login form elements
inputTemplate = document.createElement 'p'
inputTemplate.classList.add 'input'
inputTemplate.insertBefore document.createElement('input'), null
inputTemplate.insertBefore document.createElement('span'), null

studentID = inputTemplate.cloneNode true
studentIDInput = $('input', studentID)[0]
studentIDInput.setAttribute(attr, value) for attr, value of {
  class: 'studentID'
  name: 'usrid'
  type: 'text'
  placeholder: 'StudentID'
  pattern: '[0-9]{10}'
  required: 'required'
}


password = inputTemplate.cloneNode true
passwordInput = $('input', password)[0]
passwordInput.setAttribute(attr, value) for attr, value of {
  class: 'password'
  name: 'passwd'
  type: 'password'
  placeholder: 'Password'
  required: 'required'
}

hiddenInput = document.createElement 'input'
hiddenInput.setAttribute(attr, value) for attr, value of {
  class: 'hiddenInput'
  name: 'url'
  type: 'hidden'
  value: 'https%3A%2F%2Foh-o2.meiji.ac.jp%2Fportal%2Finitiatessologin'
}

submitButton = document.createElement 'button'
submitButton.setAttribute(attr, value) for attr, value of {
  class: 'submit'
  type: 'submit'
}

loginForm = document.createElement 'form'
loginForm.setAttribute(attr, value) for attr, value of {
  class: 'login_form'
  action: 'https://com-web.mind.meiji.ac.jp/SSO/icpn200'
  method: 'POST'
}
loginForm.insertBefore elem, null for elem in [
  studentID, password, hiddenInput, submitButton
]

# fix layout
$('.mobile')[0].remove();
$('.login')[0].style.height = 'auto'
$('.help')[0].style.position = 'relative'

$('#loginField > dl > dt')[0].style.maxHeight = ''
$('#loginField > dl > dt')[0].insertBefore loginForm, null
submitButton.insertBefore $('#loginField > dl > dt > a')[0], null
$('a', submitButton)[0].href = '#'

# submit login form
libraryLogin = false
loginForm.addEventListener 'submit', (event)->
  if libraryLogin
    return
  else
    event.preventDefault()

  login = new XMLHttpRequest();
  login.responseType = 'document'
  login.addEventListener 'load', ->
    if @responseXML.title.match /システム・メッセージ/
      location.href = location.origin+location.pathname+'?sessionTimeout&passwordInvalid'
    else
      libraryLogin = true
      loginForm.submit()
  login.open 'POST', 'https://opac.lib.meiji.ac.jp/webopac/askidf.do'
  login.setRequestHeader 'Content-Type', 'application/x-www-form-urlencoded'
  login.send "userid=#{studentIDInput.value}&password=#{passwordInput.value}"