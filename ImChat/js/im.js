window.onload=function () {
    String.prototype.Trim = function() {
        return this.replace(/(^\s*)|(\s*$)/g, "");
    }
    var urlPre = "http://cors.itxti.net/?"
    //发车、到站 查时刻
    var url1 = "www.tuling123.com/openapi/api?";
    var face=null;
    var robot={
        nickName:"机器人",
        pic:"http://www.tuling123.com/resources/web/v4/img/personalCen/icon36.png"
    }
    var msgItem=Vue.extend({
        template:"#msgTpl",
        props:['msg']
    });
    window.app = new Vue({
        data:function () {
            return{
                curUser:{
                    nickName:"似水流年",
                    pic:"img/11.jpg"
                },
                content:"",
                msgList:[
                    {
                        type:"sys",
                        content:{
                            msg:"系统消息：机器人加入了聊天室"
                        }
                    }
                ]
            }
        },
        el: '#content',
        components: {
            'msg-item': msgItem
        },
        methods:{
            sendMsg:function () {
                if(this.content.Trim()!=""){
                    var msgItem={
                        type:'send',
                        content:{
                            user:this.curUser,
                            msg:face.replaceFace(this.content)
                        }
                    }
                    this.msgList.push(msgItem);
                    this.getMsg(this.content);
                    this.content="";
                    document.querySelector(".ui-msg-input").focus();
                }else {
                    this.msg="";
                }
            },
            getMsg:function (msg) {
                var _this=this;
                var url=urlPre+url1;
                this.$http.get(url,{params:{
                    key:'a36d98ad2dfa44a487c74fefff41080c',
                    info:msg,
                    userid:"123456"
                }}).then(function (response) {
                    var data=response.body;
                    if(data.text){
                        var msgItem={
                            type:'user',
                            content:{
                                user:robot,
                                msg:filterData(data)
                            }
                        }
                        _this.msgList.push(msgItem);
                    }
                })
            }
        },
        updated:function () {
            document.querySelector(".ui-msg-content").scrollTop = document.querySelector(".ui-msg-content").scrollHeight;
        }
    });
    face=new Face({
        el:document.querySelector(".ui-face-btn"),
        callBack:function (face,faceWarp) {
            app.content+="【"+face.title+"】"
        }
    });
    function filterData(data) {
        switch(data.code)
        {
            case 100000://文本类
                return data.text
                break;
            case 200000://链接类
                return data.text+"<a href='"+data.url+"' class='res-link' target='page'>打开页页面</a>"
                break;
            case 302000://新闻类
                var html=data.text+"<ul class='res-list'>";
                var len=3;
                if(data.list.length<3){
                    len=data.list.length
                }
                for(var i=0;i<len;i++){
                    var item=data.list[i];
                    html+="<li><a href='"+item.detailurl+"' target='page'>"+item.article+"</a></li>"
                }
                html+='</li>';
                return html;
                break;
            case 308000://菜谱类
                var html=data.text+"<ul class='res-list'>";
                var len=3;
                if(data.list.length<3){
                    len=data.list.length
                }
                for(var i=0;i<len;i++){
                    var item=data.list[i];
                    html+="<li><a href='"+item.detailurl+"' target='page'>"+item.name+"</a></li>"
                }
                html+='</li>';
                return html;
                break;
            default:
                return data.text
        }
    }
}