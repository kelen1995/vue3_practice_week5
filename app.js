
// 加入所有規則
Object.keys(VeeValidateRules).forEach(rule => {
    if (rule !== 'default') {
      VeeValidate.defineRule(rule, VeeValidateRules[rule]);
    }
});

// 讀取中文語系檔
VeeValidateI18n.loadLocaleFromURL('./zh_TW.json');

// 表單功能設定
VeeValidate.configure({
  generateMessage: VeeValidateI18n.localize('zh_TW'), // Activate the locale
  validateOnInput: true, // 調整為：輸入文字時，就立即進行驗證
});

// 建立 root component
const app = Vue.createApp({
    data() {
        return {
            cart: {
                carts:[],
            },
        }
    },
});

app.component('VForm', VeeValidate.Form);
app.component('VField', VeeValidate.Field);
app.component('ErrorMessage', VeeValidate.ErrorMessage);

app.mount('#app');