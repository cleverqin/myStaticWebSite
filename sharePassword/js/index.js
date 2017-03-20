const app = new Vue({
    data:function() {
        return {
            activeIndex: '1',
            dialogFormVisible:false,
            dialogFormVisible1:false,
            addForm: {
                v_id:'',
                type: 'ofo',
                bikeNo: '',
                bikePassword:'',
                addDate:""
            },
            editForm: {
                v_id:'',
                type: '',
                bikeNo: '',
                bikePassword:'',
                addDate:""
            },
            formInline: {
                v_id:'',
                type: 'all',
                bikeNo: '',
                bikePassword:''
            },
            tableData: [{
                v_id:'',
                type:"ofo",
                bikeNo: '2705594001',
                bikePassword: '012345',
                addDate: '2016-05-02'
            }],
            rules: {
                bikeNo: [
                    { required: true, message: '请输入车辆序号', trigger: 'blur' }
                ],
                bikePassword: [
                    { required: true, message: '请输入车密码', trigger: 'change' }
                ]
            }
        };
    },
    mounted:function () {
        this.tableData=Store.fetch();
    },
    methods: {
        handleSelect:function(key, keyPath) {

        },
        onSubmit:function() {
            var newTableData=[];
            var srcData=Store.fetch();
            var _this=this;
            var str1=this.formInline.bikeNo;
            var reg = new RegExp(str1,"g");
            if(this.formInline.bikeNo!=''){
                srcData.forEach(function (item) {
                    if((_this.formInline.type==item.type)){
                        if(reg.test(item.bikeNo)){
                            newTableData.push(item)
                        }
                    }else {
                        if(reg.test(item.bikeNo)&&(_this.formInline.type=='all')){
                            newTableData.push(item)
                        }
                    }
                })

            }else {
                if(_this.formInline.type=="all"){
                    srcData.forEach(function (item) {
                        newTableData.push(item)
                    })
                }else {
                    srcData.forEach(function (item) {
                        if((_this.formInline.type==item.type)){
                            if(reg.test(item.bikeNo)){
                                newTableData.push(item)
                            }
                        }
                    })
                }
            }
            this.tableData=newTableData;
        },
        onAdd:function() {
            this.dialogFormVisible=true;
            if(this.$refs['addForm']){
                this.$refs['addForm'].resetFields();
            }
        },
        handleEdit:function(index, row) {
            this.dialogFormVisible1=true;
            this.editForm.v_id=row.v_id;
            this.editForm.type=row.type;
            this.editForm.bikeNo=row.bikeNo;
            this.editForm.bikePassword=row.bikePassword;
        },
        handleDelete:function($index, row) {
            this.$confirm('你确定要删除该条记录吗?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(function(){
                this.formInline.bikeNo="";
                var newTableData=Store.fetch();
                newTableData.forEach(function (index,item) {
                    if(item.bikeNo==row.bikeNo){
                        $index=index;
                    }
                });
                this.tableData=newTableData;
                this.tableData.splice($index,1);
                Store.save(this.tableData);
                this.$message({
                    type: 'success',
                    message: '删除成功!'
                });
            })
        },
        submitAddForm:function (formName) {
            this.$refs[formName].validate(function (valid){
                if (valid) {
                    this.formInline.bikeNo="";
                    this.addForm.v_id=Store.S4();
                    this.addForm.addDate=new Date().Format("yyyy-MM-dd hh:mm:ss");
                    var newNode=JSON.parse(JSON.stringify(this.addForm));
                    this.tableData.push(newNode);
                    Store.save(this.tableData);
                    this.dialogFormVisible=false;
                    this.$message({
                        type: 'success',
                        message: '添加成功！'
                    });
                } else {
                    console.log('error submit!!');
                    return false;
                }
            });
        },
        submitEditForm:function (formName) {
            this.$refs[formName].validate(function(valid) {
                if (valid) {
                    this.formInline.bikeNo="";
                    var newNode=JSON.parse(JSON.stringify(this.editForm));
                    this.tableData.forEach(function (item) {
                        if(item.v_id==newNode.v_id){
                            item.type=newNode.type;
                            item.bikeNo=newNode.bikeNo;
                            item.bikePassword=newNode.bikePassword;
                        }
                    })
                    this.dialogFormVisible1=false;
                    Store.save(this.tableData);
                    this.$message({
                        type: 'success',
                        message: '修改成功！'
                    });
                } else {
                    console.log('error submit!!');
                    return false;
                }
            });
        }
    }
}).$mount('#app');
