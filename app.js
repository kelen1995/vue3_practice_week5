import pagination from './components/pagination.js'
import delProductModal from './components/delProductModal.js';

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
            order: {
                user:{},
                message:'',
            },
        }
    },
    methods: {
        getProducts(page=1) {// 取得商品列表
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
            this.tempProduct = {qty:1, ...product};
            this.$refs.productModal.openModal();
        },
        hideProductModal() {
            this.$refs.productModal.hideModal();
        },
        getCarts() {// 取得購物車列表
            axios.get(`${apiUrl}/api/${apiPath}/cart`)
            .then(res => {
                this.cart = res.data.data;
            })
            .catch(err => {
                console.log(err.response);
            })
        },
        updateCarts(status, cart) {// 新增/修改購物車
            const {id, product_id, qty} = cart;
            // 新增購物車
            let method = 'post';
            let url = `${apiUrl}/api/${apiPath}/cart/`;

            if (status === 'edit') {// 更新購物車商品數量
                method = 'put';
                url = `${apiUrl}/api/${apiPath}/cart/${id}`;
            }

            // 發送請求
            axios[method](url, {
                data: {
                    product_id,
                    qty
                }
            })
            .then(res => {
                this.hideProductModal();
                this.getCarts();
            })
            .catch(err => {
                console.log(err);
            });
        },
        deleteCarts(status, cart) {
            let url = '';
            if (status === 'all') {//刪除全部購物車
                url = `${apiUrl}/api/${apiPath}/carts/`;
            } else if (status === 'single') {
                url = `${apiUrl}/api/${apiPath}/cart/${cart.id}`;// 刪除一筆購物車商品
            }
            axios.delete(url)
            .then(res => {
                this.hideDelProductModal();
                this.getCarts();
            })
            .catch(err => {
                console.log(err);
            });
        },
        openDelProductModal(status,title, cart) {
            this.$refs.delModal.openModal(status, title, cart);
        },
        hideDelProductModal() {
            this.$refs.delModal.hideModal();
        },
        submitOrder() {
            if (this.cart.carts.length < 1) {// 若購物車沒有資料，不發出請求
                alert('購物車目前沒有商品');
                return;
            }

            axios.post(`${apiUrl}/api/${apiPath}/order`, {
                data: {...this.order}
            })
            .then(res => {
                const {message, total} = res.data;
                alert(`${message}，總金額為 ${total}`);
                this.$refs.form.resetForm();
                this.order.message = '';
                this.getCarts();
            })
            .catch(err => {
                console.log(err);
            })
        }
    },
    mounted() {
        this.getProducts();
        this.getCarts();
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
        },
        hideModal() {
            this.modal.hide();
        },
        addCarts() {
            let cart = {product_id: this.product.id, qty: this.product.qty};
            this.$emit('addCarts','add', cart);
        }
    },
    mounted() {
        this.modal = new bootstrap.Modal(document.getElementById('productModal'), {});
    }
});
app.component('delProductModal', delProductModal);

app.component('VForm', VeeValidate.Form);
app.component('VField', VeeValidate.Field);
app.component('ErrorMessage', VeeValidate.ErrorMessage);

app.mount('#app');