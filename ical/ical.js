function iCal(){
  this.PRODID = 'HeyMeijiSystem';
  this.VERSION = '2.0';
  this.events = [];
}

iCal.prototype = {
  addEvent : function(data) {
    this.events.push(data);
  },

  export : function() {
    var ics = 'BEGIN:VCALENDAR\r\n' +
              'PRODID:' + this.PRODID + '\r\n' +
              'VERSION:' + this.VERSION + '\r\n';

    this.events.forEach(function(event){
      ics += 'BEGIN:VEVENT\r\n';
      Object.keys(event).forEach(function(key) {
        var content = key.toUpperCase() + ':' + event[key];
        ics += content + '\r\n';
      });
      ics += 'END:VEVENT\r\n';
    });

    ics += 'END:VCALENDAR';
    return ics;
  }
};