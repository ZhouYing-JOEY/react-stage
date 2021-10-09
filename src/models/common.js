export default {
    state: {
      rootTitle: '脚手架',
      userinfo: null,
      collapsed: false,
    },
  
    reducers: {
      toggleCollapsed(state, payload) {
        return { ...state, collapsed: payload };
      },

      setUserInfo(state, payload) {
        return { ...state, userinfo: payload };
      },
    },
  
    effects: {
      async getUserinfo(params = {}) {
        const user = { id: params.id, username: "admin" };
        this.setUserInfo(user);
        return user;
      },
    },
  };