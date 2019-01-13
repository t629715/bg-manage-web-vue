<template>
    <div id="content">
        <div id="content-header">
            <div id="breadcrumb"><a href="javascript:;" title="Go to Home" class="tip-bottom"><i
                class="icon-home"></i> 系统管理</a> <a href="javascript:;" class="current">账号管理</a>
            </div>
        </div>
        <div class="container-fluid">
            <!-- 表单 -->

            <div class="formBox">
                <el-form :inline="true" demo-form-inline ref="form" :model="form"
                         label-width="80px">
                    <el-form-item label="用户名" prop="username">
                        <el-input size="small" v-model="form.username"></el-input>
                    </el-form-item>


                    <el-form-item label="创建时间" prop="date1">
                        <el-col :span="10">
                            <el-date-picker size="small" v-model="form.date1" type="datetime"
                                            placeholder="选择日期时间" align="right" ></el-date-picker>
                        </el-col>

                    </el-form-item>
                    <el-form-item prop="date2">
                        <el-col :span="10">
                            <el-date-picker size="small" v-model="form.date2" type="datetime"
                                            placeholder="选择日期时间" align="right"></el-date-picker>
                        </el-col>
                    </el-form-item>

                    <br>&nbsp;&nbsp;
                    <el-form-item>
                        <el-button size="small" type="primary" @click="onSubmit(form)">查询
                        </el-button>
                    </el-form-item>
                    <el-form-item>
                        <el-button size="small" type="danger" @click="resetForm(form)">清除
                        </el-button>
                    </el-form-item>
                    <el-form-item>
                        <el-button size="small" type="success" @click="add">新增用户</el-button>
                    </el-form-item>
                </el-form>
            </div>
            <!-- 表格 -->
            <div class="tableBox">
                <el-table :data="tableData" fit border stripe
                          style="width:auto;display:inline-block">
                    <el-table-column type="index" label="序号" width="100"></el-table-column>
                    <el-table-column prop="userName" label="用户名" width="100"></el-table-column>
                    <el-table-column prop="rname" label="角色" width="180"></el-table-column>
                    <el-table-column prop="createTime" label="创建时间" width="180"></el-table-column>
                    <el-table-column label="操作" width="200">
                        <template slot-scope="scope">
                            <el-button size="small"

                                       type="primary"
                                       @click="handleEdit(scope.$index, scope.row)">编辑
                            </el-button>
                            <el-button size="small"

                                       type="danger"
                                       @click="deleDialog(scope.$index, scope.row)">删除
                            </el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
            <!-- 分页 -->
            <div class="paginationBox">
                <el-pagination
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :current-page="currentPage"
                    :page-sizes="[10, 20, 30, 40]"
                    :page-size="pagesize"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="totalNum">
                </el-pagination>
            </div>
            <!-- 新增用户对话框 -->
            <el-dialog title="新增用户" :visible.sync="dialogFormVisible" center width="30%">
                <el-form :model="newform " :rules="rules" ref="newform">
                    <el-form-item label="用户名" :label-width="formLabelWidth" prop="username">
                        <el-input size="small" v-model="newform.username"
                                  auto-complete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="密码" :label-width="formLabelWidth" prop="password">
                        <el-input size="small" v-model="newform.password"
                                  auto-complete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="角色" :label-width="formLabelWidth" prop="actor1">
                        <el-select @change="actorChange($event)"size="small" v-model="newform.actor1" placeholder="请选择">
                            <el-option v-for="item in actorList"  :key="item.id" :label = "item.name"
                                       :value="item.id+''"></el-option>
                        </el-select>
                    </el-form-item>
                    <!--<el-form-item label="类型" :label-width="formLabelWidth" prop="type">
                        <el-select size="small" v-model="newform.type" placeholder="请选择">
                            <el-option v-for="item in types" :label="item.name" :key="item.id"
                                       :value="item.id+''"></el-option>
                        </el-select>
                    </el-form-item>-->
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button size="small" @click="dialogFormVisible = false">取 消</el-button>
                    <el-button size="small" type="primary" @click="confirmAdd('newform')">确 定
                    </el-button>
                </div>
            </el-dialog>
            <!-- 编辑弹框 -->
            <el-dialog title="编辑用户" center width="30%" :visible.sync="dialogFormVisibleEdit">
                <el-form :model="newformEdit">
                    <el-form-item label="用户名" :label-width="formLabelWidth">
                        <el-input size="small" v-model="newformEdit.username"
                                  auto-complete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="密码" :label-width="formLabelWidth">
                        <el-input size="small" v-model="newformEdit.password"
                                  auto-complete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="角色" :label-width="formLabelWidth">
                        <el-select  @change="actorChange($event)" size="small" v-model="newformEdit.actor" placeholder="请选择">
                            <el-option v-for="item in actorList" :label="item.name" :key="item.id"
                                       :value="item.id"></el-option>
                        </el-select>
                    </el-form-item>
                    <!-- <el-form-item label="类型" :label-width="formLabelWidth">
                        <el-select size="small" v-model="newformEdit.type" placeholder="请选择">
                            <el-option v-for="item in types" :label="item.name" :key="item.id"
                                       :value="item.id"></el-option>
                        </el-select>
                    </el-form-item> -->
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button size="small" @click="dialogFormVisibleEdit = false">取 消</el-button>
                    <el-button size="small" type="primary" @click="confirmAddEdit">确 定</el-button>
                </div>
            </el-dialog>
            <!-- 删除 -->
            <el-dialog title="确认删除？" center width="30%" :visible.sync="dialogFormVisibleDelete">
                <div slot="footer" class="dialog-footer">
                    <el-button size="small" @click="dialogFormVisibleDelete = false">取 消</el-button>
                    <el-button size="small" type="primary" @click="handleDelete">确 定</el-button>
                </div>
            </el-dialog>
        </div>
    </div>
</template>
<script>
    export default {
        //model 初始数据
        data() {
            return {
                loading: true,
                types:[
                    {
                        id:1,
                        name:"公司"
                    },
                    {
                        id:2,
                        name:"非公司"
                    }
                ],
                actorList: "",
                actorName:"",
                form: {
                    username: '',
                    region: '',
                    date1: '',
                    date2: '',
                    delivery: false,
                    type: [],
                    resource: '',
                    desc: ''
                },
                newform: {
                    username: '',
                    password: '',
                    actor1: '',
                    type:''
                },
                newformEdit: {
                    username: '',
                    password: '',
                    actor: "",
                    type:''
                },
                url: this.api+"user/selectByUsers",
                actorUrl: this.api+"role/selectByRoleAll",
                addUrl: this.api+"user/insertUser",
                editUrl: this.api+"user/updateUser",
                deleteUrl: this.api+"user/deleteUser",
                currentPage: 0,
                pagesize: 10,
                pageNum: 1,
                totalNum: 0,
                tableData: [],
                dialogFormVisible: false,
                dialogFormVisibleEdit: false,
                dialogFormVisibleDelete: false,
                formLabelWidth: '120px',
                userId: "",
                rules: {
                    username: [
                        {required: true, message: '请输入用户名', trigger: 'blur'}
                    ],
                    password: [
                        {required: true, message: '请输入密码', trigger: 'blur'}
                    ],
                    actor1: [
                        {required: true, message: '请选择角色', trigger: 'blur'}
                    ],
                    type: [
                        {required: true, message: '请选择类型', trigger: 'blur'}
                    ],
                }
            }
        },
        //页面渲染加载方法
        created() {
            this.loadData(10, 1);
            let _this = this;
            axios.get(this.actorUrl)
                .then(function (response) {
                    _this.actorList = response.data;

                })
                .catch(function (error) {
                    self.$router.push('/login');
                    console.log(error);
                });

        },
        //定义方法
        methods: {
            actorChange(value){
                if (value != ''){
                    let obj = {};
                    obj = this.actorList.find((item)=>{
                        return item.id == value;
                    });
                    if (obj.name==='代理商' || obj.name==='经纪人'){
                        this.actorName = '2';
                    }else {
                        this.actorName = '1'
                    }
                }
            },
            //查询方法
            onSubmit(form) {
                var params = new URLSearchParams();
                let _this = this;
                var datetime1 = '', datetime2 = "", phoneNum = "";
                if (form.username == undefined) {
                    phoneNum = "";
                } else {
                    phoneNum = form.username;
                }
                if (form.date1 != "") {
                    datetime1 = Date.parse(form.date1)
                }
                if (form.date2 != '') {
                    datetime2 = Date.parse(form.date2)
                }
                params.append('pageSize', this.pagesize);
                params.append('pageNum', this.currentPage);
                params.append('phone', phoneNum);
                params.append('startTime', datetime1);
                params.append('endTime', datetime2);
                axios.post(this.url, params)
                    .then(function (response) {

                        _this.$message({
                                           message: '查询成功',
                                           type: 'success'
                                       });
                        _this.currentPage = response.data.data.pageNum;
                        _this.pagesize = response.data.data.pageSize;
                        _this.pageNum = response.data.data.pages;
                        _this.totalNum = response.data.data.total;
                        _this.tableData = response.data.data.list;
                    })
                    .catch(function (error) {
                        self.$router.push('/login');
                    });

            },
            //清空表单
            resetForm() {
                this.$refs.form.resetFields();
                this.loadData(10, 1);
            },
            //  添加用户按钮
            add() {
                this.newform = {
                    username: '',
                    password: '',
                    actor1: '',
                    type:''
                }
                this.dialogFormVisible = true
            },
            //  确定添加用户
            confirmAdd(formName) {
                var params = new URLSearchParams();
                params.append('password', this.newform.password);
                params.append('userName', this.newform.username);
                params.append("type",this.actorName);
                // params.append('phone', 132);
                params.append('rids', this.newform.actor1);
                let _this = this;
                this.$refs[formName].validate((valid) => {
                    if(valid) {
                        this.$refs[formName].resetFields();
                        axios.post(_this.addUrl, params)
                            .then(function (response) {
                                if (response.data.data.msg == 1) {
                                    _this.$message({
                                                       message: '添加成功',
                                                       type: 'success'
                                                   });
                                    _this.dialogFormVisible = false;
                                    _this.loadData(_this.pagesize, 1);
                                } else if (response.data.data.msg == -1) {
                                    _this.$message({
                                                       message: '账户已存在',
                                                       type: 'warning'
                                                   });
                                    _this.dialogFormVisible = false;
                                } else {
                                    _this.$message.error('网络错误');
                                    _this.dialogFormVisible = false;
                                }
                            })
                    }
                }
            )
            },
            //  编辑按钮
            handleEdit(index, row) {
                // console.log(row)
                // row为行列信息
                this.newformEdit = {
                    username: row.userName,
                    password: "",
                    actor: row.rid,
                    type: row.pid != null?2:1,
                }
                //存储 用户角色id
                this.userId = row.id;
                this.dialogFormVisibleEdit = true;
            },
            //  确定编辑方法
            confirmAddEdit() {

                var params = new URLSearchParams();
                params.append('password', this.newformEdit.password);
                params.append('userName', this.newformEdit.username);
                params.append('rids', this.newformEdit.actor);
                params.append("type",this.actorName);
                params.append('id', this.userId);
                let _this = this;
                axios.post(this.editUrl, params)
                    .then(function (response) {
                        if (response.data.data.msg == 1) {
                            _this.$message({
                                               message: '修改成功',
                                               type: 'success'
                                           });
                            _this.dialogFormVisibleEdit = false;
                            _this.loadData(_this.pagesize, 1);
                        } else if (response.data.data.msg == 0) {
                            _this.$message({
                                               message: '修改失败',
                                               type: 'warning'
                                           });
                            _this.dialogFormVisibleEdit = false;
                        } else {
                            _this.dialogFormVisibleEdit = false;
                            _this.$message.error('网络错误');
                        }
                    })
                    .catch(function (error) {
                        self.$router.push('/login');
                        _this.dialogFormVisibleEdit = false;
                        _this.$message.error('网络错误');
                    });
            },
            deleDialog(index, row) {
                this.dialogFormVisibleDelete = true;
                this.row = row;
            },
            //删除
            handleDelete() {
                let _this = this;
                var params = new URLSearchParams();
                params.append('id', _this.row.id);
                axios.post(this.deleteUrl, params)
                    .then(function (response) {
                        if (response.data.data.msg == 1) {
                            _this.$message({
                                               message: '删除成功',
                                               type: 'success'
                                           });
                            _this.dialogFormVisibleDelete = false;
                            _this.loadData(_this.pagesize, 1);
                        } else if (response.data.data.msg == 0) {
                            _this.$message({
                                               message: '删除失败',
                                               type: 'warning'
                                           });
                            _this.dialogFormVisibleDelete = false;
                        } else {
                            _this.dialogFormVisibleDelete = false;
                            _this.$message.error('网络错误');
                        }
                    })
                    .catch(function (error) {
                        self.$router.push('/login');
                    });
            },
            //刷新表格方法
            loadData(pagesize, pageNum) {
                var params = new URLSearchParams();
                var datetime1 = '', datetime2 = "", phoneNum = "";
                if (this.form.username == undefined) {
                    phoneNum = "";
                } else {
                    phoneNum = this.form.username;
                }
                if (this.form.date1 != "") {
                    datetime1 = Date.parse(this.form.date1)
                }
                if (this.form.date2 != '') {
                    datetime2 = Date.parse(this.form.date2)
                }
                this.pagesize = pagesize;
                this.currentPage = pageNum;
                params.append('pageSize', this.pagesize);
                params.append('pageNum', this.currentPage);
                params.append('phone', phoneNum);
                params.append('startTime', datetime1);
                params.append('endTime', datetime2);
                let _this = this;

                axios.post(this.url, params)
                    .then(function (response) {
                        _this.currentPage = response.data.data.pageNum
                        _this.pagesize = response.data.data.pageSize
                        _this.pageNum = response.data.data.pages
                        _this.totalNum = response.data.data.total
                        _this.tableData = response.data.data.list;
                    })
                    .catch(function (error) {
                        self.$router.push('/login');
                    });
            },
            //当前页改变是执行
            handleCurrentChange(val) {
                // this.pageNum=val;
                // this.onSubmit(this.form)
                this.loadData(this.pagesize, val);
            },
            //页数size 改变时执行
            handleSizeChange(val) {
                this.loadData(val, 1);

            }
        }
    }
</script>
<style scoped>
</style>
