var PC_1, PC_2, IP, P, IP_dash, S_BOX, E
var SHIFT = [1,1,2,2,2,2,2,2,1,2,2,2,2,2,2,1]

var block_size = 16
var block_list = [16,32,64]
var block_list_i = 0
var roundKeys = []
var revRoundKeys = []
var mode = 1
var rounds = -1
var prevKey = ""
//// UI Things ////

function copyOutputFunc(){
  var copyText = document.getElementById("inp2");
  copyText.select();
  copyText.setSelectionRange(0, 99999);
  document.execCommand("copy");

}
function checkBlockSize(obj) {
  block_list_i = (block_list_i+1)%3
  document.getElementById("block-size-input").value = block_list[block_list_i];
}

function checkRounds(obj) {
  document.getElementById("rounds-input").value = (obj.value)%16==0 ? 16 : (obj.value)%16;
}

function runGenerateBoxes()
{
  block_size = document.getElementById("block-size-input").value
  rounds = document.getElementById("rounds-input").value
  roundKeys = []
  revRoundKeys = []
  generateBoxes(block_size,7)
}

function runGenerateKeys(obj){
  document.getElementById("key-input").value = obj.value;
  key = document.getElementById("key-input").value
  block_size = document.getElementById("block-size-input").value
  rounds = document.getElementById("rounds-input").value
  if(P.length ==0 )
    return
  if(key.length >= 8)
  {
    roundKeys = []
    revRoundKeys = []
    generateKeys(key,rounds,block_size)
  }
}

function runDEA(obj)
{

  if(block_size != document.getElementById("block-size-input").value || rounds != document.getElementById("rounds-input").value)
  {
    block_size = document.getElementById("block-size-input").value
    rounds = document.getElementById("rounds-input").value
    roundKeys = []
    revRoundKeys = []
    generateBoxes(block_size,7)
    key = document.getElementById("key-input").value
    generateKeys(key,rounds,block_size)
    prevKey = key
  }
  if(prevKey != document.getElementById("key-input").value )
    generateKeys(key,rounds,block_size)
  if(document.getElementById("inp1").value)
  var txt = document.getElementById("inp1").value
  block_size = document.getElementById("block-size-input").value
  rounds = document.getElementById("rounds-input").value
  var s1mple;
  if(mode)
  {
    var pad_l = 8 - txt.length%8
    for(var i=0;i<pad_l;i++)
      txt += pad_l.toString()
    // console.log(txt)
    s1mple = DEA(txt,roundKeys,block_size,rounds)

    //convert this to hexa
    s1mple = string_to_binary(s1mple)
    hexa_s1mple = ""
    // console.log(s1mple);
    for(var i=0;i<s1mple.length;i++)
      hexa_s1mple += s1mple[i]
    s1mple = bin2hex(hexa_s1mple);
  }
  else {
    txt = hex2bin(txt)
    var tmp_txt = []
    for(var i=0;i<txt.length;i++)
      tmp_txt.push(txt[i]=='0' ? 0 : 1 )
    txt = bit_array_to_string(tmp_txt)
    var tmp = DEA(txt,revRoundKeys,block_size,rounds)
    var last_char = tmp[tmp.length - 1]
    last_char = parseInt(last_char)
    var pad_l = tmp.length - last_char
    s1mple = ""
    for(var i=0;i<pad_l;i++)
      s1mple += tmp[i]
  }
  document.getElementById("inp2").value = s1mple

}
function swapFunc(){
  if(mode == 1)
  {
    document.getElementById("inp1").placeholder = "Cipher Text";
    document.getElementById("inp2").placeholder = "Plain Text";
    document.getElementById("inp1").value = "";
    document.getElementById("inp2").value = "";
    document.getElementById("encryptbtn").innerHTML = "Decrypt";
  }
  else{
    document.getElementById("inp1").placeholder = "Plain Text";
    document.getElementById("inp2").placeholder = "Cipher Text";
    document.getElementById("inp1").value = "";
    document.getElementById("inp2").value = "";
    document.getElementById("encryptbtn").innerHTML = "Encrypt";
  }
  mode ^= 1
}

//// Core Des ////

function hex2bin(hex){
    hex = hex.toLowerCase();
    var out = "";
    for(var c of hex) {
        switch(c) {
            case '0': out += "0000"; break;
            case '1': out += "0001"; break;
            case '2': out += "0010"; break;
            case '3': out += "0011"; break;
            case '4': out += "0100"; break;
            case '5': out += "0101"; break;
            case '6': out += "0110"; break;
            case '7': out += "0111"; break;
            case '8': out += "1000"; break;
            case '9': out += "1001"; break;
            case 'a': out += "1010"; break;
            case 'b': out += "1011"; break;
            case 'c': out += "1100"; break;
            case 'd': out += "1101"; break;
            case 'e': out += "1110"; break;
            case 'f': out += "1111"; break;
            default: return "";
        }
    }
    return out;
}
function bin2hex(arr){
    var out = ""
    for(var i=0;i<arr.length;i+=4) {

        var char4 = ""
        for(var j=i;j<i+4;j++){
            char4 += arr[j]
        }
        switch(char4) {
        case "0000": out += "0"; break;
        case "0001": out += "1"; break;
        case "0010": out += "2"; break;
        case "0011": out += "3"; break;
        case "0100": out += "4"; break;
        case "0101": out += "5"; break;
        case "0110": out += "6"; break;
        case "0111": out += "7"; break;
        case "1000": out += "8"; break;
        case "1001": out += "9"; break;
        case "1010": out += "a"; break;
        case "1011": out += "b"; break;
        case "1100": out += "c"; break;
        case "1101": out += "d"; break;
        case "1110": out += "e"; break;
        case "1111": out += "f"; break;
        default: return "";
      }
    }
    return out;
}

function createRandomArray(n){
  arr = []
  for(var i=1;i<=n;i++)
    arr.push(i)
  for(var i=1;i<=50;i++)
  {
    var x = getRand(n)
    var y = getRand(n)
    var tmp = arr[x]
    arr[x] = arr[y]
    arr[y] = tmp
  }
  return arr
}

function createPermutation(arr1,cnt){
  for(var i=0;i<cnt;i++)
  {
    // const index = arr1.indexOf(arr2[i])
    const index = getRand(arr1.length)
    if(index > -1){
      arr1.splice(index,1)
    }
  }
  return arr1
}
function getRand(x){
  return Math.floor(Math.random() * x);
}

function inverse_permuatation(arr){
  tmp = []
  for(var i=0;i<arr.length;i++)
    tmp.push(0)
  for(var i=0;i<arr.length;i++)
    tmp[arr[i]-1] = i+1
  return tmp
}

function generateBoxes(block_size,seed){
  ignored = block_size/8
  PC_1 = createPermutation(createRandomArray(block_size),ignored)
  PC_2 = createPermutation(createRandomArray(block_size-ignored),ignored)

  P = createPermutation(createRandomArray(block_size/2),0)
  IP = createRandomArray(block_size)
  IP_dash = inverse_permuatation(IP)
  S_BOX = []
  for(var i=0; i<block_size/8; i++)
  {
    s_tmp = []
    for(var k =0;k<4;k++)
    {
      var x = createRandomArray(16)
      for(var j=0;j<x.length;j++)
        x[j]-=1
      s_tmp.push(x)
    }
    S_BOX.push(s_tmp)
  }

  E = []
  E_tmp = []
  for(var i=1;i<=block_size/2;i++)
    E_tmp.push(i)
  var sz = block_size/2
  for(var i=0;i<sz;i+=4){
    E.push(E_tmp[(i-1+sz)%sz])
    for(var j=i;j<i+4;j++)
      E.push(E_tmp[j])
    E.push(E_tmp[(i+4+sz)%sz])
  }
}
function dec2bin(dec) {
  return (dec >>> 0).toString(2);
}
function string_to_binary(str)
{
  var arr = []
  for(var i=0;i<str.length;i++)
  {
    ascii = str.charCodeAt(i)
    binstr = dec2bin(ascii)
    while(binstr.length < 8)
      binstr = "0"+binstr
    for(var j=0;j<binstr.length;j++)
    arr.push(binstr[j]=="0" ? 0 : 1)
  }
  return arr
}

function permute(arr,box)
{
  var arr2 = []
  for(var i=0;i<box.length;i++)
    arr2.push(0)
  for(var i=0;i<box.length;i++)
      arr2[i] = arr[box[i]-1]
  return arr2
}

function rotateLeft(arr){
    let first = arr.shift();
    arr.push(first);
    return arr;
}

function shiftLeft(arr,x)
{
  for(var i=0;i<x;i++)
    arr = rotateLeft(arr)
  return arr
}
function split_array(arr,x){
  arr2 = []
  for(var i=0;i<arr.length;i+=x)
  {
    tmp = []
    for(var j=i;j<i+x;j++)
      tmp.push(arr[j])
    arr2.push(tmp)
  }
  return arr2
}

function generateKeys(key,rounds,key_size){
  roundKeys = []
  if(key.length < key_size/8)
    alert("Key should be atleast 8 characters long.")

  var tmp = ""
  for(var i=0;i<8;i++)
    tmp += key[i]
  key = tmp
  var key_arr = string_to_binary(key)
  var key_arr = permute(key_arr,PC_1)

  var tmp = split_array(key_arr,(key_size-key_size/8)/2)
  var c0 = tmp[0]
  var d0 = tmp[1]

  for(var r=0;r<rounds;r++){
    c0 = shiftLeft(c0,SHIFT[r])
    d0 = shiftLeft(d0,SHIFT[r])
    var tmp = []
    for (i=0;i<c0.length;i++)
      tmp.push(c0[i])
    for (i=0;i<d0.length;i++)
      tmp.push(d0[i])

    roundKeys.push(permute(tmp,PC_2))
  }
  revRoundKeys = []
  for(var i=rounds-1;i>=0;i--)
    revRoundKeys.push(roundKeys[i])
}

function xor(arr1,arr2){
  var arr3 = []
  for(var i=0;i<arr1.length;i++)
    arr3.push(arr1[i]^arr2[i])
  return arr3
}

function substitution(arr)
{
  arr = split_array(arr,6)
  fin = []

  for(var i=0;i<arr.length;i++)
  {
    var row = arr[i][0]*2 + arr[i][5]
    var col = 8*arr[i][1] + 4*arr[i][2] + 2*arr[i][3] + arr[i][4]

    s_ij = S_BOX[i][row][col]

    s_ij = string_to_binary(s_ij.toString())
    for(var j=0;j<s_ij.length;j++)
      fin.push(s_ij[j])
  }
  return fin
}

function bit_array_to_string(arr)
{
  arr = split_array(arr,8)
  var res = ""
  for(var i=0;i<arr.length;i++)
  {
    var sz = 8
    var tmp = 0
    var t = 1
    for(var j=sz-1;j>=0;j--)
    {
      tmp += arr[i][j]*t
      t*=2
    }
    res += String.fromCharCode(tmp)
  }
  return res
}
function DEA(txt,keys,block_size,rounds){
  var s_fac = block_size/8
  var blocks = []
  for(var i=0;i<txt.length;i+=s_fac){
    var tmp = ""
    for(var j=i;j<i+s_fac;j++)
      tmp += txt[j]
    blocks.push(tmp)
  }
  var cryp = []
  for(var b=0;b<blocks.length;b++)
  {
    var block = blocks[b]
    block = string_to_binary(block)
    block = permute(block,IP)
    block = split_array(block,block_size/2)
    var L = block[0]
    var R = block[1]

    for(var i=0;i<rounds;i++)
    {

      var r_dash = permute(R,E)

      r_dash = xor(keys[i],r_dash)

      r_dash = substitution(r_dash)

      r_dash = permute(r_dash,P)

      r_dash = xor(r_dash,L)

      L = R
      R = r_dash
    }
    tmp = []
    for(var i=0;i<R.length;i++)
      tmp.push(R[i])
    for(var i=0;i<L.length;i++)
      tmp.push(L[i])
    tmp = permute(tmp,IP_dash)
    for(var i=0;i<tmp.length;i++)
      cryp.push(tmp[i])
  }

  var ggstr = bit_array_to_string(cryp)
  return ggstr
}

function solve(){
  roundKeys = []
  revRoundKeys = []
  generateBoxes(64,7)
  generateKeys("adsadasda",16,64)
  var enc = DEA("abcdefgh",roundKeys,64,16)
  for(var i=15;i>=0;i--)
    revRoundKeys.push(roundKeys[i])
  // console.log(DEA(enc,revRoundKeys,64,16))
  // console.log(roundKeys)
}
