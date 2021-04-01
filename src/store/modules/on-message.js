const state = {
  //上次有新消息到来时的毫秒数
  lastMessageMillis: 0
}

const mutations = {   //修改state中的状态通过mutation,方法默认都有一个参数state
  UPDATE_MILLIS: (state, currentMillis) => {
    state.lastMessageMillis = currentMillis
  },
}

const actions = {     //异步修改操作在action中做

}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
