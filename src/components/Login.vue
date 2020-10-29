<template>
    <div class="login_container">
        <div class="login_main">
            <h1>河北化工医药电商管理系统</h1>
            <div class="login_box">
                <h2>用户登录</h2>
                <!--登录表单区-->
                <el-form class="login_form" :model="loginForm" :rules="loginRules" ref="loginRef">
                    <!--用户名-->
                    <el-form-item prop="username">
                        <el-input v-model="loginForm.username">
                            <i slot="prefix" class="iconfont icon-user"></i>
                        </el-input>
                    </el-form-item>
                    <!--密码-->
                    <el-form-item prop="password">
                        <el-input v-model="loginForm.password" type="password">
                            <i slot="prefix" class="iconfont icon-3702mima"></i>
                        </el-input>
                    </el-form-item>
                    <!--按钮-->
                    <el-form-item class="btns" style="text-align: center;">
                        <el-button type="primary" @click="login">登录</el-button>
                        <el-button type="info" @click="resetLoinForm">重置</el-button>
                    </el-form-item>
                </el-form>
            </div>
            <div class="login_btm">
                <p class="technology">技术支持 河北化工医药职业技术学院</p>
                <p class="copyright">Copyright &copy; 2018-2020  冀 IPC证 01029号</p>
            </div>
        </div>

    </div>
</template>

<script>
    export default {
        name: "Login",
        data() {
            return {
                loginForm:{
                    username:'',
                    password:'',
                },
                loginRules:{
                    username: [
                        { required: true, message: '请输入用户名', trigger: 'blur' },
                        { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
                    ],
                    password:[
                        { required: true, message: '请输入密码', trigger: 'blur' },
                        { min: 6, max: 15, message: '长度在 6 到 15 个字符', trigger: 'blur' }
                    ]
                }
            }
        },
        methods:{
            resetLoinForm() {
                this.$refs.loginRef.resetFields();
            },
            login() {
                this.$refs.loginRef.validate( async valid => {
                    if(!valid) return;
                    const { data:res } = await this.$http.post('login',this.loginForm);
                    console.log(res);
                    if(res.meta.status !== 200) return  this.$message.error("登录失败")
                    this.$message.success("登录成功");
                    window.sessionStorage.setItem("token",res.data.token);
                    this.$router.push('/home');
                })
            }
        }
    }
</script>

<style scoped lang="less">
    .login_container .login_main h1 {
        font-size: 26px;
        color: #2c83ea;
        font-weight:bold;
        margin: 0;
        box-sizing: border-box;
        padding: 20px 110px;
    }
    .login_main {
        background: url("../assets/login-bg.png") no-repeat;
        background-size: 100% 100%;
        /*background-color: blue;*/
        height: 720px;
        width: 100%;
        .login_btm {
            position: absolute;
            bottom: 30px;
            width: 100%;
            margin-top: 16px;
            font-size: 16px;
            .technology {
                display: inline-block;
                margin-left: 50px;
            }
            .copyright {
                display: inline-block;
                float: right;
                margin-right: 50px;
            }
        }
    }
    .login_box {
        width: 426px;
        height: 300px;
        background-color: #fff;
        border-radius:3px;
        position: absolute;
        right: 0;
        top: 50%;
        transform: translate(-50%,-50%);
        h2 {
            margin: 50px 0;
            text-align: center;
        }
        .avatar_box {
            height: 130px;
            width: 130px;
            background-color: #fff;
            border: 1px solid #eee;
            border-radius: 50%;
            padding: 10px;
            box-shadow: 0 0 10px #ddd;
            position: absolute;
            left: 50%;
            transform: translate(-50%,-50%);
            img {
                width: 100%;
                height: 100%;
                border-radius: 50%;
                background-color: #eee;
            }
        }
    }
    .login_form {
        position: absolute;
        bottom: 0;
        width: 100%;
        padding: 0 20px;
        box-sizing: border-box;
    }
    .btns {

        text-align: center;
    }

</style>