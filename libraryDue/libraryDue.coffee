# sizzle settings
$ = Sizzle

# change layout
#* remove meijiMail
$('#UIPageBody .UIRowContainer:eq(3)>div:has(#mailInfo)')[0].remove()
#* make bookDue list
bookDue = $('#UIPageBody .UIRowContainer:eq(3)>div:has(#rssReaderList)')[0].cloneNode(true)
$('#rssReaderList', bookDue)[0].setAttribute 'id', 'bookDueList'
$('.title>span', bookDue)[0].textContent = '図書館 貸出一覧'
$('#rssList', bookDue)[0].setAttribute 'id', 'bookList'
elem.remove() for elem in $('#bookList>*', bookDue)
$('#bookList', bookDue)[0].insertBefore document.createElement('dl'), null
$('#UIPageBody .UIRowContainer:eq(3)')[0].insertBefore bookDue, $('#UIPageBody .UIRowContainer:eq(3)>*:eq(0)')[0]

# get booklist
ajax = new XMLHttpRequest()
ajax.responseType = 'document'
ajax.addEventListener 'load', ->
  if @responseXML.title.match /利用者認証/
    errorMsg = document.createElement 'dt'
    errorMsg.insertBefore document.createElement('a'), null
    $('a', errorMsg)[0].textContent = 'ログインしてください'
    $('a', errorMsg)[0].setAttribute attr, value for attr, value of {
      href: 'https://opac.lib.meiji.ac.jp/webopac/asklst.do'
      target: '_blank'
    }
    $('#bookList>dl', bookDue)[0].insertBefore errorMsg, null
  else
    dueList = $('.flst_frame:eq(1) tr:not(.flst_head)', @responseXML)
    if dueList.length == 0
      msg = document.createElement 'dt'
      msg.textContent = '現在貸出中の本はありません'
      $('#bookList>dl', bookDue)[0].insertBefore msg, null
    else
      for info in dueList
        book = {}
        book.id = $('td:nth-child(3) a', info)[0].href.match(/'(.*?)'/)[1]
        book.due = {}
        book.due.date = $('td:nth-child(6)', info)[0].textContent.trim()
        book.due.days = parseInt((new Date(book.due.date) - new Date())/(24*60*60*1000))
        book.title = $('td:nth-child(7) a', info)[0].textContent.split(' / ')[0]
        listItem = document.createElement 'dd'
        listItem.insertBefore document.createElement('span'), null
        $('span', listItem)[0].textContent = "#{book.due.date}（あと#{book.due.days}日）"
        listItem.insertBefore document.createElement('a'), null
        $('a', listItem)[0].textContent = book.title
        $('a', listItem)[0].setAttribute attr, value for attr, value of {
          href: "https://opac.lib.meiji.ac.jp/webopac/catdbl.do?pkey=#{book.id}&initFlg=_RESULT_SET_NOTBIB"
          target: '_blank'
        }
        $('#bookList>dl', bookDue)[0].insertBefore listItem, null
      msg = document.createElement 'dt'
      msg.insertBefore document.createElement('a'), null
      $('a', msg)[0].textContent = '貸出更新などはこちら'
      $('a', msg)[0].setAttribute attr, value for attr, value of {
        href: 'https://opac.lib.meiji.ac.jp/webopac/lenlst.do'
        target: '_blank'
      }
      $('#bookList>dl', bookDue)[0].insertBefore msg, null
ajax.open 'GET', 'https://opac.lib.meiji.ac.jp/webopac/lenlst.do'
ajax.send null