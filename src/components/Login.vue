<template>
    <body id="poster">
    <el-form class="login-container" label-position="left"
             label-width="80px" ref="loginForm" :model="loginForm" :rules="rules">
        <h3 class="login_title">系统登录</h3>
        <el-form-item prop="username" label="账号">
            <el-input type="text" v-model="loginForm.username"
                      auto-complete="off" placeholder="用户名/邮箱/手机"></el-input>
        </el-form-item>
        <el-form-item prop="password" label="密码">
            <el-input type="password" v-model="loginForm.password"
                      auto-complete="off" placeholder="密码"></el-input>
        </el-form-item>
        <el-form-item style="width: 100%">
            <el-button type="primary" style="width: 100%;background: #505458;border: none" v-on:click="login">登录</el-button>
        </el-form-item>
        <div><router-link to="PhoneLogin">短信登陆</router-link></div>
        <div><router-link to="ForgetPwd">忘记密码</router-link></div>
        <div><router-link to="register">没有密码？注册</router-link></div>
    </el-form>
    </body>
</template>

<script>
    export default {
        name: "Login",
        data() {
            //验证邮箱
            var validateEmail = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('请正确填写邮箱'));
                } else {
                    if (value !== '') {
                        var reg=/^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/;
                        if(!reg.test(value)){
                            callback(new Error('请输入有效的邮箱'));
                        }
                    }
                    callback();
                }
            };
            return {
                loginForm: {
                    username: '',
                    password: '',
                    mailbox:''
                },

                rules: {
                    username: [{required: true, message: "请输入用户名", trigger: "blur"}],
                    password: [{required: true, message: "请输入密码", trigger: "blur"}],
                    mailbox:[{ required:true, validator: validateEmail, trigger: 'blur' }],
                    responseResult: []
                }
            }
        },

        methods: {
            login() {
                var _this = this
                console.log(this.$store.state)
                this.$axios
                    .get('/login', {
                        params: {
                            account: this.loginForm.username || this.loginForm.mailbox,
                            password: this.loginForm.password
                        }
                    })
                    .then(successResponse => {
                        if (successResponse.data.code === 200) {
                            // var data = this.loginForm
                            _this.$store.commit('login', _this.loginForm)
                            var path = this.$route.query.redirect
                            this.$router.replace({path: path === '/' || path === undefined ? '/index' : path})
                        }
                    })
                    .catch(failResponse => {
                        console.log(failResponse)
                    })
            }
        }
    }
</script>

//style scoped

<style>
    #poster {
        background:url("../assets/wall-4.jpg") no-repeat;
        background-position: center;
        height: 100%;
        width: 100%;
        background-size: cover;
        position: fixed;
    }
    body{
        margin: 0px;
    }
    .login-container {
        border-radius: 15px;
        background-clip: padding-box;
        margin:86px auto;
        width: 400px;
        padding: 50px 50px 50px 50px;
        background: #fff;
        border: 1px solid #eaeaea;
        box-shadow: 0 0 25px #cac6c6;
    }

    .login_title {
        margin: 0px auto 40px auto;
        text-align: center;
        color: #505458;
    }


</style>