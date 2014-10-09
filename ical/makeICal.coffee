$ = Sizzle

Date::toISOString = ->
  pad = (number)->
    if number < 10
      return '0' + number;
    else
      return number;

  return ''+@getFullYear()+pad(@getMonth()+1)+
    pad(@getDate())+'T'+pad(@getHours())+
    pad(@getMinutes())+pad(@getSeconds());

makeICal = ->
  OPTS = {}
  OPTS['start'] = new Date()
  if $('#beginTerm')[0].value == 10
    OPTS['end'] = new Date(new Date().getFullYear(),9,1)
  else
    OPTS['end'] = new Date(new Date().getFullYear()+1,4,1)

  timeTable = {}
  weekList = ['mo', 'tu', 'we', 'th', 'fr', 'sa']
  for weekName in weekList
    timeTable[weekName] = {}

  tabelHtml = $('.calenderLayout > table[summary=layoutTable]')[0]

  for week in [0...weekList.length]
    for period in [1..7]
      weekName = weekList[week]
      subjectNode = $("td",$(".classTitle",tabelHtml)[period-1])[week]
      infosNode = $("td",$(".classDetail",tabelHtml)[period-1])[week]

      subject = subjectNode.innerText.replace(/( |\s|\n|\r)/g,'')
      infos = infosNode.innerText.replace(/( |　|\t)/g,'').split('\n').filter (item) -> item != ''

      timeTable[weekName][period] =
        subject : if subject != '' then subject else null,
        lecturer : infos[0],
        room : infos[1]

  periodTable =
    1:
      start: "09:00", end: "10:30"
    2:
      start: "10:40", end: "12:10"
    3:
      start: "13:00", end: "14:30"
    4:
      start: "14:40", end: "16:10"
    5:
      start: "16:20", end: "17:50"
    6:
      start: "18:00", end: "19:30"
    7:
      start: "19:40", end: "21:10"

  cal = new iCal();

  for weekName, table of timeTable
    for period, infos of table
      week = weekList.indexOf(weekName)
      dateStr = new Date(OPTS['start'].getTime()+((week+8-OPTS['start'].getDay())%7)*1000*60*60).toDateString()

      if (infos['subject']?)
        event = {}
        event.dtstart = new Date("#{dateStr} #{periodTable[period]['start']}").toISOString()
        event.dtend = new Date("#{dateStr} #{periodTable[period]['end']}").toISOString()

        event.summary = infos.subject
        event.location = infos.room
        event.description = infos.lecturer
        event.rrule = "FREQ=WEEKLY;"+(if OPTS['end']? then "" else "UNTIL=#{OPTS['end']};") + "BYDAY=#{weekName.toUpperCase()};"
        cal.addEvent(event)

  saveTextAs(cal.export(), "時間割_"+$('#userId')[0].value+".ics");


$('.btnS>button')[0].removeAttribute('onclick');
icalButton = $('.btnS')[0].cloneNode(true);
icalButton.classList.add('ical');
$('button', icalButton)[0].addEventListener('click', makeICal);
$('button>span', icalButton)[0].textContent = '時間割iCalダウンロード';

$('.btnS:not(.ical):not(.pdf)')[0].style.paddingRight = 0;
$('.btnS:not(.ical):not(.pdf)')[0].parentNode.insertBefore(icalButton, null);