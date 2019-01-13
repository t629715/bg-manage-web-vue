<template>
    <div id="content">
        <div id="content-header">
            <div id="breadcrumb"><a href="javascript:;" title="Go to Home" class="tip-bottom"><i
                class="icon-home"></i> 系统管理</a> <a href="javascript:;" class="current">角色管理</a>
            </div>
        </div>
        <div class="container-fluid">
            <!-- 表单 -->
            <div class="formBox">
                <el-form :inline="true" demo-form-inline ref="formForQuery" :model="formForQuery"
                         label-width="80px">
                    <el-form-item label="角色名" prop="roleName">
                        <el-input size="small" v-model="formForQuery.roleName"></el-input>
                    </el-form-item>
                    <el-form-item label="创建时间" prop="date1">
                        <el-col :span="10">
                            <el-date-picker size="small" v-model="formForQuery.startTime" type="datetime"
                                            placeholder="选择日期时间" align="right"></el-date-picker>
                        </el-col>

                    </el-form-item>
                    <el-form-item prop="date2">
                        <el-col :span="10">
                            <el-date-picker size="small" v-model="formForQuery.endTime" type="datetime"
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
                        <el-button size="small" type="success" @click="add">新增角色</el-button>
                    </el-form-item>
                </el-form>
            </div>
            <!-- 表格 -->
            <div class="tableBox">
                <el-table :data="tableData" fit border stripe>
                    <el-table-column type="index" label="序号" width="100"></el-table-column>
                    <el-table-column prop="name" label="角色名"></el-table-column>
                    <el-table-column prop="description" label="描述"></el-table-column>
                    <el-table-column prop="createTime" label="创建时间" width="180"></el-table-column>
                    <el-table-column label="操作" width="200">
                        <template slot-scope="scope">
                            <el-button size="small" type="primary"
                                       @click="handleEdit(scope.row)">编辑
                            </el-button>
                            <el-button size="small" type="danger"
                                       @click="deleteDialog( scope.row)">删除
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
                    :page-size="pageSize"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="totalNum">
                </el-pagination>
            </div>
            <!-- 编辑弹框 -->
            <el-dialog title="编辑用户" :visible.sync="dialogFormVisibleEdit" center width="30%">
                <el-form :model="formForModify">
                    <el-form-item label="角色名" :label-width="formLabelWidth">
                        <el-input size="small" v-model="formForModify.roleName"
                                  auto-complete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="菜单列表" :label-width="formLabelWidth">
                        <el-checkbox v-model="checkeAll1" @change="handleCheckAllChange1">全选
                        </el-checkbox>
                        <el-tree
                            :data="treeList"
                            show-checkbox
                            node-key="id"
                            ref="treeEdit"

                            highlight-current
                            :props="defaultProps">
                        </el-tree>
                    </el-form-item>
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
            <!-- 新增角色 -->
            <el-dialog title="新增角色" :visible.sync="dialogFormVisible " center width="30%">
                <el-form :model="formForAdd" ref="newform" :rules="rules">
                    <el-form-item label="角色名" :label-width="formLabelWidth" prop="roleName">
                        <el-input size="small" v-model="formForAdd.roleName"
                                  auto-complete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="菜单列表" :label-width="formLabelWidth">
                        <el-checkbox v-model="checkeAll" @change="handleCheckAllChange">全选
                        </el-checkbox>
                        <el-tree
                            :data="treeList"
                            show-checkbox
                            node-key="id"
                            ref="tree"
                            highlight-current
                            :props="defaultProps">
                        </el-tree>
                    </el-form-item>
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button size="small" @click="dialogFormVisible = false">取 消</el-button>
                    <el-button size="small" type="primary" @click="confirmAdd()">确 定
                    </el-button>
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
                loading: false,
                isViewList: [
                    {
                        id: 0,
                        name: '否'
                    },
                    {
                        id: 1,
                        name: '是'

                    },
                ],
                formForQuery: {
                    roleName: '',
                    startTime: '',
                    endTime: '',
                },
                formForAdd: {
                    roleName: '',
                    roleDes: '',
                    permissionId: ""
                },
                formForModify: {
                    roleName: '',
                    roleDes: '',
                    permissionId: "",
                    roleId: ""
                },
                checkeAll: false,
                checkeAll1: false,
                actorList: "",
                url: this.baseUrl + "role/listRole",
                listPermissionUrl: this.baseUrl + "permission/listAllPermission",
                listRolePermissionUrl: this.baseUrl + 'permission/listRolePermission',
                addUrl: this.baseUrl + "role/addRole",
                editUrl: this.baseUrl + "role/modifyRole",
                deleteUrl: this.baseUrl + "role/removeRole",
                currentPage: 1,
                pageSize: 10,
                totalNum: 0,
                tableData: [],
                dialogFormVisible: false,
                dialogFormVisibleEdit: false,
                dialogFormVisibleDelete: false,
                row: "",
                formLabelWidth: '120px',
                userId: "",
                treeList: [],
                defaultProps: {
                    children: 'subs',
                    label: 'permissionName'
                },
                rules: {
                    roleName: [
                        {required: true, message: '请输入角色名', trigger: 'blur'}
                    ],
                },

            }
        },
        //页面渲染加载方法
        created() {
            this.loadData(10, 1);
            this.getAllPermission();

        },
        //定义方法
        methods: {

            //查询方法
            onSubmit() {
                var params = new URLSearchParams();
                let _this = this;
                params.append('pageSize', _this.pageSize.toFixed(0));
                params.append('pageNum', _this.currentPage);
                params.append('roleName', this.formForQuery.roleName);
                if (this.formForQuery.startTime) {
                    params.append('startTime', datetime1);
                }
                if (this.formForQuery.endTime) {
                    params.append('endTime', datetime2);
                }
                this.$axios.post(this.url, params)
                    .then(function (response) {
                        if (response.data.code == 1001) {
                            _this.$message({
                                message: '查询成功',
                                type: 'success'
                            });
                            _this.totalNum = response.data.total;
                            var list = response.data.data.list;
                            _this.tableData = list;
                        }
                        _this.totalNum = response.data.total;
                    })
                    .catch(function (error) {
                    });

            },
            //刷新表格方法
            loadData(pageSize, pageNum) {
                var params = new URLSearchParams();
                var datetime1 = '', datetime2 = ""
                params.append('pageSize', pageSize);
                params.append('pageNum', pageNum);
                params.append('roleName', this.formForQuery.roleName);
                params.append('startTime', datetime1);
                params.append('endTime', datetime2);
                let _this = this;
                this.$axios.post(this.url, params)
                    .then(function (response) {
                        if (response.data.code == 1001) {
                            _this.$message({
                                message: '查询成功',
                                type: 'success'
                            });
                            _this.totalNum = response.data.total;
                            var list = response.data.data.list;
                            _this.tableData = list;
                        }
                        _this.totalNum = response.data.total;
                    })
                    .catch(function (error) {
                    });
            },

            getAllPermission(){
                let _this = this;
                this.$axios.post(this.listPermissionUrl)
               .then(function (response) {
                   if (response.data.code == 1001){
                       _this.treeList = response.data.data.subs;
                   }
               })
               .catch(function (error) {
                   console.log(error);
               });
            },
            //清空表单
            resetForm() {
                this.$refs.formForAdd.resetFields();
                this.loadData(10, 1);
            },
            convertIsView(value) {
                if (typeof value == "number") {
                    return value;
                }
                let obj = {};
                obj = this.isViewList.find((item) => {
                    return item.name == value;
                })
                if (obj == undefined) {
                    return "";
                }
                return obj.id;
            },
            //  添加用户按钮
            add() {
                this.formForAdd = {
                    roleName: '',
                    roleDes: "",
                    permissionId: ""
                }
                this.checkeAll = false;
                let _this = this;
                this.dialogFormVisible = true;
                if (_this.$refs.tree) {
                    _this.$refs.tree.setCheckedNodes([]);
                }

            },
            handleCheckAllChange(event) {
                let _this = this;
                console.log(_this.treeList)
                if (event.target.checked) {
                    this.$refs.tree.setCheckedNodes(_this.treeList);
                } else {
                    this.$refs.tree.setCheckedNodes([]);
                }
            },
            handleCheckAllChange1(event) {
                let _this = this;
                console.log(_this.treeList)
                if (event.target.checked) {
                    this.$refs.treeEdit.setCheckedNodes(_this.treeList);
                } else {
                    this.$refs.treeEdit.setCheckedNodes([]);
                }
            },
            //  确定添加用户
            confirmAdd() {
                console.log(this.$refs.tree.getCheckedKeys())
                var params = new URLSearchParams();
                params.append('roleName', this.formForAdd.roleName);
                params.append('roleDes', this.formForAdd.roleDes);
                params.append('permissionId', this.$refs.tree.getCheckedKeys(true));
                let _this = this;
                this.$axios.post(this.addUrl, params)
                    .then(function (response) {
                        if (response.data.msg == 1) {
                            _this.loadData(10, 1);
                            _this.$message({
                                message: '添加成功',
                                type: 'success'
                            });
                            _this.dialogFormVisible = false;
                        } else {
                            _this.$message({
                                message: '添加失败',
                                type: 'warning'
                            });
                            _this.dialogFormVisible = false;
                        }

                    })
                    .catch(function (error) {
                        _this.dialogFormVisible = false;
                        console.log(error);
                    });

            },
            deleteDialog(row) {
                this.dialogFormVisibleDelete = true;
                this.row = row;
            },
            //  编辑按钮
            handleEdit( row) {
                this.formForModify = {
                    roleName: row.name,
                }
                this.dialogFormVisibleEdit = true;
                var params = new URLSearchParams();
                params.append('roleId', row.id);
                let _this = this;
                this.$axios.post(this.listRolePermissionUrl, params)
                    .then(function (response) {
                        _this.$refs.treeEdit.setCheckedKeys(response.data.pids);
                        var listLength = 0;
                        for (var i = 0; i < _this.treeList.length; i++) {
                            listLength++;
                            if (_this.treeList[i].subs.length > 0) {
                                for (var j = 0; j < _this.treeList[i].subs.length; j++) {
                                    listLength++;
                                    if (_this.treeList[i].subs[j].subs.length > 0) {
                                        for (var k = 0;
                                             k < _this.treeList[i].sub[j].subs.length; k++) {
                                            listLength++;
                                        }
                                    }
                                }
                            }
                        }
                        if (listLength == response.data.pids.length) {
                            _this.checkeAll1 = true;
                        } else {
                            _this.checkeAll1 = false;
                        }

                    })
                    .catch(function (error) {
                        _this.dialogFormVisibleEdit = false;
                        _this.$message.error('网络错误');
                    });
                console.log(_this.$refs)
                //存储 用户角色id

            },
            //  确定编辑方法
            confirmAddEdit() {
                var params = new URLSearchParams();
                params.append('pids', this.$refs.treeEdit.getCheckedKeys());
                console.log(this.$refs.treeEdit.getCheckedKeys(true));
                params.append('roleName', this.formForModify.roleName);
                params.append('roleDes', this.formForModify.roleDes);
                params.append('id', this.userId);
                let _this = this;
                axios.post(this.editUrl, params)
                    .then(function (response) {
                        if (response.data.msg == 1) {
                            _this.$message({
                                message: '修改成功',
                                type: 'success'
                            });
                            _this.dialogFormVisibleEdit = false;
                            _this.loadData(_this.pagesize, 1);
                        } else if (response.data.msg == 0) {
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
                        _this.dialogFormVisibleEdit = false;
                        _this.$message.error('网络错误');
                    });
            },
            //删除
            handleDelete() {
                let _this = this;
                var params = new URLSearchParams();
                params.append('roleId', _this.row.roleId);
                this.$axios.post(this.deleteUrl, params)
                    .then(function (response) {
                        if (response.data.code == 1001) {
                            _this.$message({
                                message: '删除成功',
                                type: 'success'
                            });
                            _this.dialogFormVisibleDelete = false;
                            _this.loadData(_this.pageSize, 1);
                        } else if (response.data.code == 1002) {
                            _this.$message({
                                message: '删除失败',
                                type: 'warning'
                            });
                            _this.dialogFormVisibleDelete = false;
                        } else {

                        }
                    })
                    .catch(function (error) {
                    });
            },

            //当前页改变是执行
            handleCurrentChange(val) {
                this.currentPage = val;
                this.loadData(this.pageSize, val);
            },
            //页数size 改变时执行
            handleSizeChange(val) {
                this.pageSize = val;
                this.loadData(val, 1);

            }
        }
    }
</script>
<style scoped>
    /*.checkArea{
      margin: 10px;
      overflow: hidden;
    }
    .checkAreaLeft{
      float: left;
      width:20%;
    }
    .checkAreaRight{
      float: right;
      width: 80%;
    }*/
</style>
