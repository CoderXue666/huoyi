<template>
  <div class="login" :style="{backgroundImage:`url(${imgSrc})`}">
    <div class="login-box">
      <div class="logo"><img :src="require('@/assets/logo.png')"><img :src="require('@/assets/images/login/huoyi.png')"></div>
      <div class="title">内部项目管理可视化系统</div>
      <div class="login-form">
        <Form v-show="show" ref="phoneForm">
          <div class="uflex"><span class="bold">欢迎使用</span></div>
          <div class="mflex mt30">
            <Select class="select" v-model="type">
              <Option value="+86">+86</Option>
            </Select>
            <Input v-model="codeInfo.phone" placeholder="填写手机号码"></Input>
          </div>
          <!--</FormItem>-->
          <Button @click="code" class="btn" long>发送验证码</Button>
        </Form>
        <Form v-show="!show" ref="loginForm" :model="loginForm" :rules="loginRules">
          <div class="uflex">
            <span class="bold">登录以继续使用</span>
            <span class="hand" @click="forgetPassword">忘记密码</span>
          </div>
          <FormItem prop="username">
            <Input v-model="loginForm.account" class="mt30" placeholder="输入账号"></Input>
          </FormItem>
          <FormItem prop="password">
            <Input type="password" v-model="loginForm.password" placeholder="密码"></Input>
          </FormItem>
          <Button class="btn" @click="handleLogin" long>立即开始</Button>
        </Form>

        <div class="uflex">
          <div class="">

            <img class="img" :src="require('@/assets/images/login/wechat.png' )" @click="show2 = true" >
            <Modal v-model="show2" title="微信" >
              <div id="wxLoginDiv" style="text-align: center"></div>
              <div slot="footer"></div>
            </Modal>

          </div>

          <div class="hand" @click="show = !show">{{show?'账号密码登录':'验证码登录'}}</div>
        </div>
      </div>

    </div>
    <!--    验证码弹窗-->
    <Modal v-model="yzmtc" scrollable title="请输入验证码" @on-ok="logInTo" @on-cancel="cancel">
        <Form ref="formInline" :model="codeInfo" inline>
          <FormItem prop="phone">
            <Input class="input-call" type="text" v-model="codeInfo.phone" placeholder="手机号">
              <Icon type="ios-person-outline" slot="prepend"></Icon>
            </Input>
          </FormItem>
          <FormItem prop="yzm">
            <Input class="input-call" type="text" v-model="codeInfo.code" placeholder="验证码">
              <Icon type="ios-lock-outline" slot="prepend"></Icon>
            </Input>
          </FormItem>
          <FormItem prop="yhm">
            <Input class="input-call" type="text" v-model="codeInfo.userName" placeholder="用户名">
              <Icon type="ios-lock-outline" slot="prepend"></Icon>
            </Input>
          </FormItem>
        </Form>
    </Modal>

    <!--忘记密码弹窗-->
    <Modal v-model="wjpass" scrollable title="找回密码" @on-ok="backPassword" @on-cancel="cancel">
      <Form ref="formInline" :model="passInfo" inline>
        <FormItem prop="account">
          <Input class="input-call" type="text" v-model="passInfo.account" placeholder="查找的账号">
            <Icon type="ios-person-outline" slot="prepend"></Icon>
          </Input>
        </FormItem>
      </Form>
    </Modal>
    <!--忘记密码确定手机号-->
    <Modal v-model="qdphone" scrollable title="找回密码" @on-ok="authorizationCode" @on-cancel="cancel">
      <div>
        验证码将发送到
        <span>{{backUser.phone}}</span>
      </div>
      <Form ref="formInline" :model="codeInfo" inline>
        <FormItem prop="phone">
          <Input class="input-call" type="text" v-model="codeInfo.code" placeholder="验证码">
            <Icon type="ios-person-outline" slot="prepend"></Icon>
          </Input>
        </FormItem>
        <template>
          <Button type="success" short @click="sendCode" style="position: relative;top: 12px;">发送验证码</Button>
        </template>
      </Form>
    </Modal>
    <!--新的密码-->
    <Modal v-model="password" scrollable title="找回密码" @on-ok="backpassword" @on-cancel="cancel">
      <Form ref="formInline" :model="passwordInfo" inline>
        <FormItem prop="phone">
          <Input class="input-call" type="text" v-model="passwordInfo.password" placeholder="新的密码">
            <Icon type="ios-person-outline" slot="prepend"></Icon>
          </Input>
        </FormItem>
        <FormItem prop="phone">
          <Input class="input-call" type="text" v-model="passwordInfo.qdpassword" placeholder="确定密码">
            <Icon type="ios-person-outline" slot="prepend"></Icon>
          </Input>
        </FormItem>
      </Form>
    </Modal>
	</div>
</template>

<script>
import {setToken} from "../utils/auth";
import { login } from "../api/login";
import {getcode,getlogInTo,getacclogInTo,retrievePassword,accountUser,getAuthorizationCode,getPassword} from "../utils/rq-login";
import {getToken} from "../utils/auth";

export default {
		name: "Login",
    components: {},
		data() {
			return {
			  //临时授权码
			  tempCode:'',
        password:false,
        passwordInfo:{
          password:'',
          qdpassword:'',
        },
        qdphone:false,
        wjpass:false,
        //找回密码信息
        passInfo:{
          account:'',
        },
        yzmtc:false,
        codeInfo:{
          phone:'',
          code:'',
          userName:'',
        },
        //查找的用户信息
        backUser:{
          userId:'',
          userName:'',
          avatar:'',
          saturation:'',
          status:'',
          phone:'',
        },
				imgSrc:require('@/assets/images/bg.png'),
				show: true,
        show2: false,
        show3: false,
				type:'+86',
				phone: '',
				loginForm: {
          account: "",
					password: ""
				},
				loginRules: {
          account: {required: true,trigger: "blur",message: "请输入手机号或账号"},/*{pattern: /(^1[3456789]\d{9}$)|(^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$)/,message: "手机号码或邮箱格式不正确",trigger: "blur"}],*/
          password: [{required: true,trigger: "blur",message: "请输入密码"}]
				},
				redirect: undefined
			};
		},

		created() {

    },

  methods: {
    // ok() {
    //   this.$Message.info('登录成功');
    //   this.sendcode();
    // },
    cancel() {
      this.$Message.info('Clicked cancel');
    },
    //登入
    logInTo(){
      getlogInTo(this.codeInfo).then(res => {
        if (res.code!=200) {
          alert(res.message)
        }else{
          setToken(res.data.token)
          // window.sessionStorage.setItem('token',data.token)

          this.$router.push({path: this.redirect || "/"});
        }
      }).catch()
    },
    //发送验证码
    code(){
      getcode(this.codeInfo).then(res => {
        if(res.code!=200){
          alert(res.message);
        }else{
          this.yzmtc=true
        }
      }).catch()
    },
    //找回密码弹窗
    forgetPassword(){
      this.wjpass=true
    },
    //通过账户查找用户
    backPassword(){
      accountUser(this.passInfo).then(res=>{
        if (res.code==200){
          if (res.data.phone==null){
            alert('该账号未绑定手机号')
            return false
          }
          this.backUser.phone=res.data.phone
          this.qdphone=true
        }
      })
    },
    //发送验证码
    sendCode(){
      retrievePassword(this.passInfo).then(res=>{
      })
    },
    //获取临时授权码
    authorizationCode(){
      getAuthorizationCode(this.passInfo.account,this.codeInfo.code).then(res=>{
        if (res.code==200){
          this.tempCode=res.data.authCode
          this.password=true
        }else{
          alert('获取授权码失败')
        }
      })
    },
    backpassword(){
      getPassword(this.tempCode,this.passwordInfo).then(res=>{
        if (res.code==200){
          alert("密码修改成功")
        }
      })
    },
    sendcode() {
      /* if(!this.phone){
        this.$Message.error('请输入手机号')
        return false
      }
      if(!/^1[3456789]\d{9}$/.test(this.phone)){
        this.$Message.error('手机号码不正确')
        return false
      } */
      this.yzmtc=true
      // this.$mock('login').then(res => {
      //   //login(this.loginForm).then(res => {
      //   setToken(res.token)
      //   this.$router.push({path: this.redirect || "/"});
      // }).catch()
    },
    handleLogin() {
      // this.$refs.loginForm.validate(valid => {
      //   if (valid) {
          getacclogInTo(this.loginForm).then(res => {
            if (res.code == 10612){
              alert(res.message)
            }
            //login(this.loginForm).then(res => {
            setToken(res.data.token)
            this.$router.push({path: this.redirect || "/"});
          }).catch()
      //   }
      // });
    },
    codeLogin() {
      window.WwLogin({
        "id" : "wxLoginDiv",
        "appid" : "ww468465bb8be614d4",
        "agentid" : "1000002",
        "redirect_uri" : "https://huoyi.pblog.top/api/user/loginEntWxCb",
        "state" : "",
        "href" : "",
      });
    },

      // watch: {
      //   $router: {
      //     handler: function (route) {
      //       this.redirect = route.query && route.query.redirect;
      //     },
      //     immediate: true
      //   }
      // }
  },
  mounted() {
    this.codeLogin()
  }
}
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
  .input-call :nth-last-child(1){
  color: black !important;
  }

	.select{width: 115px;margin-right: 15px;}
	::v-deep .select .ivu-select-selection{height: 45px;border: 1px solid #fff;border-radius: 15px;background-color: #0c1321;}
	::v-deep .ivu-select-selection .ivu-select-selected-value{height: 45px;line-height: 45px;font-size: 16px;color: #fff;}
	::v-deep .ivu-input {
		background-color: transparent;
		border: none;
		border-radius: 0;
		border-bottom: 1px solid #7E828A;
		height: 45px;
		font-size: 16px;
	}
  ::v-deep .ivu-select-arrow{color: #fff;}
	.btn {
		height: 50px;
		margin: 40px 0;
		border-radius: 10px;
		border: none;
		font-size: 20px;
		color: #fff;
		background-color: #151F33;
	}

::v-deep .ivu-btn-icon-only.ivu-btn-circle>.ivu-icon {
  vertical-align: middle;
}
.login {
  display: flex;
  justify-content: center;
  height: 100%;
  // background-image: url("@/assets/images/bg.png");
  background-size: cover;
  .logo {
    padding-top: 90px;
    text-align: center;
    img{
      vertical-align: middle;
      &:first-child{
        margin-right: 8px;
      }
    }
  }

		.title {
			text-align: center;
			font-size: 20px;
			margin-top: 10px;
			margin-bottom: 70px;
		}
		
		.login-form {
			border-radius: 10px;
			background: #0C1321;
			width: 600px;
			padding: 40px;
			margin: 0 auto;
		}
		.img{
			width: 40px;
			height: 40px;
			border-radius: 20px;
		}
		.img+.img {
			margin-left: 20px;
		}

    #dingWeiXin {

    }
	}
</style>
