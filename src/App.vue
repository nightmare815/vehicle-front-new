<template>
  <transition name="fade">
    <router-view></router-view>
  </transition>
</template>

<script>
  export default {
    name: 'App',
    created() {
      this.initConnection();
    },
    data() {
      return {
        subscribe_routingKey: ['/Car/Vehicle_sub/notify'],
      }
    },
    methods: {
      //建立一个全局的mqtt连接
      initConnection() {
        let that = this
        new Promise((resolve, reject) => {
          this.$rabbitmq.initConnect(1111, this.subscribe_routingKey, (topic, message) => {
            let msg = message.toString();
            let timestamp =Date.parse(new Date());
            //有消息到达时, 更新vuex中的当前毫秒数, 通过各个组件的watch监听vuex中的currentMillis来确认有新消息到达
            this.$store.commit('onmessage/UPDATE_MILLIS', timestamp)
          });
        }).then(res => {

        })
      }
    }
  }
</script>
<style>
  #app {
    min-width: 1200px;
  }
</style>
