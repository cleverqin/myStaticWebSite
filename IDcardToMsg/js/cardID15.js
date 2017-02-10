// JavaScript Document



  function checkCardID(cardID15) {
      var v = new Array();
      var vs = "10X98765432";
      var newCardID = "";
      v.push(2, 4, 8, 5, 10, 9, 7, 3, 6, 1, 2, 4, 8, 5, 10, 9, 7);
         var cardID = cardID15; 
		 var Eaxe=/^\d{15}$/;
        var msg="";
         if(cardID.length!=15&&!Eaxe.test(cardID)){
            msg="请输入正确的身份证号";
            return;  
        }  
        var month = cardID.substring(8,10);//���15λ�����е��·�  
        if(!checkMonth(month)) {
             msg="身份证出生日期不正确";
             return;
         }  
       var year = "19" + cardID.substring(6,8);  
       var day = cardID.substring(10,12);  
       if(!checkDay(year,month,day)) {
           msg="身份证出生日期不正确";
           return;
       }
    //将15位身份证号转换为18位
    var cardID17 = cardID.substring(0,6)+"19"+cardID.substring(6);  
    var N = 0;  
    var R = -1;  
    var T = '0';//�������һ������  
    var j = 0;  
    var cardID18="";  
    //转化为18位身份证号
    for (var i = 16; i >= 0; i--) {
            N += parseInt(cardID17.substring(i, i + 1)) * v[j];  
            j++;  
    }  
    R = N % 11;  
    T = vs.charAt(R);  
    cardID18 = cardID17 + T;  
    newCardID = cardID18;
	return newCardID;
}
//校验月是否正确
function checkMonth(month)  
{  
    if(month<1||month>12)  
    {  
        return false;  
    }  
    return true;  
}
//校验天是否正确
function checkDay(year,month,day)  
{  
    var Mday = 0;  
    if(day<1||day>31)  
    {  
        return false;  
    }  
    if(month==1||month==3||month==5||month==7||month==8||month==10||month==12)  
    {  
         Mday = 31;  
    }   
    if(month==4||month==6||month==9||month==11)  
    {  
         Mday = 30;  
    }  
    if(month==2)  
    {  
         Mday = isLeapYear(year);   
    }  
    if(day>Mday)  
    {  
        return false;  
    }  
    return true;  
}
//判断是否是润年
function isLeapYear(year) {
    return (year % 4 == 0 && year % 100 != 0) || (year % 400 == 0) ? 29 : 28;  
}
  function  validIDcard (IDCode){
      var ReObj={pass:true,sex:"",msg:"",address:"",birthDay:""};
      var IDcode18=IDCode;
    if (IDCode.length!=15&&IDCode.length!=18){
        ReObj.msg="身份证号长度应为15位或18位";
        ReObj.pass=false;
    }else if(IDCode.length==18){
        var obj=IdentityCodeValid(IDCode);
        ReObj.pass=obj.pass;
        ReObj.sex=obj.sex;
        ReObj.msg=obj.msg;
        flag=obj.pass;
     }else if(IDCode.length==15){
        var Newcode=checkCardID(IDCode);
        IDcode18=Newcode;
        var obj=IdentityCodeValid(Newcode);
        ReObj.pass=obj.pass;
        ReObj.sex=obj.sex;
        ReObj.msg=obj.msg;
        flag=obj.pass;
    }
      if(ReObj.pass){
          ReObj.address=areaStr(IDCode);
          var birthDate=IDcode18.substr(6,4)+"-"+IDcode18.substr(10,2)+"-"+IDcode18.substr(12,2);
          ReObj.birthDay=birthDate;
      }
      return ReObj;
  }
//18为身份证验证校验码
function IdentityCodeValid(code) {
    var city={11:"北京",12:"天津",13:"�ӱ�",14:"ɽ��",15:"���ɹ�",21:"����",22:"����",23:"���� ",31:"�Ϻ�",
        32:"����",33:"�㽭",34:"����",35:"����",36:"����",37:"ɽ��",41:"����",42:"���� ",43:"����",44:"�㶫",
        45:"����",46:"����",50:"����",51:"�Ĵ�",52:"����",53:"����",54:"���� ",61:"����",62:"����",63:"�ຣ",64:"����",
        65:"�½�",71:"̨��",81:"���",82:"����",91:"���� "};
    var tip = "";
    var sex="";
    var pass= true;
    var _num=code.substr(0,17);
    var obj={pass:true,sex:"",msg:""}
    if(!code || !/^\d{6}(18|19|20)?\d{2}(0[1-9]|1[12])(0[1-9]|[12]\d|3[01])\d{3}(\d|X)$/i.test(code)){
        tip = "身份证格式不正确";
        pass = false;
    } else if(!city[code.substr(0,2)]){
        tip = "身份证省市码不存在";
        pass = false;
    } else{
        if(isPassPower(code)){
            if(parseInt(_num.charAt(16))%2==0){
                sex="女";
            }else{
                sex="男";
            }
        }else {
            pass=false;
            tip="身份证校验码错误";
        }
    }
    obj.pass=pass;obj.sex=sex;obj.msg=tip;
    return obj;
}
//判断18位身份证最后一位校验码是否正确
function isPassPower(code) {
      var flag=false;
    if(code.length == 18){
        code = code.split('');
        var factor = [ 7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2 ];
        var parity = [ 1, 0, 'X', 9, 8, 7, 6, 5, 4, 3, 2 ];
        var sum = 0;
        var ai = 0;
        var wi = 0;
        for (var i = 0; i < 17; i++) {
            ai = code[i];
            wi = factor[i];
            sum += ai * wi;
        }
        var last = parity[sum % 11];
        if(last== code[17]){
           flag=true;
        }
    }
    return flag;
}