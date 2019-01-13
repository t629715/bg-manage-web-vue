<template>
    <div class="">
        <div id="loginbox">
            <el-form id="loginform" class="form-vertical" :model="ruleForm" :rules="rules"
                     ref="ruleForm">
                <div class="control-group normal_text">
                    <h3>
                        <!--<img class="mr25" src="../../../static/img/logo.png" alt="Logo"/>-->
                        <img src="../../../static/img/Admin.png" alt="Logo"/>
                    </h3>
                </div>
                <el-form-item prop="username">
                    <div class="controls">
                        <div class="main_input_box">
                            <span class="add-on bg_lg"><i class="icon-user"></i></span>
                            <input type="text" placeholder="请输入用户名" v-model="ruleForm.username"/>
                        </div>
                    </div>
                </el-form-item>
                <el-form-item prop="password">
                    <div class="controls">
                        <div class="main_input_box">
                            <span class="add-on bg_ly"><i class="icon-lock"></i></span>
                            <input type="password" placeholder="请输入密码" v-model="ruleForm.password"/>
                        </div>
                    </div>
                </el-form-item>
                <el-form-item prop="">
                    <div class="controls">
                        <div class="main_input_box">
                            <input type="text" class="yzmipt" placeholder="请输入验证码"
                                   v-model="ruleForm.code"/>
                            <img class="yzm" :src=pathAndName alt="yzm"
                                 @click="validateCode()"/>
                        </div>
                    </div>
                </el-form-item>
                <el-form-item>
                    <div class="form-actions">
                      <span class="center"><a @click="submitForm('ruleForm')"
                                              class=" btn btn-success" id="to-login">登录</a>
                      </span>
                    </div>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>

<script>
    export default {
        data: function () {
            return {

                pathAndName: '',

                ruleForm: {
                    username: '',
                    password: ''
                },
                rules: {
                    username: [
                        {required: true, message: '请输入用户名', trigger: 'blur'}
                    ],
                    password: [
                        {required: true, message: '请输入密码', trigger: 'blur'}
                    ]
                }
                ,
                questOk: false,
                code: "",
                codeKey: "",
            }
        },

        created() {
            let _this = this;
            document.onkeydown = function (event) {
                var e = event || window.event || arguments.callee.caller.arguments[0];
                if (e && e.keyCode == 13) {
                    _this.submitForm('ruleForm');
                }
            };
            this.validateCode();
        },
        methods: {
            validateCode() {
                this.codeKey = Math.random();
                var yzmUrl = this.baseUrl + "login/pictureCode?codeKey=" + this.codeKey + "&hh=" + Math.random();
                this.pathAndName = yzmUrl
            },
            submitForm(formName) {
                const self = this;
                // 登录接口
                var url = this.baseUrl + 'login/login';
                var userName = self.$refs[formName].model.username;
                var password = self.$refs[formName].model.password;
                var validateCode = self.$refs[formName].model.code;
                var params = new URLSearchParams();
                params.append("userName",userName);
                params.append("password",password);
                params.append("validateCode",validateCode);
                this.$post(url, params)
                    .then(function (response) {
                        if (response.data.code == 1001) {
                            localStorage.setItem('ms_username', self.ruleForm.username);
                            self.$router.push('/index');
                        } else if (response.data.code == 1002) {
                            self.$message.error(response.data.msg);
                        }
                    })
                    .catch(function (error) {
                        console.log(error);
                    });
            }
        }
    }
</script>

<style scoped>
    @import "../../../static/css/matrix-login.css";

    .add-on {
        line-height: 16px !important;
    }

    .mr25 {
        margin-right: 25px;
    }

    .yzmipt {
        text-align: center;
        width: 50% !important;
        margin-right: 45px;
        height: 41px;
    }

    .yzm {
        vertical-align: middle;
        height: 38px;
        width: 25%;
    }

    .center {
        margin: 0 auto;
        display: block;
        width: 80%;
        text-align: center;
    }

    .btn {
        display: inline-block;
        padding: 6px 0;
        margin-bottom: 0;
        width: 100%;
        font-size: 14px;
        line-height: 20px;
        vertical-align: middle;
        cursor: pointer;
        text-align: center;
        border-radius: 4px;
    }

    .btn-info {
        color: #fff;
        text-shadow: 0 -1px 0 rgba(0, 0, 0, 0.25);
        background-color: #49afcd;
        border-color: rgba(0, 0, 0, 0.1) rgba(0, 0, 0, 0.1) rgba(0, 0, 0, 0.25);
        background-repeat: repeat-x;
        text-decoration: none;
    }

    .btn-success {
        color: #fff;
        text-shadow: 0 -1px 0 rgba(0, 0, 0, 0.25);
        background-color: #5bb75b;
        background-repeat: repeat-x;
        border-color: rgba(0, 0, 0, 0.1) rgba(0, 0, 0, 0.1) rgba(0, 0, 0, 0.25);
    }

    .btn:hover, .btn:focus {
        color: #333;
        text-decoration: none;
        background-position: 0 -15px;
        -webkit-transition: background-position .1s linear;
        -moz-transition: background-position .1s linear;
        -o-transition: background-position .1s linear;
        transition: background-position .1s linear;
    }

    .btn:hover, .btn:focus, .btn:active, .btn.active, .btn.disabled, .btn[disabled] {
        color: #333;
        background-color: #e6e6e6;
    }

    .btn-info:hover, .btn-info:focus, .btn-info:active, .btn-info.active, .btn-info.disabled, .btn-info[disabled] {
        color: #fff;
        background-color: #2f96b4;
    }

    .btn-success:hover, .btn-success:focus, .btn-success:active, .btn-success.active, .btn-success.disabled, .btn-success[disabled] {
        color: #fff;
        background-color: #51a351;
    }
</style>
