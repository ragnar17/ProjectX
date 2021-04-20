
var is_swapped = 0
function func(txt){
  var obj = document.getElementById("inp1");
  var xhr = new XMLHttpRequest();
  var url = "http://ragnar177.pythonanywhere.com/pa0";
  xhr.open("POST", url, true);
  xhr.setRequestHeader("Content-Type", "application/json");
  xhr.onreadystatechange = function () {
      if (xhr.readyState === 4 && xhr.status === 200) {
          var json = JSON.parse(xhr.responseText);
          var s = document.getElementById("inp2");
          s.value = json.cipher;
      }
  };
  var data = JSON.stringify({"plainText": obj.value});
  xhr.send(data);
}
function checkInput(obj) {
  func(obj.value)
}

function swapFunc(){
  if(is_swapped == 0)
  {
    document.getElementById("inp1").placeholder = "Cipher Text";
    document.getElementById("inp2").placeholder = "Plain Text";
    document.getElementById("inp1").value = "";
    document.getElementById("inp2").value = "";
  }
  else{
    document.getElementById("inp1").placeholder = "Plain Text";
    document.getElementById("inp2").placeholder = "Cipher Text";
    document.getElementById("inp1").value = "";
    document.getElementById("inp2").value = "";
  }
  is_swapped ^= 1
}
