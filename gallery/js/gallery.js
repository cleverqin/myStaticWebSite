$(function () {
    initFlip();
    initEvent();
})
function initFlip() {
    var left={min:0,max:($(".stage")[0].offsetWidth- $(".flip-card")[0].offsetWidth)};
    var top={min:0,max:($(".stage")[0].offsetHeight- $(".flip-card")[0].offsetHeight)};
    $(".flip-card").each(function () {
        this.style.left=parseInt(Math.random()*left.max)+"px";
        this.style.top=parseInt(Math.random()*top.max)+"px";
        var a=-1;
        var randomNum=parseInt(Math.random()*2);
        var abs=randomNum>0?a:1;
        var rotate=parseInt(Math.random()*30);
        this.style.transform="rotate("+(abs*rotate)+"deg)";
    })
}
function initEvent() {
    $(".flip-card").on("click",function () {
        if(!$(this).hasClass("center")){
            $(".flip-card").removeClass("center hover");
            $(this).addClass("center");
        }else {
            if(!$(this).hasClass("hover")){
                $(this).addClass("hover");
            }else {
                $(this).removeClass("hover center");
            }
        }
    })
}