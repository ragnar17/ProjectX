
var is_swapped = 0

function func(txt){
  var obj = document.getElementById("inp1");
  str = obj.value;
  res = ""
  if(str.length==0)
    document.getElementById("inp2").value = "";
  for( i=0;i<str.length;i++)
  {
    var j = str.charCodeAt(i);
    if( j>=65 && j<=90)
    {
      var tmp = (25 - j+ "A".charCodeAt(0))%26
      tmp = (tmp+26)%26
      res += String.fromCharCode("A".charCodeAt(0) + tmp)
    }
    else if( j>=97 && j<=122)
    {
      var tmp = (25 - j+ "a".charCodeAt(0))%26
      tmp = (tmp+26)%26
      res += String.fromCharCode("a".charCodeAt(0) + tmp)
    }
    else {
      res += str[i]
    }
    var s = document.getElementById("inp2");
    s.value = res;
  }
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
