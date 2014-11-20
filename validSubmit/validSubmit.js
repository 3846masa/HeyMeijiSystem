(function(){
  var $, $$;

  $ = function(selector, parentElement) {
    return (parentElement || document).querySelector(selector);
  };

  $$ = function(selector, parentElement) {
    var array, i, nodes, _i, _ref;
    nodes = (parentElement || document).querySelectorAll(selector);
    array = [];
    for (i = _i = 0, _ref = nodes.length; 0 <= _ref ? _i < _ref : _i > _ref; i = 0 <= _ref ? ++_i : --_i) {
      array.push(nodes[i]);
    }
    return array;
  };

  function validCheck() {
    var nodes = $$('.hasTextInputElement');
    for (var i = 0; i < nodes.length; i++){
      var node = nodes[i];
      var file_name;

      if ($$('input', node).length > 0 && $$('input', node)[0].files.length > 0) {
        file_name = $$('input', node)[0].files[0].name;
      } else if ($$('span', node).length > 0) {
        file_name = $$('span', node)[0].textContent;
      }

      if (file_name == null) continue;
      if (file_name.match(/^[~\.]/) || file_name.match(/~$/)) {
        var ret = confirm("\""+file_name+"\"はバックアップファイルの可能性があります。\n投稿をキャンセルしますか？");
        if ( ret === true ){
          $$('button', node)[0].click();
          alert("ファイルをキャンセルしました。投稿しなおしてください。");
          return;
        }
      }
    }
  }

  $$('.hasTextInputElement>input').forEach(function(input){
    input.addEventListener('change', validCheck);
  });

  var span_count = 0;
  var input_count = 0;
  setTimeout(function loopCheck(){
    if ($$('.hasTextInputElement>span').length !== span_count) {
      span_count = $$('.hasTextInputElement>span').length;
      validCheck();
    }
    if ($$('.hasTextInputElement>input').length !== input_count) {
      input_count = $$('.hasTextInputElement>input').length;
      $$('.hasTextInputElement>input').forEach(function(input){
        input.addEventListener('change', validCheck);
      });
    }
    setTimeout(loopCheck, 100);
  }, 100);
})();