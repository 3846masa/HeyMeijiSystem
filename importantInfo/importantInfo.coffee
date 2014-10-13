$ = (selector, parentElement)->
  (parentElement || document).querySelector(selector)
$$ = (selector, parentElement)->
  nodes = (parentElement || document).querySelectorAll(selector)
  array = []
  array.push nodes[i] for i in [0...nodes.length]
  return array
$x = (expression, parentElement) ->
  array = []
  xpaths = document.evaluate(expression, parentElement || document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null)
  array.push xpaths[i] for i in [0...xpaths.length]
  return array
$.create = (tagName) ->
  document.createElement(tagName)

xhr = new XMLHttpRequest()
xhr.onload = ->
  important = $('.importantNews a', this.responseXML)
  return unless (important?)
  infoBar = $('#pageHeaderBlock > p')
  infoBar.style.textAlign = 'left'
  infoBar.style.fontSize = '125%'
  infoBar.innerHTML = ''
  important = document.importNode(important, true)
  important.style.color = 'red'
  important.href = "https://www.meiji.ac.jp/"+important.getAttribute('href')
  important.setAttribute('target', '_blank')
  infoBar.appendChild(important)
xhr.open("GET", "https://www.meiji.ac.jp/")
xhr.responseType = "document"
xhr.send()