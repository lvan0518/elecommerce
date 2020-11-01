<template>
    <div>
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>权限管理</el-breadcrumb-item>
            <el-breadcrumb-item>角色列表</el-breadcrumb-item>
        </el-breadcrumb>
        <el-card>
            <el-row>
                <el-col>
                    <el-button type="primary" @click="addRoleDialog = true">添加角色</el-button>
                </el-col>
            </el-row>
            <el-table :data="rolesList" border stripe="">
                <el-table-column type="expand">
                    <temlate slot-scope="scope">
                        <el-row  :class="['bdbottom' , i1 === 0 ? 'bdtop':' ','vcenter']" v-for="(item1,i1) in scope.row.children" :key="item1.id">
                            <el-col :span="5">
                                <el-tag closable @close="removeRightById(scope.row,item1.id)">{{item1.authName}}</el-tag>
                                <i class="el-icon-caret-right"></i>
                            </el-col>
                            <el-col :span="19">
                                <el-row   :class="[ i2 === 0 ? ' ': 'bdtop' , 'vcenter']" v-for="(item2, i2) in item1.children" :key="item2.id">
                                    <el-col :span="6">
                                        <el-tag type="success" closable @close="removeRightById(scope.row,item2.id)" >{{item2.authName}}</el-tag>
                                        <i class="el-icon-caret-right"></i>
                                    </el-col>
                                    <el-col :span="18">
                                        <el-tag closable @close="removeRightById(scope.row,item3.id)" v-for="(item3,i3) in item2.children" :key="item3.id" type="warning">{{item3.authName}}</el-tag>
                                    </el-col>
                                </el-row>
                            </el-col>
                        </el-row>
                    </temlate>
                </el-table-column>
                <el-table-column type="index"></el-table-column>
                <el-table-column label="角色名称" prop="roleName"></el-table-column>
                <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
                <el-table-column label="操作">
                    <template slot-scope="scope">
                        <el-button icon="el-icon-edit" type="primary" size="mini" @click="showEditDialog(scope.row.id)">编辑</el-button>
                        <el-button icon="el-icon-delete" type="danger" size="mini"  @click="deleteUser(scope.row.id)">删除</el-button>
                        <el-button icon="el-icon-setting" type="warning" size="mini" @click="showSetRightsDialog(scope.row)">分配权限</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </el-card>
        <!--添加角色-->
        <el-dialog
                title="添加角色"
                :visible.sync="addRoleDialog"
                width="50%"
                @close="addDialogClose"
        >
            <!--内容主体区域-->
            <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="120px">
                <el-form-item label="角色名称：" prop="roleName">
                    <el-input v-model="addForm.roleName"></el-input>
                </el-form-item>
                <el-form-item label="角色描述：" prop="roleDesc">
                    <el-input v-model="addForm.roleDesc"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
    <el-button @click="addUserDialog = false">取 消</el-button>
    <el-button type="primary" @click="addRole">确 定</el-button>
  </span>
        </el-dialog>
        <!--编辑角色-->
        <el-dialog
                title="修改用户"
                :visible.sync="editDialogVisible"
                width="50%"
                @close="editDialogClosed"
        >
            <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="120px" class="demo-ruleForm">
                <el-form-item label="角色名称：" prop="roleName">
                    <el-input v-model="editForm.roleName"></el-input>
                </el-form-item>
                <el-form-item label="角色描述：" prop="roleDesc">
                    <el-input v-model="editForm.roleDesc"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
    <el-button @click="editDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="editRoleInfo">确 定</el-button>
  </span>
        </el-dialog>
        <!--分配角色-->
        <el-dialog
                title="分配权限"
                :visible.sync="setRightsDialogVisible"
                width="50%"
                @close="defArrClean"
                >
            <el-tree
                    :props="defaultProps"
                    :data="rightsList"
                    show-checkbox
                    node-key="id"
                    default-expand-all
                    :default-checked-keys="defaultArr"
                    ref="treeRef"
                    >
            </el-tree>
            <span slot="footer" class="dialog-footer">
    <el-button @click="setRightsDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="allowRights">确 定</el-button>
  </span>
        </el-dialog>
    </div>
</template>

<script>
    export default {
        name: "roles",
        data() {
            return {
                rightId:"",
                setRightsDialogVisible:false,
                rolesList:[],
                rightsList:[],
                defaultProps:{
                    label:"authName",
                    children:"children"
                },
                addRoleDialog:false,
                addForm:{},
                addFormRules: {
                    roleName:[
                        {required: true, message: "请输入用户名", trigger: 'blur'},
                        {min: 2, max: 10, message: "用户名长度在3~10个字符之间", trigger: 'blur'}
                    ]
                },
                editDialogVisible:false,
                editForm:{},
                editFormRules:{
                    roleName:[
                        {required: true, message: "请输入用户名", trigger: 'blur'},
                        {min: 2, max: 10, message: "用户名长度在3~10个字符之间", trigger: 'blur'}
                    ]
                },
                defaultArr:[105,116]
            }
        },
        methods:{
            async getRolesList() {
                const {data:res} = await this.$http.get('roles')
                if(res.meta.status !== 200) {
                    this.$message.error("获取用户列表失败")
                }
                this.rolesList = res.data;
                console.log(this.rolesList);

            },
            async removeRightById(role,rightId) {
              const comfirmResult =   await this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).catch(err => err)
                if(comfirmResult !== 'confirm') {
                    return this.$message.info('已取消了删除！')
                }
                const {data:res} = await this.$http.delete(`roles/${role.id}/rights/${rightId}`)
                if(res.meta.status !== 200) {
                    this.$message.err("删除权限失败");
                }
                role.children = res.data;
            },
            addRole() {
                this.$refs.addFormRef.validate(async valid => {
                    if(!valid) return
                    const {data:res} = await this.$http.post("roles",this.addForm);
                    if(res.meta.status !== 200) {
                        this.$message.error("添加角色失败")
                    }
                    this.$message.success("添加角色成功");
                    this.addRoleDialog = false;
                    this.getRolesList();
                })
            },
            addDialogClose() {
                this.$refs.addFormRef.resetFields();
            },
             async showEditDialog(id) {
                const {data:res} = await this.$http.get("roles/" + id);
                if(res.meta.status !== 200) {
                    this.$message.error("查询角色信息失败");
                } else {
                    this.editForm = res.data
                    console.log(this.editForm);
                }
                this.editDialogVisible = ! this.editDialogVisible;
            },
            editDialogClosed() {
                this.$refs.editFormRef.resetFields();
            },
            editRoleInfo() {
                this.$refs.editFormRef.validate(async valid => {
                    if(!valid) return
                    const {data:res} = await this.$http.put("roles/" + this.editForm.roleId,{
                        roleName:this.editForm.roleName,
                        roleDesc:this.editForm.roleDesc
                    })
                    if(res.meta.status !== 200) {
                        this.$message.error("更新角色列表失败")
                    } else {
                        this.editDialogVisible = false;
                        this.getRolesList();
                        this.$message.success("更新角色列表成功");
                    }

                })
            },
            async deleteUser(id) {
                const confirmResult = await  this.$confirm(
                    '此操作将永久删除该用户, 是否继续?',
                    '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).catch(err => err)
                if(confirmResult !== 'confirm') {
                    return this.$message.info("已取消了删除");
                }
                const {data:res} =  await this.$http.delete("roles/"+id)
                if(res.meta.status !== 200) {
                    return  this.$message.error("删除失败")
                }
                this.$message.success("删除成功")
                this.getRolesList();
            },
            async showSetRightsDialog(role) {
                this.rightId = role.id;
                const{data:res} = await this.$http.get("rights/tree");
                if(res.meta.status !== 200) {
                    return this.$message.error("获取权限数据失败")
                }
                this.rightsList = res.data
                this.getLeafKeys(role,this.defaultArr)
                this.setRightsDialogVisible = true;
            },
            getLeafKeys(node,arr) {
                if(!node.children) {
                    return arr.push(node.id)
                }
                node.children.forEach(item => {
                    this.getLeafKeys(item,arr);
                })
            },
            defArrClean() {
                this.defaultArr = []
            },
             async  allowRights() {
                const keys = [
                    ...this.$refs.treeRef.getCheckedKeys(),
                    ...this.$refs.treeRef.getHalfCheckedKeys(),
                ];
                const idStr = keys.join(',');
                const {data:res} = await this.$http.post(`roles/${this.rightId}/rights`,{rids:idStr})
                 if(res.meta.status !== 200) {
                     this.$message.error("分配权限失败")
                 }
                 this.$message.success("分配权限成功")
                 this.getRolesList();
                 this.setRightsDialogVisible = false;
            }
        },
        created() {
            this.getRolesList()
        }
    }
</script>

<style scoped>
    .bdtop {
        border-top:1px solid #eee;
    }
    .bdbottom {
        border-bottom: 1px solid #eee;
    }
    .el-tag {
        margin: 7px;
    }
    .vcenter {
        display: flex;
        align-items: center;
    }
</style>