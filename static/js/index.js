(function () {
    $.fn.SliderBar=function (options) {
        var defaultOpts={
            callback:function () {}
        };
        var opts= $.extend(defaultOpts,options);
        var SliderBar=function ($el,option) {
            this.option=option;
            this.dom=$el;
            this.power=false;
            this.controlDot=this.dom.find('.slider-dot-control');
            this.progress=this.dom.find('.slider-progress');
            this.lastX=0;
            var _this=this;
            this.controlDot.on("mousedown",function (e) {
                _this.power=true;
                _this.lastX=e.clientX;
            })
            $(document).on("mousemove",function (e) {
                if(_this.power){
                    var curX=e.clientX;
                    var addW=curX-_this.lastX;
                    var setW=_this.progress.width()+addW;
                    var maxW=_this.dom.width();
                    if(setW>=0&&setW<=maxW){
                        _this.lastX=curX;
                        var percen=setW/maxW;
                        _this.option.callback(percen)
                    }
                }
            })
            $(document).on("mouseup",function (e) {
                _this.power=false;
            })
            _this.dom.on('click',function (event) {
                event.stopPropagation();
                var setW=event.clientX-this.offsetLeft;
                var maxW=_this.dom.width();
                if(setW>=0&&setW<=maxW){
                    var percen=setW/maxW;
                    _this.option.callback(percen)
                }
            })
        }
        return new SliderBar($(this[0]),opts);
    }
    /* ========================================================================
     * demo元素显示在可视窗口中
     * ========================================================================
     * createTime 2016-04-14
     * createdBy QinZhen
     * ======================================================================== */
    $.fn.inVisual = function (){
        this.each(function () {
            var $this=$(this),$thisP=$this.parents();
            var thisH=$this[0].offsetHeight;
            var parentsH=$thisP[0].offsetHeight;
            var _scrollTop=$(document).scrollTop();
            var parentsTop=$thisP[0].offsetTop;
            if(parentsH>thisH){
                init();
            }
            function init() {
                window.onload = initVisual;
                window.onscroll = initVisual;
                window.onresize = initVisual;
            }
            function initVisual() {
                _scrollTop=$(document).scrollTop();
                var visualH=$(window).height();
                if(thisH<=visualH){
                    if(_scrollTop<=parentsTop){
                        $this.css({position: "relative","top":0+"px"})
                    }else if((_scrollTop>parentsTop)&&(_scrollTop<(parentsTop+(parentsH-thisH)))){
                        $this.css({position: "relative","top":(_scrollTop-parentsTop)+"px"})
                    }else {
                        $this.css({position: "relative","top":(parentsH-thisH)+"px"})
                    }
                }else {
                    if((_scrollTop+visualH)<=(parentsTop+thisH)){
                        $this.css({position: "relative","top":0+"px"})
                    }else if((_scrollTop+visualH)>(parentsTop+thisH)&&(_scrollTop+visualH)<(parentsTop+parentsH)){
                        $this.css({position: "relative","top":((_scrollTop+visualH)-(parentsTop+thisH))+"px"});
                    }else {
                        $this.css({position: "relative","top":(parentsH-thisH)+"px"});
                    }
                }
            }
        })
    };
})(jQuery)
$(function(){
    var swiper = new Swiper('.swiper-container', {
        pagination: '.swiper-pagination',
        nextButton: '.swiper-button-next',
        prevButton: '.swiper-button-prev',
        paginationClickable: true,
        spaceBetween: 0,
        centeredSlides: true,
        autoplay: 5000,
        autoplayDisableOnInteraction: false,
        loop: true
    });
    $(".rightBox").inVisual();
    var qrcode = new QRCode(document.getElementById("qrcode"), {
        width : 220,
        height : 220
    });
    $.getJSON("http://api.asilu.com/weather?city=北京&callback=?", function(data) {
        $('#weather-box').html(renderTpl(data))
    });
    function renderTpl(data) {
        var weatherItem=data.weather[0];
        var html='<div class="weather-card">' +
            '<div class="base-info"><span class="query-city">'+data.city+'</span><span class="pm-25">pm2.5：</span><span class="pm-number">'+data.pm25+'</span></div>' +
            ' <div class="weather-date">'+weatherItem.date+'</div> ' +
            '<div class="weather-info"><span>'+weatherItem.weather+'</span><span>'+weatherItem.wind+'</span></div> ' +
            '<div class="wind-temp">'+weatherItem.temp+'</div> ' +
            '</div>'
        return html
    }
    function makeCode () {
        var elText = document.getElementById("text");
        var error=document.getElementById("error");

        if (!elText.value) {
            $(error).html("文本内容不能为空");
            elText.focus();
            return;
        }
        $(error).html("");
        qrcode.makeCode(elText.value);
    }

    makeCode();

    $("#text").on('input',function(){
        makeCode();
    })
    $("#text").
    on("blur", function () {
        makeCode();
    }).
    on("keydown", function (e) {
        if (e.keyCode == 13) {
            makeCode();
        }
    });
    var songs;
    var audio=$('audio').get(0), index=0, volume=0.5;
    $.ajax({
        url: "http://api.asilu.com/163music/?type=playlist&id=545888750&callback=?",
        dataType: "jsonp",
        jsonpCallback: "jsonpBgCallback",
        success: function(data) {
            songs=data.songs;
            initPlayer();
        }
    });
    function initPlayer() {
        changeMusic(true);
        audio.volume=volume;
        $(".time-slider").SliderBar({
            callback:function (perence) {
                audio.currentTime=audio.duration*perence;
            }
        })
        $(".volume-slider").SliderBar({
            callback:function (perence) {
                audio.volume=perence
            }
        })
        setList(songs);
        $(".list-btn span").on('click',function () {
            $('.music-list-box').slideToggle();
        })
    }
    //歌曲播放完之后播放下一首
    var nextsong=function () {
        index=index+1;
        if(index===songs.length){
            index=0;
            changeMusic();
            return;
        }else{
            changeMusic();
        }
    }
    $(audio).on('ended',nextsong)
    audio.oncanplay=function () {
        $(".music-time").text(duration(parseInt(audio.duration)));
    }
    //鼠标hover显示当前位置时长
    var duration=function (time) {
        var fen=parseInt(time/60);
        var miao=time%60;
        if(fen<=9){
            fen="0"+fen;
        }
        if(miao<=9){
            miao="0"+miao;
        }
        return fen+':'+miao;
    }
    //播放暂停
    $('.play_bt').on('click',function(){
        if(audio.paused){
            audio.play();
        }else{
            audio.pause();
        }
    })
    //下一首
    $('.next_bt').on('click',function () {
        index++;
        if(index>=songs.length){
            index=0;
        }
        changeMusic();
    })
    //上一首
    $('.prev_bt').on('click',function () {
        index--;
        if(index<0){
            index=songs.length-1;
        }
        changeMusic();
    })
    $(audio).on('pause',function () {
        $('.play_bt').removeClass('icon-zanting');
        $('.play_bt').addClass('icon-bofang');
        $('.music-poster').removeClass('playing');
    })
    $(audio).on('play',function () {
        $('.play_bt').removeClass('icon-bofang');
        $('.play_bt').addClass('icon-zanting');
        $('.music-poster').addClass('playing');
    })
    //音量界面操作
    $(audio).on('volumechange',function () {
        var percent=(this.volume/1.*100).toFixed(2)+'%';
        $('.volume-slider .slider-progress').css('width',percent);
        if(this.volume===0){
            $('.volume-btn span').removeClass('icon-voice');
            $('.volume-btn span').addClass('icon-mute');
        }else{
            $('.volume-btn span').addClass('icon-voice');
            $('.volume-btn span').removeClass('icon-mute');
        }
    })
    $('.volume-btn span').on('click',function () {
        if($(this).hasClass('icon-voice')){
            volume=audio.volume;
            audio.volume=0;
        }else {
            audio.volume=volume;
        }
    })
    $(audio).on('timeupdate',function () {
        var percent=(audio.currentTime/audio.duration);
        $('.time-slider .slider-progress').css('width',percent*100+'%');
        $('.played-time').text(duration(parseInt(audio.currentTime)));
        var curms=parseInt(audio.currentTime);
    })
    function changeMusic(isPlay) {
        var song=songs[index];
        audio.src=song.src;
        $(".music-name").text(song.title);
        $(".music-singer").text(song.author);
        $('.music-poster')[0].src=song.image;
        if(!isPlay){
            audio.play();
        }
    }
    function setList(songs) {
        var list=$('table tbody');
        songs.forEach(function (song,idx){
            var $tr=$('<tr><td>'+song.title+'</td><td>'+song.author+'</td><td>--:--</td></tr>')
            list.append($tr);
            $tr.on('click',function () {
                index=idx;
                changeMusic();
            })
        })
    }
    $('.hide-btn-box').on('click',function () {
        var $span=$(this).find('span');
        if($span.hasClass('icon-left')){
            $span.removeClass("icon-left");
            $span.addClass("icon-right");
            $('.music-player-box').toggleClass('music-player-hide');
        }else {
            $span.addClass("icon-left");
            $span.removeClass("icon-right");
            $('.music-player-box').toggleClass('music-player-hide');
        }
    })
})


