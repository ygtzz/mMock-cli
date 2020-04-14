<template>
    <div class="addApi">
        <div class="titlec">
            Add API
        </div>
        <div class="opc">
            <select v-model="method" class="sel sel-method">
                <option value='get'>get</option>
                <option value='post'>post</option>
                <option value='put'>put</option>
                <option value='delete'>delete</option>
                <option value='options'>options</option>
            </select>
            <input v-model="url" class="input input-url" />
        </div>
        <div class="codec">
            <codemirror class="code-mirror" v-model="content" :options="cmOptions"></codemirror>
        </div>
        <div class="btnc">
            <button @click="onClose(false)" class="btn btn-secondary btn-close">关闭</button>
            <button @click="onSumit" class="btn btn-primary">提交</button>
        </div>
    </div>
</template>
<style lang="less">
    .addApi{
        padding: 15px;
        .titlec{
            font-size: 20px;
            font-weight: bold;
        }
        .opc{
            margin-top: 20px;
        }
        .input-url{
            width: 664px;
            vertical-align: middle;
        }
        .sel-method{
            width: 100px;
            display: inline-block;
            vertical-align: middle;
        }
        .codec{
            margin-top: 20px;
            height: 300px;
            padding-bottom: 20px;
        }
        .code-mirror{
            font-size: 14px;
            line-height: 1.5;
        }
        .btnc{
            margin-top: 30px;
            text-align: right;
        }
        .btn-close{
            margin-right: 12px;
        }
    }
</style>
<script>
import axios from 'index/widget/req';
import {codemirror} from 'vue-codemirror';
import 'codemirror/lib/codemirror.css';
import 'codemirror/mode/javascript/javascript.js'
import 'codemirror/theme/base16-dark.css'

export default {
    name: "c-addApi",
    props:['curApi'],
    watch:{
        curApi(val){
            this.method = val.method;
            this.url = val.url;
            this.content = val.content;
        }
    },
	data() {
        let curApi = this.curApi || {};
		return {
            method: curApi.method || 'get',
            url: curApi.url || '',
            content: JSON.stringify(curApi.content,null,4) || '{}',
            cmOptions: {
                tabSize: 4,
                mode: {name: "javascript", json: true},
                theme: 'base16-dark',
                lineNumbers: true,
                line: true
            }
        }
	},
	methods: {
        filterContent(code){    
            try{
                //过滤注释
                code = code.replace(/\/\/.*/g, '\n').replace(/\*.*?\*/g, '\n');
                code = JSON.parse(code);
                code = JSON.stringify(code);
            }
            catch(e){
                this.$toast('please input json format');
                throw e;
            }
            return code;
        },
		async onSumit() {
            let {method,url,content} = this;
            let params = {
                method,
                url,
                content: this.filterContent(content)
            }
            
            try{
                this.$loading(true);
                let res = await axios.post('/mmock/api',params);
                if(res.res){
                    this.onClose(params);
                }
            }   
            finally{
                this.$loading(false);
            }
        },
        onClose(data) {
            this.$emit('close',data);
        }
    },
    components:{
        codemirror
    }
};
</script>