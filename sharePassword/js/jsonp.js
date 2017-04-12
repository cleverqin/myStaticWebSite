(function () {
    var apis={
        list:[
            {title:'天气查询',url:'http://api.asilu.com/weather/',key:'weather',data:[{title:'城市',name:'city',value:'北京'}]},
            {title:'IP 查询',url:'http://api.asilu.com/ip/',key:'ip',data:[{title:'IP 或 域名',name:'ip',value:'www.baidu.com'}]},
            {title:'身份证校验',url:'http://api.asilu.com/idcard/',key:'idcard',data:[{title:'身份证号码',name:'id',value:'152502199405148245'}]},
            {title:'翻译',url:'http://api.asilu.com/fanyi/',key:'fanyi',data:[{title:'要翻译的内容',name:'q',value:'I love you'},{title:'类型',name:'type',value:'',desc:'选填 如果需要查询单词传 dict'}]},
            {title:'Bing 壁纸获取',url:'http://api.asilu.com/bg/',key:'bg',data:[]},
            {title:'芒果 TV 视频获取',url:'http://api.asilu.com/mgtv/',key:'mgtv',data:[{title:'视频 id',name:'id',value:'3394357'}]},
            {title:'快递查询',url:'http://api.asilu.com/express/',key:'express',data:[{title:'快递单号',name:'id',value:'12345678'},{title:'快递公司 (code 或者 中文)',name:'com',value:'圆通'}]},
            {title:'获取用户设备信息',url:'http://api.asilu.com/user-agent/',key:'user-agent',desc:'通过 user-agent 分析用户设备信息',data:[{title:'USER AGENT (UA 字符串)',name:'USER_AGENT',value:'',desc:'为空 获取当前设备信息 Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/49.0.2623.87 Safari/537.36'}]},
            {title:'RSS 订阅信息获取',url:'http://api.asilu.com/rss/',key:'rss',data:[{title:'RSS 订阅地址',name:'url',value:'http://www.gouji.org/rss.php'}]},
            {title:'手机归属地查询',url:'https://tcc.taobao.com/cc/json/mobile_tel_segment.htm',key:'phone',data:[{title:'手机号码',name:'tel',value:'13666666666'}]},
            {title:'百度音乐搜索',url:'http://tingapi.ting.baidu.com/v1/restserver/ting/',key:'ting',data:[{title:'搜索关键词',name:'query',value:'爱'}, {title:'默认值 无需修改',name:'method',value:'baidu.ting.search.common',readonly:!0}]},
            {title:'网易音乐信息',url:'http://api.asilu.com/163music/',key:'163music',data:[{title:'类型',name:'type',value:'song',desc:"可查询类型{song:'歌曲',album:'专辑',userlist:'用户',playlist:'播放列表',songlrc:'歌词'}"},{title:'ID',name:'id',value:'34125023'}]},
            {title:'豆瓣信息获取',url:'http://api.asilu.com/douban/',key:'douban',data:[{title:'ID 类型',name:'type',value:{doulist:'豆列',movie:'视频',music:'音乐',photo_album:'相册',book:'图书'},desc:'可查询 ID 类型'},{title:'ID',name:'id',value:'45195492'}]}]};
    new Vue({
        el:"#app",
        data:function() {
            return {
                ruleForm:{
                    table:'',
                    options: apis.list
                },
                ruleForm1:{},
                res:"",
            };
        },
        created:function () {
            this.ruleForm.table=this.ruleForm.options[0];
        },
        watch:{
            ruleForm:{
                handler:function () {
                    var obj={};
                    for(var i=0;i<this.ruleForm.table.data.length;i++){
                        var item=this.ruleForm.table.data[i];
                        obj[item.name]=item.value
                    }
                    this.ruleForm1=obj;
                },
                deep:true
            }
        },
        methods: {
            submitForm:function() {
                var _this=this;
                var url=this.ruleForm.table.url+"?"+urlEncode(this.ruleForm1);
                this.$http.jsonp(url).then(function(response){
                    if(response){
                        _this.res=prettyPrintOne(formatJSON(response.body, '\t'), 'json', true);
                    }
                })
            }
        }
    })
    var urlEncode = function (param, key, encode) {
        if(param==null) return '';
        var paramStr = '';
        var t = typeof (param);
        if (t == 'string' || t == 'number' || t == 'boolean') {
            paramStr += '&' + key + '=' + ((encode==null||encode) ? encodeURIComponent(param) : param);
        } else {
            for (var i in param) {
                var k = key == null ? i : key + (param instanceof Array ? '[' + i + ']' : '.' + i);
                paramStr += urlEncode(param[i], k, encode);
            }
        }
        return paramStr;
    };
})()