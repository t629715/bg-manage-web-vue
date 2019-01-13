<template>
	<div class="wrapper">
		<v-head></v-head>
		<v-sidebar></v-sidebar>
		<div class="content">
			<!-- 此处放置el-tabs代码 -->
			<div class="template-tabs">
				<el-tabs v-model="activeIndex" type="border-card" closable @tab-click="tabClick" v-if="options.length" @tab-remove="tabRemove">
					<el-tab-pane :key="item.name" v-for="(item, index) in options" :label="item.name" :name="item.route">
					</el-tab-pane>
				</el-tabs>
			</div>
			<transition name="move" mode="out-in">
                <keep-alive>
                    <router-view></router-view>
                </keep-alive>
			</transition>
		</div>
	</div>
</template>

<script>
	import vHead from './Header.vue';
	import vSidebar from './Sidebar.vue';
	export default {
		components: {
			vHead,
			vSidebar
		},
		methods: {
			// tab切换时，动态的切换路由
			tabClick(tab) {
				let path = this.activeIndex;
				// 用户详情页的时候，对应了二级路由，需要拼接添加第二级路由
				if(this.activeIndex === '/userInfo') {
					path = this.activeIndex + '/' + this.$store.state.userInfo.name;
				}
				this.$router.push({
					path: path
				});
			},
			tabRemove(targetName) {
				// 首页不可删除
				if(targetName == '/index') {
					return;
				}
				this.$store.commit('delete_tabs', targetName);
				if(this.activeIndex === targetName) {
					// 设置当前激活的路由
					if(this.options && this.options.length >= 1) {
						this.$store.commit('set_active_index', this.options[this.options.length - 1].route);
						this.$router.push({
							path: this.activeIndex
						});
					} else {
						this.$router.push({
							path: '/'
						});
					}
				}
			}
		},
		computed: {
			options() {
				return this.$store.state.options;
			},
			activeIndex: {
				get() {
					return this.$store.state.activeIndex;
				},
				set(val) {
					this.$store.commit('set_active_index', val);
				}
			}
		},
		watch: {
			'$route' (to) {
				let flag = false;
				for(let option of this.options) {
					if(option.name === to.name) {
						flag = true;
						this.$store.commit('set_active_index', '/' + to.path.split('/')[1]);
						break
					}
				}
				if(!flag) {
					this.$store.commit('add_tabs', {
						route: '/' + to.path.split('/')[1],
						name: to.name
					});
					this.$store.commit('set_active_index', '/' + to.path.split('/')[1]);
				}
			}
		}
	}
</script>
<style>
	@import "../../../static/css/matrix-style.css";
	@import "../../../static/css/matrix-media.css";
	body {
		overflow-x: auto;
	}
	.content {
		position: absolute;
		width: 1650px;
		/*height: 1200px;*/
		left: 250px;
		top: 38px;
		bottom: 0;
		background: #eeeeee;
	}

	a {
		text-decoration: none;
	}

	.container-fluid {
		margin: 20px;
		padding: 10px;
		background: #fff;
	}

	.formBox {
		padding: 10px;
	}

	.tableBox {
		padding: 10px;
	}

	.paginationBox {
		padding: 10px;
	}

	table {
		text-align: center;
	}

	.cell {
		text-align: center;
	}
	/*.el-table {
    border: 1px solid #dfe6ec;
    }*/
</style>
