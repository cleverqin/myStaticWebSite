(function ($) {
    function SliderBar($el,options) {
        var defaultOpts={
            callback:function () {},
            move:function () {}
        };
        var opts= $.extend(defaultOpts,options);
        this.$SliderBar=$el;
        this.$controlDot=this.$SliderBar.find('.slider-dot-control');
        this.$progress=this.$SliderBar.find('.slider-progress');
        this.power=false;
        this.lastX=0;
        this.opts=opts;
        this._init();
    }
    SliderBar.prototype={
        Constructor: SliderBar,
        _init:function () {
            this._bindEvent();
        },
        _bindEvent:function () {
            var _this=this;
            _this.$controlDot.on("mousedown",function (e) {
                _this.power=true;
                _this.lastX=e.clientX;
                _this._initMoveEvent()
            })
            _this.$SliderBar.on('click',function (e) {
                var setW=event.clientX-$(this).offset().left;
                var maxW=_this.$SliderBar.width();
                if(setW>=0&&setW<=maxW){
                    var percen=setW/maxW;
                    _this.setProgress(percen);
                    _this.opts.callback&&_this.opts.callback(percen);
                }
            })
        },
        _initMoveEvent:function () {
            var _this=this;
            $(document).on("mousemove",function (e) {
                if(_this.power){
                    var curX=e.clientX;
                    var addW=curX-_this.lastX;
                    var setW=_this.$progress.width()+addW;
                    var maxW=_this.$SliderBar.width();
                    if(setW>=0&&setW<=maxW){
                        _this.lastX=curX;
                        var percen=setW/maxW;
                        var setWD=percen*100;
                        _this.$progress.css({width:setWD+"%"});
                        _this.opts.move()&&_this.opts.move(percen);
                    }
                }
            })
            $(document).on("mouseup",function (e) {
                if(_this.power){
                    var curX=e.clientX;
                    var addW=curX-_this.lastX;
                    var setW=_this.$progress.width()+addW;
                    var maxW=_this.$SliderBar.width();
                    var percen=0;
                    if(setW>=0&&setW<=maxW){
                        _this.lastX=curX;
                        percen=setW/maxW;
                    }
                    if(setW<0){
                        percen=0;
                    }
                    if(setW>maxW){
                        percen=1;
                    }
                    _this.setProgress(percen);
                    _this.opts.callback&&_this.opts.callback(percen);
                }
                _this.power=false;
                $(this).off('mousemove');
            })
        },
        setProgress:function (progress) {
            if(!this.power){
                var setW=progress*100;
                this.$progress.css({width:setW+"%"});
            }
        }
    }
    $.fn.SliderBar=function (options) {
        return new SliderBar($(this),options);
    }
})(jQuery)
$(function (){
    var songs;
    var audio=$('audio').get(0),
        playProgress=$('#playProgress').SliderBar({
            callback:function (p) {
                audio.currentTime=audio.duration*p;
            }
        }),
        index=0,
        volume;
    $.ajax({
        url: "http://api.asilu.com/163music/?type=playlist&id=545888750&callback=?",
        dataType: "jsonp",
        jsonpCallback: "jsonpBgCallback",
        success: function(data) {
           songs=data.songs;
            changeMusic(true);
            audio.volume=0.5;
            setList(songs);
        }
    });
    //删除歌曲
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
    //播放暂停
    $('.play_bt').on('click',function(){
        if(audio.paused){
            play();
        }else{
           pause();
        }
    })
    $(audio).on('play',function () {
        $('.play_bt').removeClass('icon-bofang');
        $('.play_bt').addClass('icon-zanting');
        $('#poster').addClass('playing');
    })
    $(audio).on('pause',function () {
        $('.play_bt').removeClass('icon-zanting');
        $('.play_bt').addClass('icon-bofang');
        $('#poster').removeClass('playing');
    })
    //静音
    $('.volume_icon').on('click',function(e){
        if(audio.volume===0){
            audio.volume=volume;
        }else{
            volume=audio.volume;
            audio.volume=0;
        }
    })
    $('.volume_regulate').on('click',function (e) {
        audio.volume=e.offsetX/$(this).width();
    })
    $('.volume_op').on('click',function (e) {
        e.stopPropagation();
    })

    //拖动改变音量
    $('.volume_op').on('mousedown',function () {
        $(document).on('mousemove',function (e) {
            var regulate=$('.volume_regulate');
            e.preventDefault();
            var left=(e.clientX-regulate.offset().left-$('.volume_op').width()/2).toFixed(0);
            if(left<0||left>regulate.width()){
                return;
            }
            audio.volume=left/regulate.width();
        })
        $(document).on('mouseup',function () {
            $(this).off('mousemove');
        })
    })
    //音量界面操作
    $(audio).on('volumechange',function () {
        var percent=(this.volume/1.*100).toFixed(2)+'%';
        $('.volume_op').css('left',percent);
        $('.volume_bar').css('width',percent);
        if(this.volume===0){
            $('.volume_icon').removeClass('icon-voice');
            $('.volume_icon').addClass('icon-mute');
        }else{
            $('.volume_icon').addClass('icon-voice');
            $('.volume_icon').removeClass('icon-mute');
        }
    })
    $(audio).on('timeupdate',function () {
        var percent=(audio.currentTime/audio.duration);
        playProgress.setProgress(percent);
        $('.played-time').text(duration(parseInt(audio.currentTime)));
        var curTime=parseInt(audio.currentTime);
        findLrc(curTime);
    })
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
        $(".play_date").text(duration(parseInt(audio.duration)));
        var id=songs[index].id;
        if(!songs[index].lrc){
            $.ajax({
                url: "http://api.asilu.com/163music/?type=songlrc&id="+id+"&callback=?",
                dataType: "jsonp",
                jsonpCallback: "jsonpBgCallback",
                success: function(data) {
                    if(!(data.code==5)){
                        songs[index].lrc=data;
                        setLrc(data)
                    }else {
                        $(document.getElementById("lrc")).html('<div>未来找到歌词</div>');
                    }
                }
            });
        }else {
            setLrc(songs[index].lrc);
        }
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
//    切换歌曲
    function changeMusic(isPlay) {
        var song=songs[index];
        audio.src=song.src;
        $(".music_name span").text(song.title);
        $(".singer_name").text(song.author);
        $('#poster')[0].src=song.image;
        if(!isPlay){
            play();
        }

    }
    //播放
    function play() {
        audio.play();
    }
    //暂停
    function pause() {
        audio.pause();
    }
    function parse(lrc) {
        var lyrics = lrc.split("\n");
        var lrcObj = {};
        for(var i=0;i<lyrics.length;i++){
            var lyric = decodeURIComponent(lyrics[i]);
            var timeReg = /\[\d*:\d*((\.|\:)\d*)*\]/g;
            var timeRegExpArr = lyric.match(timeReg);
            if(!timeRegExpArr)continue;
            var clause = lyric.replace(timeReg,'');
            for(var k = 0,h = timeRegExpArr.length;k < h;k++) {
                var t = timeRegExpArr[k];
                var min = Number(String(t.match(/\[\d*/i)).slice(1)),
                    sec = Number(String(t.match(/\:\d*/i)).slice(1));
                var time = min * 60 + sec;
                lrcObj[time] = clause;
            }
        }
        return lrcObj;
    }
    function setLrc(lrc) {
        var $this=$(document.getElementById("lrc"));
        $this.html('');
        $this[0].scrollTop=0+'px';
        var arr=parse(lrc);
        for(var index in arr){
            var item=arr[index];
            $("<div class='lrc-"+index+"'>"+item+"</div>").appendTo($this)
        }
    }
    function findLrc(time) {
        if(!songs[index].lrc){
            return;
        }else {
            var lrcStr =songs[index].lrc;
        }
        var lrcObj=parse(lrcStr);
        var lastLrcTime=0;
        if(lrcObj[time]){
            lastLrcTime=time;
        }else {
            var lastKey=0;
            for(var key in lrcObj){
                if(time>key){
                    lastKey=key;
                }else {
                    break;
                }
            }
            lastLrcTime=lastKey;
        }
        var curlrc=$('.lrc-'+lastLrcTime);
        if(!curlrc.hasClass('active_lrc')){
            $("#lrc div").removeClass("active_lrc");
            curlrc.addClass('active_lrc');
            var idex=getIndex(curlrc);
            var sH=(idex*20)-50;
            if(sH>0){
                $('#lrc').animate({
                    scrollTop:sH
                },200)
            }
        }
    }
    function getIndex(curLrc) {
        var idex=0;
        var $lrcList=$('#lrc div');
        for(var i in $lrcList){
            if(curLrc[0]==$lrcList[i]){
               idex=i;
               return idex;
            }
        }
        return idex;
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
})
