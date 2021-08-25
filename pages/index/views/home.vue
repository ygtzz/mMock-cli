<template>
	<div class="home">
		<div class="optc">
            <span class="opt-l">
                <a class="doc-link" href='https://github.com/ygtzz/mMock-cli' target="_blank">使用文档</a>
            </span>
            <span class="opt-r">
			    <button class="btn btn-primary" @click="onAdd">添加</button>
            </span>
		</div>
        <div class="tbc">
            <table class="tb tb-api">
                <thead>
                    <tr>
                        <td>名称</td>
                        <td>方法</td>
                        <td style="width:400px;">内容</td>
                        <td>操作</td>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(item,index) in apis" :key="'api'+index">
                       <td>{{item.url}}</td>
                       <td>{{item.method}}</td>
                       <td><div class="col-content">{{item.content}}</div></td>
                       <td>
                           <a :href="getTestUrl(item)" target="_blank">
                               <button class="btn btn-cyan btn-small btn-test">测试</button>
                           </a>
                           <button class="btn btn-cyan btn-small btn-edit" @click="onEdit(item)">编辑</button>
                           <button class="btn btn-cyan btn-small" @click="onDelete(item)">删除</button>
                       </td>
                    </tr>
                </tbody>
            </table>
        </div>
        <modal name="addApi" width="1000" height="680" :clickToClose="false">
            <addApi :curApi="curApi" @close="onAddApiModalClose" />
        </modal>
	</div>
</template>
<style lang="less">
    .home{
        display: table;
        margin: 0 auto;
        .optc{
            margin-top: 10px;
            overflow: hidden;
            padding-right: 3px;
        }
        .opt-r{
            float: right;
        }
        .tbc{
            margin-top: 10px;
        }
        .tb-api{
            width: 90vw;
        }
        .btn-test{
            margin-right: 5px;
        }
        .btn-edit{
            margin-right: 5px;
        }
        .col-content{
            width: 40vw;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
        }
        .doc-link{
            line-height: 30px;
        }
    }
</style>
<script>
import axios from '../widget/req';
import addApi from './addApi';

export default {
	name: "p-home",
	mounted() {
        this.getApis();
    },
	data() {
		return {
            apis:[],
            url: '',
            curApi: {}
        }
    },
	methods: {
        async getApis(){
            try{
                this.$loading(true);
                let res = await axios.get('/mmock/apis');
                let apis = Object.keys(res).map(item => {
                    const items = item.split('|');
                    return {
                        method: items[0],
                        url: items[1],
                        content: res[item]
                    }
                });
                this.apis = apis.reverse();
            }
            finally{
                this.$loading(false);
            }
        },
        getTestUrl(item){
            //TODO 1.mock domain 
            //2.url with params
            return `${location.origin}${item.url}`;
        },
        onTest(item){
            
        },
		onAdd() {
			this.$modal.show('addApi');
        },
        onAddApiModalClose(data){
            this.$modal.hide('addApi');
            this.curApi = {};
            if(data){
                this.saveApi(data);
            }
        },
        saveApi(data){
            let updateItem = null;
            this.apis.every(item => {
                if(item.method == data.method && item.url == data.url){
                    item.content = JSON.parse(data.content);
                    updateItem = item;
                    return false;
                }
                return true;
            });
            //非更新，就是新增
            if(!updateItem){
                this.apis.push(data);                      
            }
        },
        onEdit(api) {
            this.curApi = api;
			this.$modal.show('addApi');
        },
        async onDelete(api){
            try{
                this.$loading(true);
                let res = await axios.delete('/mmock/api',{params:{method:api.method,url:api.url}});
                if(res.res){
                    this.apis = this.apis.filter(item => !(item.method == api.method && item.url == api.url))
                }
            }
            finally{
                this.$loading(false);
            }
        }
	},
	components: {
        addApi
    }
};
</script>