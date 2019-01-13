<template>
  <!-- default-active  当前激活菜单的 index -->
  <!-- default-openeds  当前打开的submenu的 key 数组 -->
  <!-- unique-opened    是否只保持一个子菜单的展开 -->
  <!-- router 是否使用 vue-router 的模式，启用该模式会在激活导航时以 index 作为 path 进行路由跳转 -->
            <div class="sidebar" >
              <el-menu :default-active="onRoutes" class="el-menu-vertical-demo"  theme="dark" unique-opened router>
                <!-- 最外层的ul -->
                  <template v-for="item in items">
                      <template v-if="item.subs">
                          <el-submenu :index="item.id+''">
                              <template slot="title"><i :class="item.icon"></i>{{ item.permissionName }}</template>
                              <el-menu-item v-for="(subItem,i) in item.subs" :key="i" :index="subItem.permissionPath+''">
                                  <template v-if="subItem.subs">
                                      <el-submenu :index="subItem.id+''">
                                        <template slot="title"><i :class="subItem.icon"></i>{{ subItem.permissionName }}</template>
                                        <el-menu-item v-for="(subItem,i) in subItem.subs" :key="i" :index="subItem.id+''">{{ subItem.permissionName }}
                                        </el-menu-item>
                                      </el-submenu>
                                  </template>
                                  <template v-else>
                                    <i :class="subItem.icon"></i>
                                    {{ subItem.permissionName }}
                                  </template>
                              </el-menu-item>
                          </el-submenu>
                      </template>
                      <template v-else>
                          <el-menu-item :index="item.permissionPath">
                              <i :class="item.icon"></i>{{ item.permissionName }}
                          </el-menu-item>
                      </template>
                  </template>
              </el-menu>
          </div>
</template>
<script>
    export default {
        data() {
            return {
                userPermissionUrl:this.baseUrl+"permission/userPermission",
                items: [  ]
            }
        },
        computed:{
            onRoutes(){
                return this.$route.path.replace('/','');
            },
            options () {
			        return this.$store.state.options;
			      }
        },
        created(){
          let _this=this;
          this.$axios.get(this.userPermissionUrl)
            .then(function (response) {
                if (response.data.code == 1001){
                    _this.items=response.data.data.subs;
                }
            })
            .catch(function (error) {
                console.log(error);
            });
        },
         mounted () {
      // 刷新时以当前路由做为tab加入tabs
      this.$store.state.options = [];
      if (this.$route.path !== '/index' && this.$route.path.indexOf('index') == -1) {
        this.$store.commit('add_tabs', {route: '/index', name: '首页'});
        this.$store.commit('add_tabs', {route: this.$route.path , name: this.$route.name });
        this.$store.commit('set_active_index', this.$route.path);
      } else {
        this.$store.commit('add_tabs', {route: '/index', name: '首页'});
        this.$store.commit('set_active_index', '/index');
        this.$router.push('/index');
      }

    },
    }
</script>

<style scoped>
    .sidebar{
        display: block;
        position: absolute;
        width: 250px;
        left: 0;
        top: 70px;
        /*bottom:0;*/
        background: #2E363F;
        z-index: 9999;
    }
    .sidebar > ul {
        height:100%;
    }
    .sidebar > ul  li {
      border-top: 1px solid #37414b;
      border-bottom: 1px solid #1f262d;
  }
   .el-menu--dark {
      background-color: #2e363f;
    }
    .el-menu--dark .el-submenu .el-menu {
        background-color: #2e363f!important;
    }

    .el-submenu .el-menu-item{
      height:auto;
    }
    .el-menu-item  .el-submenu{
      width: 250px;
      margin-left: -45px;
    }

</style>
