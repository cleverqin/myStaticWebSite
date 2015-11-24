(function(){
    /* ========================================================================
     * 轮播插件
     * ========================================================================
     * createTime 2015-09-17
     * createdBy QinZhen
     * ======================================================================== */
    $.fn.slides = function (options) {
        var $slidesBox=$(this),$listCard= $slidesBox.find("ul>li"),showIndex= 1,interval;
        var defaultOpts={
            autoPlay:true,
            animationTime:200,
            waitTime:5000,
            animationType:"left"
        };
        var opts= $.extend(defaultOpts,options);
        initSlidesSytle();
        function initSlidesSytle(){
            if(opts.animationType=="left"){
                $slidesBox.find("ul>li").each(function(index){
                    this.style.left=index*100+"%";
                })
            }
            var $aim=$("<div class='bidBox'></div>");
            for(var i=0;i<$listCard.length;i++){
                var $yan=$("<span class='bidItem'></span>");
                $aim.append($yan)
            }
            $slidesBox.append($aim);
            var $bidItemList=$(".bidBox>.bidItem");
            $bidItemList.click(function(){
                if(!$slidesBox.is(":animated")){
                    var index=$(this).index();
                    showIndex=index+1;
                    clearInterval(interval);
                    nextCard();
                    actPlay();
                }
            })
            autoPlay();
        }
        function autoPlay(){
            actPlay();
            nextCard();
        }
        function actPlay(){
            interval=setInterval(function(){
                if(showIndex>($listCard.length)){
                    showIndex=1;
                }
                nextCard();
            },opts.waitTime+opts.animationTime)
        }
        function nextCard(){
            var $bidItemList=$(".bidBox>.bidItem");
            $slidesBox.find("ul").animate({"left":"-"+(showIndex-1)*100+"%"},opts.animationTime,function(){
                $bidItemList.removeClass("active");
                $($bidItemList[showIndex-1]).addClass("active");
                showIndex++;
            })
        }
    };
    /* ========================================================================
     * 无缝滚动插件
     * ========================================================================
     * createTime 2015-11-15
     * createdBy QinZhen
     * ======================================================================== */
    $.fn.myScroll = function(options){
        //默认配置
        var defaults = {
            speed:40,  //滚动速度,值越大速度越慢
            rowHeight:41 ,//每行的高度
            hoverStop:true
        };

        var opts = $.extend({}, defaults, options),intId = [];

        function marquee(obj, step){

            obj.find("ul").animate({
                marginTop: '-=1'
            },0,function(){
                var s = Math.abs(parseInt($(this).css("margin-top")));
                if(s >= step){
                    $(this).find("li").slice(0, 1).appendTo($(this));
                    $(this).css("margin-top", 0);
                }
            });
        }

        this.each(function(i){
            var sh = opts["rowHeight"],speed = opts["speed"],_this = $(this);
            intId[i] = setInterval(function(){
                if(_this.find("ul").height()<=_this.height()){
                    clearInterval(intId[i]);
                }else{
                    marquee(_this, sh);
                }
            }, speed);

            _this.hover(function(){
                if(opts.hoverStop){
                    clearInterval(intId[i]);
                }
            },function(){
                intId[i] = setInterval(function(){
                    if(_this.find("ul").height()<=_this.height()){
                        clearInterval(intId[i]);
                    }else{
                        marquee(_this, sh);
                    }
                }, speed);
            });

        });

    }
    /* ========================================================================
     * tapBox
     * 选项卡
     * ========================================================================
     * createTime 2015-10-29
     * createdBy QinZhen
     * ======================================================================== */
    $.fn.selectTap=function(opt){
        var $this=$(this),
            $tapNav=$this.find(".tapHeader>.tapNav"),
            $tapItem=$this.find(".tapBody>.tapItem");
        var deafultOpt={};
        var option = $.extend(deafultOpt,opt);
        initFn();
        bindNavEvent();
        function initFn(){
            var thisId = window.location.hash.substr(1);
            if(thisId != "" && thisId != undefined){
                var $pointNav= $this.find(".tapHeader>.tapNav[data-point="+thisId+"]");
                if($pointNav){
                    $tapNav.removeClass("active");
                    $pointNav.addClass("active");
                }
            }
            $tapItem.hide();
            var $tapNavChecked=$this.find(".tapHeader>.tapNav.active");
            var pointId=$tapNavChecked.attr("data-point");
            $("#"+pointId).show();
        }
        function bindNavEvent(){
            $tapNav.on("click",function(){
                if(!$(this).hasClass("active")){
                    $tapNav.removeClass("active");
                    $(this).addClass("active");
                    $tapItem.hide();
                    var $tapNavChecked=$this.find(".tapHeader>.tapNav.active");
                    var pointId=$tapNavChecked.attr("data-point");
                    $("#"+pointId).fadeIn(200);
                }
            })
        }
    }
    /* ========================================================================
     * 弹出窗口
     * ========================================================================
     * createTime 2015-11-16
     * createdBy QinZhen
     * ======================================================================== */
    window.jQuery={
        AlterMsg:function(options){
            var defaults={
                msg:" ",
                buttonTxt:"确定",
                callBack:function(){}
            };
            var opts = $.extend({}, defaults, options);
            if($("#AlterMsgBox").length>0){
                $("#AlterMsgBox").show();
                $("#AlterMsgBox").find("p").text(opts.msg);
            }else{
                var $box=$("<div id='AlterMsgBox'class='Alter-box'><div class='boxBody'></div></div>"),
                    $msg=$("<p>"+opts.msg+"</p>").appendTo($box.find(".boxBody")),
                    $btnBox=$("<div class='buttonBox'></div>").appendTo($box.find(".boxBody")),
                    $btn=$("<input type='button' value="+opts.buttonTxt+">").appendTo($btnBox);
                $box.appendTo("body").hide().fadeIn(200);
                $btn.on("click",function(){
                    $box.fadeOut(200,function(){$(this).remove()});
                    opts.callBack();
                });
            }
        },
        AlterConfirm:function(options){
            var defaults={
                title:" ",
                sureButtonTxt:"确定",
                cancelButtonTxt:"取消",
                callBack:function(){}
            };
            var opts = $.extend({}, defaults, options);
            if($("#AlterConfirmBox").length>0){
                $("#AlterConfirmBox").show();
                $("#AlterConfirmBox").find("p").text(opts.msg);
            }else{
                var $box=$("<div id='AlterConfirmBox' class='Alter-box'><div class='boxBody'></div></div>"),
                    $title=$("<p>"+opts.title+"</p>").appendTo($box.find(".boxBody")),
                    $btnBox=$("<div class='buttonBox'></div>").appendTo($box.find(".boxBody")),
                    $cancelButton=$("<input type='button' class='cancelButton' value="+opts.cancelButtonTxt+">").appendTo($btnBox),
                    $sureButton=$("<input type='button' class='sureButton' value="+opts.sureButtonTxt+">").appendTo($btnBox);
                $box.appendTo("body").hide().fadeIn(200);
                $cancelButton.on("click",function(){
                    $box.fadeOut(200,function(){$(this).remove()});
                });
                $sureButton.on("click",function(){
                    $box.fadeOut(200,function(){$(this).remove()});
                    opts.callBack();
                });
            }
        }
    }
  })()
