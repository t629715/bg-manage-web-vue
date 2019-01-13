<template>
    <div id="content">
        <div id="content-header">
            <div id="breadcrumb"><a href="javascript:;" class="tip-bottom"><i class="icon-home"></i>
                系统管理</a> <a href="javascript:;" class="current">菜单管理</a></div>
        </div>
        <div class="container-fluid">
            <!--查询条件-->
            <div>
                <el-form :inline="true"
                         label-width="100px">
                    <el-form-item>
                        <el-button size="small" type="primary" @click="addForm()">添加
                        </el-button>
                    </el-form-item>
                    <el-form-item>
                        <el-button size="small" type="danger" @click="loadData()">刷新
                        </el-button>
                    </el-form-item>
                </el-form>
            </div>

            <div>
                <el-table :data="tableData" border
                          :row-key="getRowKeys"    :expand-row-keys="expandsIds"   @current-change="toggleRowExpansion"  class="out-table"  >
                    <el-table-column type="expand">
                        <template slot-scope="props">
                                <el-table :data="props.row.subs"   :show-header="false"
                                          label-position="center" inline :class="props.$index%2==1? 'demo-table-expand-1':'demo-table-expand-2'" :border="false">
                                    <el-table-column label="" width="149"></el-table-column>
                                    <el-table-column type="expand">
                                        <template slot-scope="props">
                                            <el-table :data="props.row.subs"   :show-header="false" :class="props.$index%2==1? 'demo-table-expand-1':'demo-table-expand-2'"
                                                      label-position="center" inline  :border="false">
                                                <el-table-column label="" width="346"></el-table-column>
                                                <el-table-column type="index" label="序号" width="150"></el-table-column>
                                                <el-table-column prop="permissionName" label="菜单名" width="150"></el-table-column>
                                                <el-table-column prop="permissionPath" label="菜单路由" width="250"></el-table-column>
                                                <el-table-column label="操作" width="199">
                                                    <template slot-scope="scope">
                                                        <el-button size="small" type="primary" @click="editDialog(scope.row)">
                                                            编辑
                                                        </el-button>
                                                        <el-button size="small" type="danger" @click="deleteDialog(scope.row)">
                                                            删除
                                                        </el-button>
                                                    </template>
                                                </el-table-column>
                                            </el-table>
                                        </template>
                                    </el-table-column>
                                    <el-table-column type="index" label="序号" width="150"></el-table-column>
                                    <el-table-column prop="permissionName" label="二级菜单名" width="150"></el-table-column>
                                    <el-table-column prop="" label="三级菜单名" width="150"></el-table-column>
                                    <el-table-column prop="permissionPath" label="菜单路由" width="250"></el-table-column>
                                    <el-table-column label="操作" width="199">
                                        <template slot-scope="scope">
                                            <el-button size="small" type="primary" @click="editDialog(scope.row)">
                                                编辑
                                            </el-button>
                                            <el-button size="small" type="danger" @click="deleteDialog(scope.row)">
                                                删除
                                            </el-button>
                                        </template>
                                    </el-table-column>
                                </el-table>
                        </template>
                    </el-table-column>
                    <el-table-column type="index" label="序号" width="150"></el-table-column>
                    <el-table-column prop="permissionName" label="一级菜单名" width="150"></el-table-column>
                    <el-table-column prop="" label="二级菜单名" width="150"></el-table-column>
                    <el-table-column prop="" label="三级菜单名" width="150"></el-table-column>
                    <el-table-column prop="index" label="菜单路由" width="250"></el-table-column>
                    <el-table-column label="操作" width="200">
                        <template slot-scope="scope">
                            <el-button size="small" type="primary" @click="editDialog(scope.row)">
                                编辑
                            </el-button>
                            <el-button size="small" type="danger" @click="deleteDialog(scope.row)">
                                删除
                            </el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </div>

            <!--相关操作的弹窗-->

            <!--添加的弹窗 -->
            <div>
                <el-dialog title="添加" :visible.sync="dialogForAdd" width="30" center>
                    <el-form :model="formForAdd">
                        <el-form-item label="菜单级别" :label-width="formLabelWidth">
                            <el-select @change="selectType" size="small" v-model="formForAdd.type"
                                       placeholder="请选择">
                                <el-option v-for="item in typeList" :key="item.id"
                                           :value="item.id" :label="item.name"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="一级菜单" :label-width="formLabelWidth" v-if="firstShow || secondShow">
                            <el-select @change="selectSecondByFirst" size="small" v-model="formForAdd.firstPid"
                                       placeholder="请选择">
                                <el-option v-for="item in tableData" :key="item.id"
                                           :value="item.id" :label="item.permissionName"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="二级菜单" :label-width="formLabelWidth" v-if="secondShow">
                            <el-select size="small" v-model="formForAdd.secondPid"
                                       placeholder="请选择">
                                <el-option v-for="item in tableData1" :key="item.id"
                                           :value="item.id" :label="item.permissionName"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="菜单名" :label-width="formLabelWidth">
                            <el-input size="small" v-model="formForAdd.name"
                                      auto-complete="off"></el-input>
                        </el-form-item>
                        <el-form-item label="菜单路由" :label-width="formLabelWidth">
                            <el-input size="small" v-model="formForAdd.url"
                                      auto-complete="off"></el-input>
                        </el-form-item>
                    </el-form>
                    <div slot="footer" class="dialog-footer">
                        <el-button size="small" @click="dialogForAdd = false">取 消</el-button>
                        <el-button size="small" type="primary" @click="add">提 交
                        </el-button>
                    </div>
                </el-dialog>
            </div>
            <!--删除的弹窗 -->
            <div>
                <el-dialog title="删除" :visible.sync="dialogForDelete" width="30" center>
                    <span>确定要删除该信息吗？</span>
                    <div slot="footer" class="dialog-footer">
                        <el-button size="small" @click="dialogForDelete = false">取 消</el-button>
                        <el-button size="small" type="primary" @click="confirmForDelete">确 定
                        </el-button>
                    </div>
                </el-dialog>
            </div>
            <!--修改的弹窗 -->
            <div>
                <el-dialog title="修改菜单" :visible.sync="dialogForEditParent" width="30" center>
                    <el-form :model="formForModify">
                        <el-form-item label="菜单名" :label-width="formLabelWidth">
                            <el-input size="small" v-model="formForModify.name"
                                      auto-complete="off"></el-input>
                        </el-form-item>
                        <el-form-item label="菜单路由" :label-width="formLabelWidth">
                            <el-input size="small" v-model="formForModify.url"
                                      auto-complete="off"></el-input>
                        </el-form-item>
                    </el-form>
                    <div slot="footer" class="dialog-footer">
                        <el-button size="small" @click="dialogForEditParent = false">取 消</el-button>
                        <el-button size="small" type="primary" @click="modify">提 交
                        </el-button>
                    </div>
                </el-dialog>
            </div>

        </div>
    </div>
</template>

<script>
    export default {
        //model 初始数据
        data() {
            return {
                url: this.baseUrl+"permission/listAllPermission",
                addUrl: this.baseUrl+"permission/addPermission",
                modifyUrl: this.baseUrl+"permission/modifyPermission",
                deleteUrl: this.baseUrl+"permission/removePermission",
                tableData: [],
                tableData1: [],
                formLabelWidth: '120px',
                firstShow: false,
                secondShow: false,
                dialogForDelete: false,
                dialogForDelete: false,
                dialogForEditChild: false,
                dialogForAdd: false,
                dialogForCheckChild: false,
                dialogForEditParent: false,
                dialogForCheckParent: false,
                permissionId:"",
                formForAdd: {
                    name: "",
                    url: "",
                    type: "",
                    firstPid:"",
                    secondPid:"",
                },
                formForModify: {
                    id:  "",
                    name: "",
                    url: "",
                    type: "",
                    firstPid:"",
                    secondPid:"",
                },

                typeList: [
                    {
                        id: 1,
                        name: '一级菜单'
                    },
                    {
                        id: 2,
                        name: '二级菜单'
                    },
                    {
                        id: 3,
                        name: '三级菜单'
                    },
                ],
                expandsIds: [],
                expandsParentNames: [],
            }
        },
        //页面渲染加载方法
        created() {
            this.loadData();
        },
        //定义方法
        methods: {
            getRowKeys(row) {
                return row.id;
            },
            toggleRowExpansion(row){
                if(row == null ){
                    this.expandsIds = [];
                }else{
                    this.expandsIds = [];
                    this.expandsIds.push(row.id);
                }
            },
            // 选择菜单的级别并控制一级菜单输入框与二级菜单输入框是否显示
            selectType(value){
                if (value == 2){
                    this.firstShow = true;
                    this.secondShow = false;
                }else if(value == 3){
                    this.firstShow = true;
                    this.secondShow = true;
                }else if (value == 1){
                    this.firstShow = false;
                    this.secondShow = false;
                }
            },
            // 通过选择一级菜单获取二级菜单
            selectSecondByFirst(value){
                let obj = {};
                obj = this.tableData.find((item)=> {
                    return item.id == value;
                })
                this.tableData1 = obj.subs;
            },
            //刷新表格方法
            loadData() {
                var params = new URLSearchParams();
                let _this = this;
                this.$axios.post(this.url, params)
                    .then(function (response) {
                        if (response.data.code == 1001) {
                            _this.tableData = response.data.data.subs;
                        } else {
                            /*_this.$router.push("/login")*/
                        }
                    })
                    .catch(function (error) {
                    });
            },

            editDialog(row) {
                this.formForModify = {
                    name:row.permissionName,
                    url:row.permissionPath,
                    pid:row.pid
                }
                this.id = row.id;
                this.dialogForEditParent = true;
            },
            modify(){
                let _this = this;
                var params = new URLSearchParams();
                params.append('name', this.formForModify.name);
                params.append('url', this.formForModify.url);
                params.append("permissionId",this.id);
                this.$axios.post(this.modifyUrl, params)
                    .then(function (response) {
                        if (response.data.code == 1001) {
                            _this.dialogForEditChild = false;
                            _this.dialogForEditParent = false;
                            _this.loadData();
                            _this.$message({
                                message: response.data.msg,
                                type: 'success'
                            });

                        } else {
                            _this.$message({
                                message: response.data.msg,
                                type: 'warning'
                            });
                        }
                    })
                    .catch(function (error) {
                    });
            },
            addForm() {
                this.formForAdd = {
                    name: "",
                    url: "",
                    type: "",
                    firstPid:"",
                    secondPid:"",
                }
                this.dialogForAdd = true;
            },
            add(){
                let _this = this;
                var params = new URLSearchParams();
                params.append('name', this.formForAdd.name);
                params.append('url', this.formForAdd.url);
                if (this.formForAdd.type == 1){
                    params.append('parentId', 0);
                }else if (this.formForAdd.type ==2){
                    params.append('parentId', this.formForAdd.firstPid);
                }else if (this.formForAdd.type == 3){
                    params.append('parentId', this.formForAdd.secondPid);
                }
                params.append('icon', "el-icon-date");
                this.$axios.post(this.addUrl, params)
                    .then(function (response) {
                        if (response.data.code == 1001) {
                            _this.firstShow = false;
                            _this.secondShow = false;
                            _this.dialogForAdd = false;
                            _this.loadData();
                            _this.$message({
                                message: response.data.msg,
                                type: 'success'
                            });

                        } else {
                            _this.$message({
                                message: response.data.msg,
                                type: 'warning'
                            });
                        }
                    })
                    .catch(function (error) {
                    });
            },

            /*删除*/
            deleteDialog(row) {
                this.id = row.id,
                this.dialogForDelete = true;
            },

            confirmForDelete() {
                let _this = this;
                var params = new URLSearchParams();
                params.append("permissionId", _this.id);
                this.$axios.post(this.deleteUrl, params).then(function (res) {
                    if (res.data.code == 1001) {
                        _this.$message({
                            message: "删除成功",
                            type: "success"
                        });
                        _this.loadData();
                        _this.dialogForDelete = false;
                    } else {
                        _this.$message({
                            message: "操作失败",
                            type: "warning"
                        })
                    }
                })
                _this.dialogForDelete = false;
            },
        }
    }
</script>
<style>
    .el-table__body tr:nth-child(n) td{
        padding: 0 !important;
        border-spacing: 0px;
        /*padding-left: 47px;*/
    }
    .out-table tr:nth-child(2n){
        background-color: #EEF1F6;
    }
    .demo-table-expand-2 tr:nth-child(n){
        background-color: #EEF1F6;
    }
    .demo-table-expand-1 tr:nth-child(n){
        background-color: white;
    }
</style>
