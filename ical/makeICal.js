document.querySelector('.btnS>button').removeAttribute('onclick');
var icalButton = document.querySelector('.btnS').cloneNode(true);
icalButton.classList.add('ical');
icalButton.querySelector('button').addEventListener('click', makeICal);
icalButton.querySelector('button>span').textContent = '時間割iCalダウンロード';

document.querySelector('.btnS:not(.ical)').style.paddingRight = 0;
document.querySelector('.btnS:not(.ical)').parentNode
  .insertBefore(icalButton, null);

(function() {
  function pad(number) {
    if ( number < 10 ) {
      return '0' + number;
    }
    return number;
  }

  Date.prototype.toISOString = function() {
    return ''+this.getFullYear() +
      pad( this.getMonth() + 1 ) +
      pad( this.getDate() ) +
      'T' + pad( this.getHours() ) +
      pad( this.getMinutes() ) +
      pad( this.getSeconds() );
  };
}());

function makeICal() {
  var OPTS = {};
  OPTS.start = new Date();
  OPTS.end = new Date().getFullYear();
  OPTS.end = ((document.querySelector('#beginTerm').value == 10) ? OPTS.end+'/9/1' : (OPTS.end+1)+'/4/1' );
  OPTS.end = new Date(OPTS.end).toISOString().replace(/T.*$/,'');

  var timeTable = {};
  var weekList = ['mo','tu','we','th','fr','sa'];
  weekList.forEach(function(weekName) {
    timeTable[weekName] = {};
  });

  var tableHtml = document.querySelector('.calenderLayout > table[summary=layoutTable]');

  for (var week = 0; week < weekList.length; week++) {
    for (var period = 1; period <= 7; period++) {
      var weekName = weekList[week];
      var subjectNode = tableHtml.querySelectorAll('.classTitle')[period-1].querySelectorAll('td')[week];
      var infosNode = tableHtml.querySelectorAll('.classDetail')[period-1].querySelectorAll('td')[week];

      var subject = subjectNode.innerText.replace(/( |\s|\n|\r)/g,'');
      var infos = infosNode.innerText.replace(/( |　|\t)/g,'')
                    .split('\n').filter(function(item){return (item !== '');});

      timeTable[weekName][period] = {
        subject : (subject !== '' ? subject : null),
        lecturer : infos[0],
        room : infos[1]
      };
    }
  }

  var periodTable = {
    1 : {start : "09:00", end : "10:30"},
    2 : {start : "10:40", end : "12:10"},
    3 : {start : "13:00", end : "14:30"},
    4 : {start : "14:40", end : "16:10"},
    5 : {start : "16:20", end : "17:50"},
    6 : {start : "18:00", end : "19:30"},
    7 : {start : "19:40", end : "21:10"}
  };

  var ical = new iCal();

  Object.keys(timeTable).forEach(function(weekName) {
    var table = timeTable[weekName];
    Object.keys(table).forEach(function(period) {
      var infos = table[period];
      var week = weekList.indexOf(weekName);
      var dateStr = new Date(OPTS.start.getTime()+((8+week-OPTS.start.getDay())%7)*1000*60*60*24).toDateString();//new Data(OPTS[:start]+(week+1-OPTS[:start].wday)%7).to_s

      if (infos.subject != null) {
        e = {};
        e.dtstart = new Date(dateStr+" "+periodTable[period].start).toISOString();
        e.dtend = new Date(dateStr+" "+periodTable[period].end).toISOString();

        e.summary = infos.subject;
        e.location = infos.room;
        e.description = infos.lecturer;
        e.rrule = "FREQ=WEEKLY;"+(OPTS.end == null ? "" : "UNTIL="+OPTS.end+";")+"BYDAY="+weekName.toUpperCase();
        ical.addEvent(e);
      }
    });
  });

  saveTextAs(ical.export(), "時間割_"+document.querySelector('#userId').value+".ics");
}