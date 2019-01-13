<template>
    <div class="headBox">
        <div id="header">
            <img class="mr25" src="../../../static/img/Admin.png" alt="Logo"/>
            <img src="../../../static/img/Admin.png" alt="Logo"/>
        </div>
        <div id="user-nav" class="navbar navbar-inverse">
            <ul class="nav">
                <li class="dropdown" id="profile-messages">
                    <a title="" href="javascript:;" data-toggle="dropdown"
                       data-target="#profile-messages" class="dropdown-toggle">
                        <i class="icon icon-user"></i>
                        <span class="text">欢迎{{username}}</span>
                        <!-- <b class="caret"></b> -->
                    </a>
                </li>
                
                <li class="dropdown" id="profile-messages">
                    <a title="" href="javascript:;" @click="modifyPassword('formForModifyPassword')" data-toggle="dropdown"
                       data-target="#profile-messages" class="dropdown-toggle">
                        <i class="icon icon-user"></i>
                        <span class="text">修改密码</span>
                        <!-- <b class="caret"></b> -->
                    </a>
                </li>
            </ul>
        </div>
        <div id="search">
            <li class=""><a title="" href="javascript:;" @click="loginOut"><i
                class="icon icon-share-alt"></i> <span class="text">退出</span></a></li>
        </div>

        <!--修改密码弹窗-->
        <div>
            <el-dialog title="修改密码" :visible.sync="dialogForModifyPassword" width="30"
                       center>
                <el-form :model="formForModifyPassword" ref="formForModifyPassword" :rules="rules">
                    <el-form-item label="旧密码" :label-width="formLabelWidth"
                                  prop="oldPassword">
                        <el-input size="small" v-model="formForModifyPassword.oldPassword"
                                  auto-complete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="新密码" :label-width="formLabelWidth"
                                  prop="newPassword">
                        <el-input size="small" v-model="formForModifyPassword.newPassword"
                                  auto-complete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="确认新密码" :label-width="formLabelWidth"
                                  prop="confirmNewPassword">
                        <el-input size="small" v-model="formForModifyPassword.confirmNewPassword"
                                  auto-complete="off"></el-input>
                    </el-form-item>
                </el-form>

                <div slot="footer" class="dialog-footer">
                    <el-button size="small" @click="resetRules('formForModifyPassword')">取 消
                    </el-button>
                    <el-button size="small" type="primary"
                               @click="confirmForModifyPassword('formForModifyPassword')">确 定
                    </el-button>
                </div>
            </el-dialog>
        </div>

        
    </div>
</template>
<script>
    export default {
        data() {
            var validatePassword = (rule, value, callback) => {
                if (value == '') {
                    callback(new Error('请输入旧密码'));
                } else {
                    callback();
                }
            };
            var validateNewPassword = (rule, value, callback) => {
                if (value == '') {
                    callback(new Error('请输入新密码'));
                } else {
                    if (this.formForModifyPassword.oldPassword != '') {
                        this.$refs.formForModifyPassword.validateField('confirmNewPassword');
                    }
                    callback();
                }
            };
            var validateConfirmNewPassword = (rule, value, callback) => {
                if (value == '') {
                    callback(new Error('请再次输入新密码'));
                } else if (value != this.formForModifyPassword.newPassword) {
                    callback(new Error('两次输入密码不一致!'));
                } else {
                     callback();
                }
            };
            return {
                /*密码校验规则*/
                rules: {
                    oldPassword: [
                        {validator: validatePassword, trigger: 'blur'}
                    ],
                    newPassword: [
                        {validator: validateNewPassword, trigger: 'blur'}
                    ],
                    confirmNewPassword: [
                        {validator: validateConfirmNewPassword, trigger: 'blur'}
                    ],

                },
                createcodeform:{
                    pathAndName:""
                },
                formForModifyPassword: {
                    oldPassword: "",
                    newPassword: "",
                    confirmNewPassword: ""
                },
                name: "",
                loginOutUrl: this.baseUrl+'bg/login/logout',
                modifyPasswordUrl: this.baseUrl+'bg/mywOperator/modifyPassword',          
                logoImgSrc: "../../../static/img/logo.png",
                dialogForModifyPassword: false,       
                formLabelWidth: '120px',
            }
        },
        computed: {
            username() {
                let username = localStorage.getItem('ms_username');
                return username;
            }
        },
        methods: {
            
            /*修改密码*/
            modifyPassword(formName) {
                this.dialogForModifyPassword = true;
                this.formForModifyPassword = {
                    oldPassword: "",
                    newPassword: "",
                    confirmNewPassword: ""
                }
            },
            /*关闭修改密码弹窗*/
            resetRules(formName) {
                this.resetForm(formName);
                this.dialogForModifyPassword = false;
            },
            /*提交密码修改*/
            confirmForModifyPassword(formName) {
                let _this = this;
                var params = new URLSearchParams();
                params.append("oldPassword", _this.formForModifyPassword.oldPassword);
                params.append("newPassword", _this.formForModifyPassword.newPassword);
                this.$refs[formName].validate((valid) => {
                    if (valid){
                        this.$axios.post(_this.modifyPasswordUrl, params).then(function (res) {
                            if (res.data.code == 1001) {
                                _this.$message({
                                                   message: "修改成功，请登录",
                                                   type: "success"
                                               });
                                _this.resetForm('formForModifyPassword');
                                _this.$router.push("/login")
                                _this.dialogForModifyPassword = false;
                            } else if (res.data.code == 1002) {
                                _this.$message({
                                                   message: "登录过期，请登录",
                                                   type: "warning"
                                               });
                                _this.resetForm('formForModifyPassword');
                                _this.$router.push("/login")
                                _this.dialogForModifyPassword = false;
                            } else if (res.data.code == 1003) {
                                _this.resetForm('formForModifyPassword');
                                _this.$message({
                                                   message: res.data.msg,
                                                   type: "warning"
                                               });
                            } else {
                                _this.$message({
                                                   message: "网络异常",
                                                   type: "error"
                                               });
                            }
                        })
                    }
                })

            },
            
            loginOut() {
                let _this = this;
                this.$axios.get(this.loginOutUrl, {})
                    .then(function (response) {
                        if (response.data.code == 1001) {

                            localStorage.removeItem('ms_username')
                            _this.$router.push('/login');
                        } else {
                            _this.$message({
                                               message: '退出失败',
                                               type: 'warning'
                                           });
                        }

                    })
                    .catch(function (error) {
                        console.log(error);
                    });
            },
            /*清空数据*/
            resetForm(formName) {
                this.$refs[formName].resetFields();
            }
        },

    }
</script>
<style scoped>
    .label, .badge {
        font-size: 11.844px;
        font-weight: bold;
        line-height: 14px;
        color: #fff;
        text-shadow: 0 -1px 0 rgba(0, 0, 0, 0.25);
        white-space: nowrap;
    }

    img {
        height: auto;
        max-width: 100%;
        vertical-align: middle;
        border: 0;
    }

    .navbar-inverse .nav li.dropdown > .dropdown-toggle .caret {
        border-top-color: #999;
        border-bottom-color: #999;
    }

    .navbar .nav .dropdown-toggle .caret {
        margin-top: 8px;
    }

    .navbar-inverse .brand, .navbar-inverse .nav > li > a {
        text-shadow: 0 -1px 0 rgba(0, 0, 0, 0.25);
    }

    .navbar .nav > li > a {
        float: none;
        padding: 10px 15px 10px;
        color: #777;
        text-decoration: none;
        /*text-shadow: 0 1px 0 #fff;*/
    }

    .caret {
        display: inline-block;
        width: 0;
        height: 0;
        vertical-align: top;
        border-top: 4px solid #000;
        border-right: 4px solid transparent;
        border-left: 4px solid transparent;
        content: "";
    }

    .headBox {
        width: 100%;
        height: 77px;
        position: relative;
    }
</style>
