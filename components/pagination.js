
export default {
    template: `
    <nav aria-label="Page navigation example">
        <ul class="pagination justify-content-center">
        <li class="page-item" :class="{disabled:!pagination.has_pre}">
            <a class="page-link" href="#" aria-label="Previous" @click="switchPage(pagination.current_page-1)">
                <span aria-hidden="true">&laquo;</span>
            </a>
        </li>
        <li class="page-item" v-for="page in pagination.total_pages"  @click="switchPage(page)"><a class="page-link" href="#">{{page}}</a></li>
        <li class="page-item" :class="{disabled:!pagination.has_next}">
            <a class="page-link" href="#" aria-label="Next" @click="switchPage(pagination.current_page+1)">
                <span aria-hidden="true">&raquo;</span>
            </a>
        </li>
        </ul>
    </nav>`,
    props:['pagination'],
    data() {
        return {
        }
    },
    methods: {
        switchPage(page) {
            this.$emit('switch-page', page)
        }
    }
}