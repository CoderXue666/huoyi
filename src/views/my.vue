<template>
	<div class="page">
		<Form ref="formInline" :model="userInfo" inline :label-width="70" class="form">
			<FormItem>
				<Tooltip placement="right-start">
					<Avatar shape="square" :src="userInfo.avatar" />
					<div slot="content">
						<div class="info">
              <div class="label">姓名</div>
              {{userInfo.userName}}
            </div>
						<div class="info">
							<div class="label">状态</div>
							<div @click="change(userInfo.userId,userInfo.status)" class="sbtn pd15 pointer">{{userInfo.status==0?'外出':'正常'}}</div>
						</div>
<!--						<div class="info">-->
<!--							<div class="label">项目权限</div>-->
<!--							<div class="flex1 uels">组长</div>-->
<!--						</div>-->
						<div class="info">
							<div class="label">登录时间</div>
							<div class="flex1 uels">{{userInfo.lastLoginTime}}</div>
						</div>
<!--						<div class="info">-->
<!--							<div class="label">项目角色</div>-->
<!--							<div class="flex1 uels">-->
<!--								<div>项目1(组长)</div>-->
<!--							</div>-->
<!--						</div>-->
<!--						<div class="info">-->
<!--							<div class="label"></div>-->
<!--							<div class="flex1 uels">-->
<!--								<div>项目2(发起人)</div>-->
<!--							</div>-->
<!--						</div>-->
<!--						<div class="info">查看成员项目内任务</div>-->
					</div>
				</Tooltip>&nbsp;
				<Rate class="square ml" v-model="userInfo.saturation" disabled icon="ios-square" />
			</FormItem>
			<div class="rfloat">
				<FormItem label="创建者">
					<Select v-model="formItem.select" style="width: 150px;">
            <Option>全部</Option>
						<Option v-for="item in myTask">{{item.sponsor}}</Option>

					</Select>
				</FormItem>
				<FormItem label="优先级">
					<Select v-model="formItem.level" style="width: 150px;">
						<Option value="1">1星</Option>
						<Option value="2">2星</Option>
						<Option value="3">3星</Option>
            <Option value="4">4星</Option>
            <Option value="5">5星</Option>
					</Select>
				</FormItem>
				<FormItem label="关键字">
					<Input class="search" suffix="ios-search" placeholder="搜索" />
				</FormItem>
				<Button type="primary" @click="handleSubmit('formInline')">确定</Button>
			</div>
		</Form>
		<div class="grid">
			<div class="col5">
				<div class="uflex mtm">
					<div class="btxt">进行中<span class="ml">{{list1.length}}</span></div>
<!--					<div class="addbtn" @click="open('进行中')">+</div>-->
				</div>
			</div>
			<div class="col5">
				<div class="uflex mtm">
					<div class="btxt">未开始<span class="ml">{{list2.length}}</span></div>
<!--					<div class="addbtn" @click="open('未开始')">+</div>-->
				</div>
			</div>
			<div class="col5">
				<div class="uflex mtm">
					<div class="btxt">待接收<span class="ml">{{list3.length}}</span></div>
					<div class="addbtn" @click="open()">+</div>
				</div>
			</div>
			<div class="col5">
				<div class="uflex mtm">
					<div class="btxt">已完成<span class="ml">{{list4.length}}</span></div>
				</div>
			</div>
			<div class="col5">
				<div class="uflex mtm">
					<div class="btxt">参与项目<span class="ml">{{join_pro.length}}</span></div>
				</div>
			</div>
		</div>
		<div class="grid">
			<div class="col5">
				<perfect-scrollbar>
					<draggable id="list1" :list="list1" class="list-group" draggable=".ucard" group="a" @end="end" >
						<div class="ucard flex" @dragend="ondragend(item,index)" :class="['red-bd','blu-bd'][index%2]" v-for="(item,index) in list1" :key="index">
							<div v-if="item.state === 1" class="abs">
								<Icon @click="play(item.taskId,0)" class="pointer" type="ios-play" size="22"/>
								<span>暂停中</span>
							</div>
							<div class="lfbox down" >
								<Dropdown placement="right-start" >
									<Icon type="md-arrow-dropdown" size="24"/>
									<DropdownMenu slot="list">
<!--										<DropdownItem @click.native="dropdown('未开始')">未开始</DropdownItem>-->
<!--										<DropdownItem @click.native="dropdown('进行中')">进行中</DropdownItem>-->
<!--										<DropdownItem @click.native="dropdown('待接收')">待接收</DropdownItem>-->
										<DropdownItem @click.native="dropdown(item.taskId,3)" >已完成</DropdownItem>
									</DropdownMenu>
								</Dropdown>
								<div class="state">进行中</div>
							</div>
							<div class="flex1">
								<div class="uflex">
									<div>{{item.name}}</div>
									<div class="mflex">
										<div class="mflex opt w30">
											<Icon @click="pause(item.taskId,1)" type="ios-pause" size="24"/>
										</div>
										<img class="img" @click="isStar(userInfo.userId,3,item.taskId)" v-show="item.isStar == 0" :src="require('@/assets/images/home/Collection-1(1).png')">
                    <img class="img" @click="delStar(3,userInfo.userId,item.taskId)" v-show="item.isStar == 1" :src="require('@/assets/images/home/Collection.png')">
									</div>
									
								</div>
								<Rate disabled show-text v-model="item.priority"  custom-icon="iconfont hy-star">
									<span class="mr8">发起人</span>
									<span>{{item.sponsor}}</span>
								</Rate>
								<!-- <Rate disabled v-model="valueText" custom-icon="iconfont hy-star"></Rate> -->
<!--								<Progress :percent="parseInt(item.progress.split('/')[0])/parseInt(item.progress.split('/')[1])*100" :stroke-width="8">-->
<!--									<span>{{item.progress}}</span>-->
<!--								</Progress>-->
								<div class="flex mt5">
									<div class="obtn uels">{{(item.endTime.substring(0,10))}}截止</div>
									<div class="sbtn pd15 uels">{{item.executor[0].username}}</div>
								</div>
							</div>
							
						</div>
					</draggable>
				</perfect-scrollbar>
			</div>
			<div class="col5">
				<perfect-scrollbar>
					<draggable id="list2" :list="list2" class="list-group" draggable=".ucard" group="a" @end="end" >
						<div class="ucard flex" @dragend="ondragend(item,index)" :class="['red-bd','blu-bd'][index%2]" v-for="(item,index) in list2" :key="index">
							<div v-if="item.state === 1" class="abs">
								<Icon @click="play(item.taskId,0)" class="pointer" type="ios-play" size="22"/>
								<span>暂停中</span>
							</div>
							<div class="lfbox down">
								<Dropdown placement="right-start" >
									<Icon type="md-arrow-dropdown" size="24"/>
									<DropdownMenu slot="list" v-model="item.taskId">
										<DropdownItem @click.native="dropdown(item.taskId,2)">开始</DropdownItem>
<!--										<DropdownItem @click.native="dropdown('进行中')">进行中</DropdownItem>-->
<!--										<DropdownItem @click.native="dropdown('待接收')">待接收</DropdownItem>-->
<!--										<DropdownItem @click.native="dropdown('已完成')">已完成</DropdownItem>-->
									</DropdownMenu>
								</Dropdown>
								<div class="state">未开始</div>
							</div>
							<div class="flex1">
								<div class="uflex">
									<div>{{item.name}}</div>
									<div class="mflex">
										<div class="mflex opt w30">
											<Icon @click="pause(item.taskId,1)" type="ios-pause" size="24"/>
										</div>
                    <img class="img" @click="isStar(userInfo.userId,3,item.taskId)" v-show="item.isStar == 0" :src="require('@/assets/images/home/Collection-1(1).png')">
                    <img class="img" @click="delStar(3,userInfo.userId,item.taskId)" v-show="item.isStar == 1" :src="require('@/assets/images/home/Collection.png')">
									</div>
									
								</div>
								<Rate disabled show-text v-model="item.priority"  custom-icon="iconfont hy-star">
									<span class="mr8">发起人</span>
									<span>{{item.sponsor}}</span>
								</Rate>
								<!-- <Rate disabled v-model="valueText" custom-icon="iconfont hy-star"></Rate> -->
<!--								<Progress :percent="parseInt(item.progress.split('/')[0])/parseInt(item.progress.split('/')[1])*100" :stroke-width="8">-->
<!--									<span>{{item.progress}}</span>-->
<!--								</Progress>-->
								<div class="flex mt5">
									<div class="obtn uels">{{(item.endTime.substring(0,10))}}截止</div>
									<div class="sbtn pd15 uels">{{item.executor[0].username}}</div>
								</div>
							</div>
							
						</div>
					</draggable>
				</perfect-scrollbar>
			</div>
			<div class="col5">
				<perfect-scrollbar>
					<draggable id="list3" :list="list3" class="list-group" draggable=".ucard" group="a" @end="end" >
						<div class="ucard flex" @dragend="ondragend(item,index)" :class="['red-bd','blu-bd'][index%2]" v-for="(item,index) in list3" :key="index">
							<div v-if="item.state === 1" class="abs">
								<Icon @click="play(item.taskId,0)" class="pointer" type="ios-play" size="22"/>
								<span>暂停中</span>
							</div>
							<div class="lfbox down">
								<Dropdown placement="right-start" >
									<Icon type="md-arrow-dropdown" size="24"/>
									<DropdownMenu slot="list" v-model="item.taskId">
										<DropdownItem @click.native="dropdown(item.taskId,1)">接收</DropdownItem>
										<DropdownItem @click.native="dropdown(item.taskId,4)">拒收</DropdownItem>
									</DropdownMenu>
								</Dropdown>
								<div class="state">待接收</div>
							</div>
							<div class="flex1">
								<div class="uflex">
									<div>{{item.name}}</div>
									<div class="mflex">

                    <img class="img" @click="isStar(userInfo.userId,3,item.taskId)" v-show="item.isStar == 0" :src="require('@/assets/images/home/Collection-1(1).png')">
                    <img class="img" @click="delStar(3,userInfo.userId,item.taskId)" v-show="item.isStar == 1" :src="require('@/assets/images/home/Collection.png')">
									</div>
									
								</div>
								<Rate disabled show-text v-model="item.priority"  custom-icon="iconfont hy-star">
									<span class="mr8">发起人</span>
									<span>{{item.sponsor}}</span>
								</Rate>
<!--								<Progress :percent="parseInt(item.progress.split('/')[0])/parseInt(item.progress.split('/')[1])*100" :stroke-width="8">-->
<!--									<span>{{item.progress}}</span>-->
<!--								</Progress>-->
								<div class="flex mt5">
									<div class="obtn uels">{{(item.endTime.substring(0,10))}}截止</div>
									<div class="sbtn pd15 uels">{{item.executor[0].username}}</div>
								</div>
							</div>
							
						</div>
					</draggable>
				</perfect-scrollbar>
			</div>
			<div class="col5">
				<perfect-scrollbar>
					<div class="ucard flex gay-bd" v-for="(item,index) in list4" :key="index">
						<div class="lfbox down">
							<Icon type="md-arrow-dropdown" size="24"/>
							<div class="state">已完成</div>
						</div>
						<div class="flex1">
							<div class="uflex lh24">
								<div>{{item.name}}</div>
								<!-- <img class="img" :src="require('@/assets/images/home/Collection-1(1).png')"> -->
							</div>
							<Rate disabled show-text v-model="item.priority"  custom-icon="iconfont hy-star">
								<span class="mr8">发起人</span>
								<span>{{item.sponsor}}</span>
							</Rate>
<!--							<Progress :percent="parseInt(item.progress.split('/')[0])/parseInt(item.progress.split('/')[1])*100" :stroke-width="8">-->
<!--								<span>{{item.progress}}</span>-->
<!--							</Progress>-->
							<div class="flex mt5">
								<div class="obtn uels">{{(item.endTime.substring(0,10))}}截止</div>
								<div class="sbtn pd15 uels">{{item.executor[0].username}}</div>
							</div>
						</div>
						
					</div>
					 
				</perfect-scrollbar>
			</div>
			<div class="col5 last">
				<perfect-scrollbar>


          <!--我的项目-->
					<div class="ucard blu-lbd" v-for="(item,index) in join_pro" :key="index">
						<div class="uflex">
							<div class="btxt">{{item.name}}</div>
							<div class="">
                <img class="img" @click="isStar(userInfo.userId,2,item.pj_id)" v-show="item.isStar == 0" :src="require('@/assets/images/home/Collection-1(1).png')">
                <img class="img" @click="delStar(2,userInfo.userId,item.pj_id)" v-show="item.isStar == 1" :src="require('@/assets/images/home/Collection.png')">
							</div>
						</div>
						<Rate disabled show-text v-model="item.priority" custom-icon="iconfont hy-star">
							<span class="mr8">发起人</span>
							<span>{{item.initiatorName}}</span>
						</Rate>
						<Progress :percent="parseInt(item.nodeOrder)/parseInt(item.nodeSum)*100" :stroke-width="8">
								<span>{{item.nodeOrder}}/{{item.nodeSum}}</span>
						</Progress>
						<div class="uflex mtb10">
							<div class="col3 obtn uels">{{parseTime(item.release_time)}}</div>
							<div class="col3 sbtn uels">{{item.place}}</div>


							<div class="col3 sbtn uels" >{{item.principal}}</div>

						</div>
						<div class="flex" v-for="item in join_pro.pjDynamic">
							<div class="key">{{item.dynamicContent}}</div>
							<div>{{item.release_time}}</div>
						</div>
					</div>


				</perfect-scrollbar>
			</div>
		</div>
		<Divider />
		
		<div class="mflex xtitle">
			<img :src="require('@/assets/images/home/star.png')">我派发的任务视图<span class="ml">{{distributeTask.length}}</span>

<Form ref="formInline" :model="userInfo" inline :label-width="70" class="form">
      <div>
        <FormItem label="执行人">
          <Select v-model="formItem.select" style="width: 150px;">
            <Option value="李春兰">李春兰</Option>
            <Option value="shanghai">London</Option>
            <Option value="shenzhen">Sydney</Option>
          </Select>
        </FormItem>
        <FormItem label="优先级">
          <Select v-model="formItem.level" style="width: 150px;">
            <Option value="1">1星</Option>
            <Option value="2">2星</Option>
            <Option value="3">3星</Option>
            <Option value="4">4星</Option>
            <Option value="5">5星</Option>
          </Select>
        </FormItem>
        <FormItem label="关键字">
          <Input class="search" suffix="ios-search" placeholder="搜索" />
        </FormItem>
        <Button type="primary" @click="handleSubmit('formInline')">确定</Button>
      </div>
      </Form>

		</div>


		<div class="grid" >
			<div class="ucard flex blu-bd" v-for="(item,index) in distributeTask" :key="index">

        <div v-if="item.state === 1" class="abs">
          <Icon @click="play(item.taskId,0)" class="pointer" type="ios-play" size="22"/>
          <span>暂停中</span>
        </div>

				<div class="lfbox">
					<Icon type="md-arrow-dropdown" size="24"/>
					<div class="state">{{item.status}}</div>
				</div>
				<div class="flex1">
					<div class="uflex">
						<div>{{item.name}}</div>
						<div class="mflex">
							<div class="mflex opt">
								<Icon @click="pause(item.taskId,1)" type="ios-pause" size="20"/>
								<Icon @click="done" class="ml5" type="md-checkmark" size="20"/>
                <Icon type="md-close" size="20" @click="endTask"/>
							</div>
						</div>
						
					</div>
					<Rate disabled  custom-icon="iconfont hy-star" v-model="item.priority"></Rate><!---->
<!--					<Progress :percent="6/8*100" :stroke-width="8">-->
<!--						<span>6/8</span>-->
<!--					</Progress>-->
					<div class="mflex mt5">
						<div class="obtn uels">{{item.endTime.substring(0,10)}}截止</div>
						<div class="sbtn pd15 uels">{{item.executor[0].username}}</div>
					</div>
				</div>
			</div>
		</div>





















		<!-- 添加弹窗 -->
		<Modal v-model="modal" scrollable title="创建新任务">
			<div class="flex">
				<div class="lfbox down">
					<Dropdown placement="right-start" >
						<Icon type="md-arrow-dropdown" size="24"/>
						<DropdownMenu slot="list">
							<DropdownItem @click.native="dropdown('待接收')" >待接收</DropdownItem>
						</DropdownMenu>
					</Dropdown>
					
					<div class="state">待接收</div>
				</div>
				<Input v-model="addMyTask.name" type="textarea" :rows="3" placeholder="输入产品需求内容......" />
			</div>
			<div class="uflex mtl">
				<div class="label">
					<img class="uicon" :src="require('@/assets/images/detail/Team.png')">所属项目
				</div>
				<div class="flex1"><!--<Input  class="search" placeholder="所属项目"/>-->

          <Dropdown placement="right-start">
            <span class="cbod">{{addMyTask.pjName}}</span>
            <DropdownMenu slot="list" style="padding: 6px 10px;">
              <RadioGroup v-model="addMyTask.pj_id" vertical>
                <DropdownItem @click.native="checkPerson(item.pj_id,item)" v-for="(item, index) in join_pro" :key="index">
                  <Radio :label="item.pj_id" >{{item.name}}</Radio>
                </DropdownItem>
              </RadioGroup>
            </DropdownMenu>
          </Dropdown>

          </div>
			</div>
			<div class="uflex mtl">
				<div class="label">
					<img class="uicon" :src="require('@/assets/images/detail/Plan.png')">设置截止时间
				</div>
				<div class="flex1"><DatePicker v-model="addMyTask.end_time" type="date" class="search" placeholder="截止时间"></DatePicker></div>
			</div>
			<div class="uflex mtl">
				<div class="label">
					<img class="uicon" :src="require('@/assets/images/detail/priority.png')">优先级
				</div>
				<div class="flex1"><Rate v-model="addMyTask.priority" custom-icon="iconfont hy-star"></Rate></div>
			</div>
			<div class="uflex mtl">
				<div class="label">
					<img class="uicon" :src="require('@/assets/images/detail/Person.png')">执行人
				</div>
				<div class="flex1 down">
					<Dropdown placement="right-start">
						<span class="cbod">{{addMyTask.username}}</span>
						<DropdownMenu slot="list" style="padding: 6px 10px;">
							<Button type="default" ghost long @click="search">搜索</Button>
							<RadioGroup v-model="addMyTask.member_id" vertical>
								<DropdownItem @click.native="checkTaskPerson(item)" v-for="(item, index) in promember" :key="index">
									<Radio :label="item.pjMemberId">{{item.username}}</Radio>
								</DropdownItem>
							</RadioGroup>
						</DropdownMenu>
					</Dropdown>
				</div>
			</div>
			<div slot="footer">
				<Button type="default" ghost @click="save">完成并创建下一个</Button>
				<Button type="primary" @click="finish">完成</Button>
			</div>
		</Modal>
	</div>
</template>

<script>
	import draggable from "vuedraggable";

	import {getMyProject,getMyTask,postMyTask,getProMembers,postMyTaskStatus,getDistributeTask,postMyTaskState,getUserInfo,postUserInfo,addStar,delStar} from "../utils/rq-my";

  export default {
   // inject: ['reload'],
		components: {
		  draggable
		},
		data() {
			return {
			  myTask:[],
        myTaskId:[],


        promember:[],
			  addMyTask: {
          user_id:'',
          username: '',
          pj_id:'',
          pjName: '',
          name: '',
          end_time:'',
          priority:'',
          member_id:'',
          memberId:'',
          state: ''
        },
        postStatus: {
			    status:'',
          taskId:''
        },
				fromId:'',
				toId:'',
				formItem: {
					select: '李春兰',
					level:'非常紧急'
				},
				modal:false,
				vo:{
					type:1,
					content:'',
					project:'',
					endTime:'',
					rate:5,
					person:'赵迁'
				},		
				list1:[],
        list1TaskId:[],
				list2:[],
				list3:[],
				list4:[],
				myPro:[],
				userName: [],

        distributeTask:[],


        join_pro: {
			     name:'',
          pj_id:''
         },
        task: [],

				valueText:3,
				state:'未开始',
				status:'',

        userInfo: {
          userId:'',
          userName:'',
          avatar: '',
          saturation:'',
          status:'',
          memberId:'',
          lastLoginTime:'',
        }
			}
		},
		created() {
			 // this.$nextTick(() => {
       //   this.getMyProject()
       //   this.getMyTask()
       //   this.getDistributeTask()
       //   this.getUserInfo()
			 // })
      //获取用户信息
      getUserInfo().then(res => {
        this.userInfo = res.data

        if (this.userInfo.status == 0) {
          this.userInfo.status = '1'
        }else {
          this.userInfo.status = '0'
        }

        this.getMyProject()
        this.getMyTask()
        this.getDistributeTask()
        this.getUserInfo()
      })

		},
		methods: {
      //添加星标
      isStar(userId,type,fkId) {
        addStar(userId,type,fkId).then(res => {
          this.$nextTick(() => {
            this.getMyTask()
          })
        })
      },
      //删除星标
      delStar(type,userId,fkId) {
        delStar(type,userId,fkId).then(res => {
          this.$nextTick(() => {
            this.getMyTask()
          })
        })
      },
		  //获取我的项目数据
		  getMyProject(){
		    getMyProject().then(res => {
		      this.join_pro = res.data.list
        })
      },
			//获取我的数据


			//获取参与项目任务
			getMyTask(){
				getMyTask(this.userInfo).then(res => {
				 // this.myTask = res.data[4]

          //未开始
          this.list2=res.data[0]
          //进行中
					this.list1=res.data[1]
          //待接收
					this.list3=res.data[2]
          //已完成
					this.list4=res.data[3]

          // this.$nextTick(() => {
          //   this.getMyTask()
          // })
        }).catch()

			},
      //我派发的任务视图
      getDistributeTask(){
        getDistributeTask(this.userInfo).then(res => {
          this.distributeTask = res.data.list

          //获取任务状态，判断状态
          for(let i=0;i<this.distributeTask.length;i++){
            let task = this.distributeTask[i];
            //console.log(task);
            if(task.status===0){
              this.distributeTask[i].status='待接收'
            }else if(task.status===1){
              this.distributeTask[i].status='未开始'
            }else if(task.status===2){
              this.distributeTask[i].status='进行中'
            }else if(task.status===3){
              this.distributeTask[i].status='已完成'
            }
          }

          // this.$nextTick(() => {
          //   this.getDistributeTask()
          // })
        })
      },

      // changeStatus() {
		  //
      // },
      getUserInfo() {
        getUserInfo().then(res => {
          this.userInfo = res.data

          if (this.userInfo.status == 0) {
            this.userInfo.status = '1'
          }else {
            this.userInfo.status = '0'
          }
        })

      },
			// 添加打开弹窗
			open(){

				this.modal = true

			},
			change(userId,status){
        postUserInfo(userId,status).then(res => {
          this.$nextTick(() => {
            this.getUserInfo()
          })
        })
			},
			play(taskId,state){
				this.$Modal.confirm({
					title: '确认恢复暂停任务？',
					onOk: () => {
            postMyTaskState(taskId,state).then(res => {
              this.$nextTick(() => {
                this.getMyTask()
                this.getDistributeTask()


              })
            })
					}
				});
			},
			dropdown(taskId,status){
        postMyTaskStatus(taskId,status).then(res => {
          this.$nextTick(() => {
            this.getMyTask()
            this.getDistributeTask()
          })
        })
			},
			search(){},
			save(){
				this.resetForm()
			},
      checkTaskPerson(item){
        this.addMyTask.username=item.username
      },

			finish(){
		    postMyTask(this.addMyTask,this.memberId).then(res=>{
		      if (res.code == 10200) {
		        this.$Modal.confirm({
              title: '有参数未填',
              onOk: () =>{
                this.modal = true
              }
            })
          }else {
		        this.$nextTick(() => {
            this.getMyTask()
            this.getDistributeTask()
          })}


        })
				this.modal = false
				this.resetForm()
			},
			pause(taskId,state){
        this.$Modal.confirm({
          title: '确认暂停任务？',
          onOk: () => {
            postMyTaskState(taskId,state).then(res => {

              if (res.code != 200) {
                this.$Modal.confirm({
                  title: '待接收任务无法暂停',
                  onOk: () => {}
                })
              }

              this.$nextTick(() => {
                this.getMyTask()
                this.getDistributeTask()
              })
            })
          }
        });
			},
      endTask() {
		    this.$Modal.confirm({
          title:'确认是否删除任务？',
          onOk: () => {

          }
        })
      },
			stop(){
				this.$Modal.confirm({
					title: '确认是否暂停任务？',
					onOk: () => {
						
					}
				});
			},
			done(){
				this.$Modal.confirm({
					title: '确认是否完成任务？',
					onOk: () => {
						
					}
				});
			},
			ondragend(item, index) {
				if(this.fromId !=this.toId){
					switch (this.toId){
						case 'list1':
							this.list1[index].status = {id:1,name:'进行中'}
							this.$set(this.list1,index,this.list1[index])
							//this.$set(this.list1[index], `status`, {id:1,name:'进行中'})
							console.log(this.list1)
							break;
						case 'list2':
							this.list2[index].status = {id:2,name:'未开始'}
							this.$set(this.list2,index,this.list2[index])
							//this.$set(this.list2[index], `status`, {id:2,name:'未开始'})
							break;	
						case 'list3':
							this.list3[index].status = {id:3,name:'待接收'}
							this.$set(this.list3,index,this.list3[index])
							//this.$set(this.list3[index], `status`, {id:3,name:'待接收'})
							break;
						default:
							break;
					}
				}
			},
			end(e) {
				this.fromId = e.from.id
				this.toId = e.to.id
			},
			resetForm() {
        this.addMyTask = {
          user_id: '',
          pj_id: '',
          name: '',
          end_time: '',
          priority: '0',
          member_id: '',
          state: ''
        }
      },
			checkPerson(projectId,item){
        this.addMyTask.pjName = item.name
        getProMembers(projectId).then(res => {
          this.promember = res.data
          this.username = res.data.username


        });
			}
		}
	}
</script>

<style lang="scss" scoped>
	.grid>.ucard{
		width: calc(20% - 12px);
		margin-left: 15px;
	}
	.grid>.ucard:nth-child(5n+1){margin-left: 0;}
.ivu-rate,.ivu-progress{display: block;}
::v-deep .ivu-progress-text{float: right;color: #fff;}
::v-deep .ivu-rate-star::before {color: #494E59;}
::v-deep .ivu-rate-star-second{color: #483728;}
::v-deep .ivu-rate-star-full::before{color: #fff;}

.square{display: inline-block}
::v-deep .square .ivu-icon-ios-square{font-size: 16px;}
::v-deep .square .ivu-rate-star-chart{margin-right: 2px;}
::v-deep .input .ivu-input{background-color: #0F182A;color: #fff;text-align: left;}
::v-deep .search .ivu-input{background-color: #0F182A;border: none;color: #fff;}
::v-deep .ivu-form .ivu-form-item-label{color: #fff;}
::v-deep .form .ivu-form-item{margin-bottom: 0;}
::v-deep .ucard .ivu-progress-inner {background-color: #141e33;}
::v-deep .ucard .ivu-progress-bg {background-color: #fff;}
::v-deep .gay-bd .ivu-progress-bg{background-color: #B9BCC2;}
::v-deep .ivu-modal-content{background-color:#0C1321;color: #fff;}
::v-deep .ivu-modal-header {border-bottom: 1px solid #324364;}
::v-deep .ivu-modal-body {padding: 35px;}
::v-deep .ivu-modal-header-inner{color: #fff}
::v-deep .ivu-modal-close .ivu-icon-ios-close{color: #fff}
::v-deep .ivu-modal-footer {border-top:none}
::v-deep .ivu-select-arrow,::v-deep .ivu-input-suffix i{color: #fff;}
::v-deep textarea.ivu-input{background-color: #0F182A;}
::v-deep .ivu-time-picker-cells-cell,::v-deep .ivu-date-picker-header,::v-deep .ivu-date-picker-cells span em{color: #0F182A;}
::v-deep .ivu-progress-inner {background-color: #141E33;}
::v-deep .ivu-rate-text{float: right;margin-top: 5px;margin-left:0}
::v-deep .down .ivu-select-dropdown{background-color: #0F182A;border: 1px solid #BBBBBB;text-align: left;}
::v-deep .flex1 .ivu-select-dropdown{width: 216px;}
::v-deep .ivu-rate-star-chart{margin-right: 0;}
::v-deep .ivu-rate-star-full .ivu-icon {color: #fff;}
::v-deep .ivu-rate-star-zero .ivu-icon {color: #494E59;}
::v-deep .gay-bd .ivu-rate-star-full .ivu-icon {color: #B9BCC2;}
::v-deep .gay-bd .ivu-rate-star-zero .ivu-icon {color: #39404E;}
::v-deep .square .ivu-rate-star-full .ivu-icon {color: #FCA13E;vertical-align: baseline;}
::v-deep .square .ivu-rate-star-zero .ivu-icon {color: #4E3F36;vertical-align: baseline;}

.col5 .ps {
  height: 465px;
}
.last .ps{height: 415px;}
::v-deep .ivu-tooltip-inner {
	max-width: 340px;
	background-color: #0c1321;
	border-radius: 10px;
	border: 1px solid #2c3c5a;
}

.ivu-divider{background-color: #313849;}
.cbod{border: 1px solid #FEFEFE;border-radius: 4px;padding: 4px 12px;cursor: pointer;}
.info{
	display: flex;
	align-items: center;
	margin-bottom: 8px;
}
.info .label {
	width: 120px;
}
.uicon{
	width: 18px;
	height: 18px;
	margin-right: 10px;
	vertical-align: middle;
}

</style>
