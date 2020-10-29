<template>
    <div>
        <el-container class="home-container">
            <!--头部主体区域-->
            <el-header>
               <div>
                   <span>河北化工医药电商管理系统</span>
               </div>
                <el-button type="" @click="logout" class="logout">退出</el-button>
            </el-header>
            <!--页面主体区域-->
            <el-container>
                <!--侧边栏-->
                <el-aside :width="isCollaspe ? '64px' : '200px'">
                    <div class="toggle-button" @click="toggleBtn">|||</div>
                    <!--侧边菜单-->
                    <el-menu
                             :unique-opened="true"
                             text-color="#2c83ea"
                             active-text-color="#409EFF"
                             :collapse="isCollaspe"
                             :collapse-transition="false"
                             router
                             :default-active="activePath"
                    >
                        <!--一级菜单-->
                        <el-submenu :index="item.id + ''"v-for="item in menuList" :key="item.id">
                            <!--一级菜单模板区域-->
                            <template slot="title">
                                <!--图标-->
                                <i :class="iconsObj[item.id]"></i>
                                <!--文本-->
                                <span>{{item.authName}}</span>
                            </template>
                            <!--二级菜单-->
                            <el-menu-item :index="'/'+ item.path + ''"
                                          v-for="subItem in item.children"
                                          :key="subItem.id"
                                          @click="saveNavState('/'+ item.path)"
                            >
                                <template slot="title">
                                    <!--图标-->
                                    <i class="el-icon-menu"></i>
                                    <!--文本-->
                                    <span>{{subItem.authName}}</span>
                                </template>
                            </el-menu-item>
                        </el-submenu>
                    </el-menu>
                </el-aside>
                <el-main>
                    <router-view></router-view>
                </el-main>
            </el-container>
        </el-container>
    </div>
</template>

<script>
    export default {
        name: "Home",
        data() {
            return {
                menuList:[],
                iconsObj:{
                    '125':'iconfont icon-users',
                    '103':'iconfont icon-lock_fill ',
                    '101':'iconfont icon-shangpin',
                    '102':'iconfont icon-danju',
                    '145':'iconfont icon-baobiao',
                },
                isCollaspe:false,
                activePath:'',
            }
        },
        methods:{
            logout() {
                window.sessionStorage.clear();
                this.$router.push('/login')
            },
           async getMenuList() {
                const {data:res} = await this.$http.get('menus');
               // console.log(res);
               if(res.meta.status !== 200) return this.$message.error(res.meta.ms)
               this.menuList = res.data;
           },
            toggleBtn() {
                this.isCollaspe = !this.isCollaspe;
            },
            saveNavState(activePath){
                window.sessionStorage.setItem('activePath',activePath);
                this.activePath = activePath;
            }
        },
        created() {
            this.getMenuList();
            this.activePath = window.sessionStorage.getItem('activePath')
        }
    }
</script>

<style scoped lang="less">
    .home-container {
        width:100%;
        height: 100%;
        /*background: yellow;*/
        position: absolute;
    }
    .el-header {
        background: url("../assets/layout_bg.png") no-repeat 100% 62%;
        /*background-color: #373d41;*/
        display: flex;
        justify-content: space-between;
        padding-left: 0;
        align-items: center;
        color: #fff;
        font-size: 20px;
        .logout {
            width: 80px;
            height: 30px;
            border: 1px solid #fff;
            background-color: rgba(36,114,206,0.2);
            line-height: 30px;
            padding: 0;
            font-size: 14px;
            color: #fff;
        }
        >div {
            display: flex;
            align-items: center;
            span {
                margin-left: 15px;
            }
        }
    }
    .el-aside {
        background:url("../assets/nav_left_bg.png") no-repeat 100% 60%;
        .el-menu {
            border-right: none;
        }
    }
    .el-main {
        background-color: #eaedf1;
    }
    .iconfont {
        margin-right: 10px;
        vertical-align:middle;
        /*vertical-align: center;*/
    }
    .toggle-button {
        /*background-color: #4A5064;*/
        font-size: 10px;
        line-height: 24px;
        color: #2c83ea;
        text-align: center;
        letter-spacing: 0.2rem;
        cursor:pointer;
    }
</style>