<template>
    <body id="poster">
    <div type="flex" justify="center">
        <el-form class="login-container" label-position="left"
                 label-width="80px" ref="registerForm" :model="formData" :rules="rules">
            <h3 class="login_title">系统登录</h3>
            <el-form-item prop="phone" label="手机">
                <el-col :span="19">
                    <el-input v-model="formData.phone" auto-complete="off" placeholder="请输入手机号" prefix-icon="icon-login_user" clearable></el-input></el-col>
                <el-col :span="2">
                    <el-button v-on:click="getCode" :disabled="isDisabled" >
                        <template v-if="flag">发送</template>
                        <template v-else>{{second}}秒后重发</template></el-button></el-col>
            </el-form-item>
            <el-form-item prop="verifyCode" label="验证码"><el-input v-model="formData.verifyCode" placeholder="请输入验证码" prefix-icon="icon-login_user" clearable></el-input></el-form-item>
            <el-form-item style="width: 100%">
                <el-button type="primary" style="width: 100%;background: #505458;border: none" v-on:click="login">登录</el-button>
            </el-form-item>
            <div><router-link to="Login">密码登陆</router-link></div>
            <div><router-link to="ForgetPwd">忘记密码</router-link></div>
            <div><router-link to="register">没有密码？注册</router-link></div>
        </el-form>
    </div>
    </body>
</template>

<script>
    export default {
        name:"PhoneLogin",
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

            return {
                formData: {
                    phone:'',
                    verifyCode:'',
                },
                rules: {
                    phone: [{ required:true, validator: checkPhone, trigger: 'blur' }],
                    verifyCode: [{ required:true, validator: checkVerifyCode, trigger: 'blur' }],
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
           login() {
                // var _this = this
                console.log(this.$store.state)
                // this.$refs[formName].validate(valid => {
                //     if (valid) {
                        // this.flag 等于 false 代表已经发送了验证码 在60s倒计时内
                        // 如果输入的验证码等于服务器生成的验证码 且 60s内
                        if (this.code == this.formData.verifyCode && false == this.flag) {
                            // 向服务器发送请求
                            this.$axios
                                .get('/verifyCodeLogin', {
                                    params: {
                                        phone: this.formData.phone,
                                    }
                                })
                            .then(successResponse => {
                                 if (successResponse.data.code === 200) {
                                   // var data = this.formData
                                   // _this.$store.commit('verifyCode', _this.formData)
                                   var path = this.$route.query.redirect
                                   this.$router.replace({path: path === '/' || path === undefined ? '/index' : path})
                                 }
                                })
                                // } else { //服务器返回不是200就是失败
                                //     console.log(successResponse.data)
                                //     this.$message({
                                //         type: 'error',
                                //         message: successResponse.data.message
                                //     })
                                .catch(failResponse => {
                                    console.log(failResponse)
                                })
                        } else { // 这个else 是验证验证码的
                            this.$message({
                                type: 'error',
                                message: '验证码超时或错误'
                            })
                        }
                        // } else { // 这个else 是表单验证没通过的
                        //     console.log('error submit!!');
                        //     return false;
                        // }
                        //     });
                    },
            // resetForm(formName) {
            //     this.$refs[formName].resetFields();
            // },
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
                            count: 4
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

<style scoped>

</style>