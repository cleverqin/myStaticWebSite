/* ========================================================================
 * Carousel
 * author zhengyifan
 * createtime 2015-01-05
 * ======================================================================== */
(function(){
    var bodyStyle = document.body.style,
        touchable = ("ontouchstart" in window),
        transform = ("webkitTransform" in bodyStyle)?"-webkit-transform":
            ("transform" in bodyStyle)?"transform":false;

    var Carousel = function ($el,option) {
        var self = this;

        this.option = option;

        var $list = $el.children("ul.carousel-content"),
            $items = $list.children("li");
        this.el = $el[0];
        this.curWidth = 0;
        this.list = $list[0];
        this.length = $items.length;
        this.first = $items[0];
        this.last = $items[this.length-1];

        if (this.length === 0) {
            this.el.display = "none";
            return;
        }

        this.render($list,$items);


        this.$footer = this.getFooter();
        this.$footerList = this.$footer.children("li");
        this.queue = null;
        this.isInAnim = false;
        this.isInDrag = false;

        this.cur = null;//当前所在位置
        this.position = {now:null,touchX:0, max:0,min:0,startTime:0};


        if(transform){
            this.setLeftStyle = function(style,value){
                style[transform] = "translate("+value+",0)";
            };
        }else{
            this.setLeftStyle = function(style,value){style.left = value};
        }

        if(touchable){
            this.initTouchEvent();
        }else{
            this.$footer.delegate("li>span", "click", function () {
                self.open($(this).attr("data-index"));
            });
        }

        this.open(0);
    };
    Carousel.prototype = {
        Constructor: Carousel,
        setCurWidth:function(){
            return (this.curWidth = $(this.el).width());
        },
        render:function($list,$items){
            var renderFn = this.option.render,
                len = this.length;
            $items.each(function(i,ele){
                ele.style.left = i*100+"%";
                renderFn && renderFn.call(ele,i,ele);
            });
            $list.show();
        },
        initTouchEvent:function(){
            var list = this.list;
            list.addEventListener("touchstart",$.proxy(this.touchstart,this),false);
            list.addEventListener("touchmove",$.proxy(this.touchmove,this),false);
            list.addEventListener("touchend",$.proxy(this.touchend,this),false);

        },
        initPosition:function(touchX){
            var pos = this.position,
                width = this.setCurWidth(),
                cur = this.cur,
                first = -cur*width;
            pos.touchX = touchX;

            if(this.option.infinite){
                pos.max = first+width;
                pos.min = first-width;
            }else{
                pos.max = (cur===0)?0:(first+width);
                pos.min = ((cur+1)===this.length)?first:(first-width);
            }
            if(pos.now === null)
                pos.now = first;
            pos.startTime = new Date().getTime();
        },
        setPosition:function(touchX){
            var pos = this.position,
                x = pos.now + touchX - pos.touchX,
                max = pos.max,
                min = pos.min;
            if(x>max){
                pos.now = max;
            }else if(x<min){
                pos.now = min;
            }else{
                pos.now = x;
            }

            this.setLeftStyle(this.list.style,pos.now+"px");
            pos.touchX = touchX;
        },
        touchstart:function(e){
            if(this.isInAnim)
                return;
            clearTimeout(this.queue);
            this.isInDrag = true;

            var touch = e.touches[0];

            this.initPosition(touch.pageX);

            var tagName = e.target.tagName;
            if (tagName !== "BUTTON" && tagName !== "INPUT")
                e.preventDefault();
        },
        touchmove:function(e){//infinite
            if(!this.isInDrag)
                return;
            var touch = e.touches[0];
            this.setPosition(touch.pageX);
        },
        touchend:function(e){
            if(!this.isInDrag)
                return;

            var pos = this.position,
                cur = this.cur,
                width = this.curWidth;

            var interval = new Date().getTime()-pos.startTime,
                moveDistance = -cur*width-pos.now,
                absDistance = Math.abs(moveDistance);
            pos.now = null;

            if( (interval<200 && absDistance>30) || ((absDistance/width)>this.option.jumpRate) ){
                if(moveDistance>0){
                    this.open(this.cur+1)
                }else{
                    this.open(this.cur-1);
                }
            }else{
                this.open(this.cur);
            }

            this.isInDrag = false;
        },
        getFooter: function () {
            var tpl = "<ul class='carousel-footer' >";
            for (var i = 0; i < this.length; i++) {
                tpl += "<li><span class='dot' data-index='" + i + "'/></li>";
            }
            tpl += "</ul>";
            var $footer = $(tpl).appendTo(this.el);
            $footer.css("margin-left",-$footer.width()/2);
            return $footer;
        },
        goTo:function(index,realIndex){
            var list = this.list,
                me = this,
                pre = this.cur,
                len = this.length,
                width = this.setCurWidth(),
                style = {};
            this.isInAnim = true;
            if(!this.isInDrag){
                this.setLeftStyle(list.style,-pre*width+"px");
            }

            this.setLeftStyle(style,-index*width+"px");
            if((index == 0 && pre === (len-1)) || (pre == 0 && index === (len-1)))
                this.setListToOrigin();
            $(list).animate(style, 300, function () {
                me.setLeftStyle(list.style,-index*100+"%");
                me.isInAnim = false;
                me.setList(realIndex);
            });
        },
        setList:function(realIndex){
            if(!this.option.infinite)
                return;
            var len = this.length;

            if(realIndex===0){
                this.first.style.left = "0%";
                this.last.style.left = "-100%";
            }else if(realIndex===this.length-1){
                this.first.style.left = len*100+"%";
                this.last.style.left = (len-1)*100+"%";
            }else{
                this.setListToOrigin();
            }

            this.setLeftStyle(this.list.style,-realIndex*100+"%")
        },
        setListToOrigin:function(){
            this.first.style.left = "0%";
            this.last.style.left = (this.length-1)*100+"%";
        },
        setLeftStyle:null,
        open: function (index) {
            if(this.isInAnim)
                return;
            index = parseInt(index);
            var len = this.length;

            var realIndex = (index===-1)?(len-1):(index===len)?0:index,
                from = this.cur,
                me = this;

            //reposition
            if (from!==null) {
                this.goTo(index,realIndex);
            } else {
                this.setList(realIndex);
            }
            this.cur = realIndex;

            //reset dot
            if(from!==null)
                this.$footerList.eq(from).removeClass("active");
            this.$footerList.eq(realIndex).addClass("active");

            //autoplay
            if(this.option.autoplay){
                clearTimeout(this.queue);
                this.queue = setTimeout(function () {
                    var next = me.cur + 1;
                    if(!me.option.infinite && (next === me.length))
                        next = 0;
                    me.open(next);
                }, me.option.interval);
            }
        }
    };
    $.fn.carousel = function (option) {
        return new Carousel(this, $.extend({
            autoplay:true,
            render:null,
            jumpRate:0.25,
            interval:3000,
            infinite:true
        },option));
    };
})();