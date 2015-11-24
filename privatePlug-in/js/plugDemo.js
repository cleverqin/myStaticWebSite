$(function(){
    $("#slidesBox").slides();
    $('.myscroll').myScroll({
        speed: 40, //数值越大，速度越慢
        rowHeight: 41 //li的高度
    });
    $(".tapBox").selectTap();
})
