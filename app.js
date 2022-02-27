import pagination from './components/pagination.js'

// API 資訊
const apiUrl = 'https://vue3-course-api.hexschool.io/v2';
const apiPath = "kn99";

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
            products: [],
            tempProduct:{},
            pagination: {},
            cart: {
                carts:[],
            },
        }
    },
    methods: {
        getProducts(page=1) {
            axios.get(`${apiUrl}/api/${apiPath}/products?page=${page}`)
            .then(res => {
                this.products = res.data.products;
                this.pagination = res.data.pagination;
            })
            .catch(err => {
                console.log(err.response);
            })
        },
        openProductModal(product) {
            this.tempProduct = product;
            this.$refs.productModal.openModal();
        }
    },
    mounted() {
        this.getProducts();
    }
});

app.component('pagination', pagination);
app.component('productModal', {
    template: '#userProductModal',
    props:['product'],
    data() {
        return {
            modal:{},
        }
    },
    methods: {
        openModal() {
            this.modal.show();
        }
    },
    mounted() {
        this.modal = new bootstrap.Modal(document.getElementById('productModal'), {});
    }
})

app.component('VForm', VeeValidate.Form);
app.component('VField', VeeValidate.Field);
app.component('ErrorMessage', VeeValidate.ErrorMessage);

app.mount('#app');