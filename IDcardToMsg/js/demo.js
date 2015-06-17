$(document).ready(function(){
    $("#test").click(function(){
        var IDcard=$("input[name='IDcard']").val();
        var data=validIDcard(IDcard);
        if(data.pass){
            $("div.error").html("").hide();
            var $demo=$("<tr><td class='center'>"+IDcard+"</td><td class='center'>"+data.sex+"</td><td class='center'>"+data.birthDay+"</td><td>"+data.address+"</td></tr>");
            $("table").append($demo);
        }else{
            $("div.error").html("请输入正确的身份证号码").show();
        }
    })
})