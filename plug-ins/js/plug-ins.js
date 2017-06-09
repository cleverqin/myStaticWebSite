(function () {
    //幻灯片
    /**
     *
     * @param {Object}options
     * @returns {Slide}
     */
    $.fn.slide=function (options) {
        var defaultOpts={
            isAutoPlay:true,
            animationTime:500,
            waitTime:5000,
            animationType:"swiper",
            beforeBack:function (index) {},
            afterBack:function (index) {}
        };
        var opts= $.extend(defaultOpts,options);
        var Slide = function ($el,option) {
            this.option=option;
            var $list = $el.children("ul.ss-content"),
                $items = $list.children("li");
            this.el=$el[0];
            this.list = $list[0];
            this.items=$items;
            this.length = $items.length;
            this.curIndex=0;
            this.power=true;
            this.interval=null;
            this.init();
        }
        Slide.prototype={
            Constructor: Slide,
            init:function () {
                this.initSlidesSytle();
                this.goTo(this.curIndex);
                if(this.option.isAutoPlay){
                    this.autoPlay();
                }

            },
            initSlidesSytle:function(){
                var me=this;
                if(me.option.animationType=="swiper"){
                    var clone=me.items.first().clone();
                    $(me.list).append(clone);
                    me.items.each(function(index){
                        this.style.left=index*100+"%";
                    })
                    clone[0].style.left=me.length*100+"%";
                }else {
                    me.items.each(function(index){
                        this.style.display="none";
                        this.style.zIndex=-1;
                        this.style.position='relative';
                    })
                }
                me.setDirection();
                me.setNavigation();
            },
            autoPlay:function(){
                var me=this;
                me.interval=setInterval(function(){
                    ++me.curIndex;
                    me.goTo(me.curIndex);
                },me.option.waitTime+me.option.animationTime)
            },
            setDirection:function(){
                var me=this;
                var $prev=$("<span class='ui-prev'></span>").appendTo($(me.el));
                var $next=$("<span class='ui-next'></span>").appendTo($(me.el));
                $prev.click(function(){
                    if(me.power){
                        --me.curIndex;
                        me.goTo(me.curIndex);
                    }
                });
                $next.click(function(){
                    if(me.power){
                        ++me.curIndex;
                        me.goTo(me.curIndex);
                    }
                });
            },
            setNavigation:function(){
                var me=this;
                var $dotBox=$("<div class='bidBox'></div>");
                for(var i=0;i<me.items.length;i++){
                    var $dot=$("<span class='bidItem' data-index='"+i+"'></span>");
                    if(i==me.curIndex){
                        $dot.addClass('active');
                    }
                    $dotBox.append($dot)
                }
                $(me.el).append($dotBox);
                var $bidItemList=$dotBox.children(".bidItem");
                $bidItemList.click(function(){
                    if(!$(this).hasClass('active')&&me.power){
                        me.curIndex=parseInt($(this).attr('data-index'));
                        me.goTo(me.curIndex);
                    }
                });
            },
            goTo:function(index){
                var me=this;
                if(me.option.animationType=="swiper"){
                    if(index>me.length){
                        $(me.list).css({"left":"-"+0+"%"});
                        me.curIndex=1;
                        index=1;
                    }
                    if(index<0){
                        $(me.list).css({"left":"-"+me.length*100+"%"});
                        me.curIndex=me.length-1;
                        index=me.length-1;
                    }
                    $(this.el).find(".bidBox .bidItem").removeClass("active");
                    if(index==me.length){
                        $(this.el).find(".bidBox .bidItem[data-index="+0+"]").addClass("active");
                    }else {
                        $(this.el).find(".bidBox .bidItem[data-index="+index+"]").addClass("active");
                    }
                    me.power=false;
                    clearInterval(me.interval);
                    me.option.beforeBack(index);
                    $(me.list).stop(true).animate({"left":"-"+index*100+"%"},me.option.animationTime,function(){
                        me.power=true;
                        if(me.option.isAutoPlay){
                            me.autoPlay();
                        }
                        me.option.afterBack(index);
                    })
                }else {
                    if(index>=me.length){
                        me.curIndex=0;
                        index=0;
                    }
                    if(index<0){
                        me.curIndex=me.length-1;
                        index=me.length-1;
                    }
                    $(this.el).find(".bidBox .bidItem").removeClass("active");
                    $(this.el).find(".bidBox .bidItem[data-index="+index+"]").addClass("active");
                    me.power=false;
                    clearInterval(me.interval);
                    me.option.beforeBack(index);
                    var lastLi=$(me.list).find('li.active');
                    var curLi=$($(me.list).find('li')[index]);
                    if(lastLi.length>0){
                        lastLi[0].style.zIndex=-1;
                        curLi[0].style.position='absolute';
                        curLi[0].style.zIndex=1;
                        curLi.fadeIn(me.option.animationTime,function(){
                            me.power=true;
                            if(me.option.isAutoPlay){
                                me.autoPlay();
                            }
                            if(lastLi.length>0){
                                lastLi.removeClass("active");
                                lastLi.hide();
                                curLi[0].style.position='relative';
                            }
                            curLi.addClass("active");
                            me.option.afterBack(index);
                        })
                    }else {
                        curLi[0].style.zIndex=1;
                        me.power=true;
                        curLi.show();
                        curLi.addClass("active");
                        me.option.afterBack(index);
                    }

                }
            }
        }
        return new Slide($(this[0]),opts);
    }
    //显示消息
    /**
     *
     * @param {String}msg
     * @param {Object}options
     */
    var showMsg=function (msg,options) {
        var defaultOpts={
            type:'info',
            duration:3000
        };
        var opts= $.extend(defaultOpts,options);
        init();
        function init() {
            var $el=$(initDom());
            $el.addClass('animate scaleFadeIn')
            $('body').append($el);
            setTimeout(function () {
                $el.removeClass('scaleFadeIn')
                $el.fadeOut(500,function () {
                    $(this).remove()
                })
            },opts.duration)
        }
        function initDom(){
            switch(opts.type)
            {
                case 'success':
                    opts.type='success';
                    break;
                case 'warning':
                    opts.type='warning';
                    break;
                case 'error':
                    opts.type='error';
                    break;
                default:
                    opts.type='info';
            }
            return '<div class="ui-msg-box '+opts.type+'">' +
                '<div class="ui-icon-type iconfont icon-'+opts.type+'"></div> ' +
                '<div class="ui-msg-text">'+msg+'</div>' +
                '</div>';
        }
    }
    $.extend({
        showMsg:showMsg
    })
//    模态窗
    /**
     *
     * @param {Function}callback [模态窗关闭时的回调函数]
     */
    $.fn.closeModal=function (callback) {
        var $modal=$(this);
        var $content=$modal.find('.ui-modal-content');
        $content.removeClass('slideIn');
        $content.addClass('slideOut');
        $modal.fadeOut(500)
    }
    $(document).on('click','[data-modal]',function (e) {
        var id=$(this).attr('data-modal');
        var $modal=$('#'+id);
        var $content=$modal.find('.ui-modal-content');
        $modal.show()
        $content.removeClass('slideOut');
        $content.addClass('slideIn');
        $modal.trigger('modal-open')
    })
    $(document).on('click','[data-close]',function (e) {
        var id=$(this).attr('data-close');
        var $modal=$('#'+id);
        $modal.closeModal(function () {});
    })
    /**
     *
     * @param {Object}options
     */
    var confirm=function(options) {
        var defaultOpts={
            title:'提示',
            text:'',
            sureCallBack:function () {},
            cancelCallback:function () {}
        };
        var opts= $.extend(defaultOpts,options);
        this.opts=opts;
        this.init();
    }
    confirm.prototype={
        Constructor: confirm,
        init:function () {
            this.initDom();
            this.initEvent();
            this._openConfirm();
        },
        initDom:function () {
            this.$confirmBox=$('<div class="ui-confirm-box"></div>')
            this.$confirmWrapper=$('<div class="ui-confirm-wrapper"></div>')
            this.$confirmHeader=$('<div class="ui-confirm-title"><div class="ui-confirm-text">'+this.opts.title+'</div><div class="ui-confirm-close iconfont icon-guanbi"></div></div>')
            this.$confirmBody=$('<div class="ui-confirm-body"><div>'+this.opts.text+'</div></div>');
            this.$confirmFooter=$('<div class="ui-confirm-btns"><a href="javascript:" class="ui-btn ui-btn-primary confirm-sure">确定</a> <a href="javascript:" class="ui-btn ui-btn-default confirm-cancel">取消</a></div>')
            this.$confirmWrapper.append(this.$confirmHeader);
            this.$confirmWrapper.append(this.$confirmBody);
            this.$confirmWrapper.append(this.$confirmFooter);
            this.$confirmWrapper.appendTo(this.$confirmBox);
            this.$confirmBox.appendTo($('body'));
        },
        initEvent:function () {
            var _this=this;
            this.$confirmHeader.find('.ui-confirm-close').on('click',function (e) {
                _this._closeConfirm();
            })
            this.$confirmFooter.find('.confirm-sure').on('click',function (e) {
                _this._closeConfirm('sure');
            })
            this.$confirmFooter.find('.confirm-cancel').on('click',function (e) {
                _this._closeConfirm('cancel');
            })
        },
        _openConfirm:function () {
            this.$confirmWrapper.addClass('slideIn');
            this.$confirmBox.fadeIn(500)
        },
        _closeConfirm:function (type) {
            var _this=this;
            this.$confirmWrapper.removeClass('slideIn');
            this.$confirmWrapper.addClass('slideOut');
            this.$confirmBox.fadeOut(500,function () {
                if(type='sure'){
                    _this.opts.sureCallBack()
                }else if(type='cancel'){
                    _this.cancelCallback()
                }
                _this.$confirmBox.remove()
            })
        }
    }
    $.extend({
        confirmMsg:function (option) {
            return new confirm(option)
        }
    })
    function loading(options) {
        var defaultOpts={
            target:document.body,
            type:'position'
        };
        var opts= $.extend(defaultOpts,options);
        this.opts=opts;
        this.init();
    }
    loading.prototype={
        Constructor: confirm,
        init:function () {
            this.initDom()
        },
        initDom:function () {
            this.$loading=$('<div class="ui-loading-box"><div class="ui-loading"></div></div>');
            $(this.opts.target).prepend(this.$loading)
        },
        closeLoading:function () {
            this.$loading.remove()
        }
    }
    $.extend({
        loading:function (option) {
            return new loading(option)
        }
    })
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
})()