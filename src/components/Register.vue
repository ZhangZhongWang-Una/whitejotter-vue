<template>
    <body id="poster">
    <div type="flex" justify="center">
        <el-form class="login-container" label-position="left"
                 label-width="80px" ref="registerForm" :model="formData" :rules="rules">
            <h3 class="login_title">注册账户</h3>
            <el-form-item prop="userName" label="用户名">
                <el-input v-model="formData.userName" placeholder="请输入用户名" prefix-icon="icon-login_user" clearable></el-input></el-form-item>
            <el-form-item prop="phone" label="手机">
                <el-col :span="19">
                    <el-input v-model="formData.phone" auto-complete="off" placeholder="请输入手机号" prefix-icon="icon-login_user" clearable></el-input></el-col>
                <el-col :span="2">
                    <el-button v-on:click="getCode" :disabled="isDisabled" >
                        <template v-if="flag">发送</template>
                        <template v-else>{{second}}秒后重发</template></el-button></el-col>
            </el-form-item>
            <el-form-item prop="verifyCode" label="验证码"><el-input v-model="formData.verifyCode" placeholder="请输入验证码" prefix-icon="icon-login_user" clearable></el-input></el-form-item>
            <el-form-item prop="mailbox" label="邮箱"><el-input v-model="formData.mailbox" placeholder="请输入邮箱" prefix-icon="icon-login_user" clearable></el-input></el-form-item>
            <el-form-item prop="password" label="密码"><el-input v-model="formData.password" placeholder="请输入密码" type="password" prefix-icon="icon-login_pwd" clearable></el-input></el-form-item>
            <el-form-item prop="checkPassword" label="确认密码"><el-input v-model="formData.checkPassword" placeholder="再次输入密码" type="password" prefix-icon="icon-login_pwd" clearable></el-input></el-form-item>
            <el-form-item style="width: 100%" label-width="0px">
                <el-button type="primary" style="width: 40%;background: #505458;border: none;margin-left: 0px" v-on:click="register('registerForm')">注册</el-button>
                <el-button type="primary" style="width: 40%;background: #505458;border: none" v-on:click="resetForm('registerForm')">重置</el-button></el-form-item>
            <router-link to="/login">已有密码？登录</router-link>
        </el-form>
    </div>
    </body>
</template>

<!-- el-form ref="formData" :model="formData" :rules="rules" label-width="80px" @keyup.enter.native="register()"-->

<script>
    export default {
        name:"Register",
        data() {
            // <!--验证手机号是否合法-->
            var checkPhone = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('请输入手机号码'))
                } else if (!this.checkPhone(value)) {
                    callback(new Error('请输入有效的手机号码'))
                } else {
                    callback()
                }
            }
            //  <!--验证码是否为空-->
            var checkVerifyCode = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('请输入手机验证码'))
                } else {
                    callback()
                }
            }
            //  <!--验证密码-->
            var validatePass = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('请再次输入密码'));
                } else if (value !== this.formData.password) {
                    callback(new Error('两次输入密码不一致!'));
                } else {
                    callback();
                }
            }
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
                formData: {
                    userName: '',
                    password: '',
                    checkPassword:'',
                    phone:'',
                    verifyCode:'',
                    mailbox:''
                },
                rules: {
                    userName: [{ required: true, message: '用户名不能为空', trigger: 'blur' }],
                    password: [{ required: true, message: '密码不能为空', trigger: 'blur' }],
                    checkPassword: [{ required: true, validator: validatePass, trigger: 'blur' }],
                    phone: [{ required:true, validator: checkPhone, trigger: 'blur' }],
                    verifyCode: [{ required:true, validator: checkVerifyCode, trigger: 'blur' }],
                    mailbox: [{ required:true, validator: validateEmail, trigger: 'blur' }],
                },
                buttonText: '发送',
                isDisabled: false, // 是否禁止点击发送验证码按钮
                flag: true,
                countTime: 60,// 验证码设置的有效时间
                second: 60,        //倒计时间
                code: '' // 验证码 用来记录服务器生成返回的验证码
            }
        },
        methods: {
            // 验证手机号
            checkPhone(str) {
                let re = /^1\d{10}$/
                if (re.test(str)) {
                    return true;
                } else {
                    return false;
                }
            },
            register(formName) {
                this.$refs[formName].validate(valid => {
                    if (valid) {
                        // this.flag 等于 false 代表已经发送了验证码 在60s倒计时内
                        // 如果输入的验证码等于服务器生成的验证码 且 60s内
                        if (this.code == this.formData.verifyCode && false == this.flag) {
                            // 向服务器发送请求
                            this.$axios
                                .post('/register', {
                                    username: this.formData.userName,
                                    phone: this.formData.phone,
                                    mailbox: this.formData.mailbox,
                                    password: this.formData.password
                                })
                                .then(successResponse => {
                                    if (successResponse.data.code === 200) {
                                        this.$message({
                                            type: 'success',
                                            message: '注册成功'
                                        });
                                        // 注册页面信息重置
                                        this.flag = true;
                                        this.isDisabled = false;
                                        this.second = this.countTime;
                                        this.$refs[formName].resetFields();
                                        this.$router.push({name: 'Login'});

                                    } else { //服务器返回不是200就是失败
                                        console.log(successResponse.data)
                                        this.$message({
                                            type: 'error',
                                            message: successResponse.data.message
                                        })
                                    }
                                })
                                .catch(failResponse => {
                                    console.log(failResponse)
                                })
                        } else { // 这个else 是验证验证码的
                            this.$message({
                                type: 'error',
                                message: '验证码超时或错误'
                            })
                        }
                    } else { // 这个else 是表单验证没通过的
                        console.log('error submit!!');
                        return false;
                    }
                });
            },
            resetForm(formName) {
                this.$refs[formName].resetFields();
            },
            getCode() {
                // this.flag原为true,请求成功，
                // !this.flag == false，主要是防止有人把isDisabled属性去掉，多次点击；
                if( !this.flag )
                    return;
                // 向服务器获取验证码
                this.$axios
                    .get('/verifyCode', {
                        params: {
                            phone: this.formData.phone,
                            count: '4'
                        }
                    })
                    .then(successResponse => {
                        if (successResponse.data.code === 200) {
                            console.log(successResponse.data);
                            this.code = successResponse.data.data;
                            this.flag = false;
                            this.isDisabled = true;
                            this.timeDown();
                        } else {
                            console.log(successResponse.data)
                            this.$message({
                                type: 'error',
                                message: successResponse.data.message
                            })
                        }
                    })
                    .catch(failResponse => {
                        console.log(failResponse)
                    })
            },
            timeDown()
            {
                let result = setInterval( ()=>{
                    --this.second;
                    if(this.second < 0)
                    {
                        clearInterval(result);
                        this.flag = true;
                        this.isDisabled = false;
                        this.second = this.countTime;
                    }
                }, 1000);
            }

        }
    };
</script>

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

    /*.code >>> .el-form-item__content {*/
    /*    display: flex;*/
    /*    align-items: center;*/
    /*    justify-content: space-between;*/
    /*}*/
    /*.code button {*/
    /*    margin-left: 0px;*/
    /*    width: 140px;*/
    /*    text-align: center;*/
    /*}*/



</style>