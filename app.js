
async function getDashboardData(url = '/data.json') {
    const response = await fetch(url)
    const data = await response.json()

    return data
}

class DashboardItem {
    static PERIODS = {
        daily: 'day',
        weekly: 'week',
        monthly: 'month',
    }

    constructor(data, container = '.dashboard_content', view = 'weekly') {
        this.data = data
        this.container = document.querySelector(container)
        this.view = view

        this._createMarkup()
    }

    _createMarkup() {
        const {title, timeframes} = this.data
        const id = title.toLowerCase().replace(/ /g, '-')
        
        const {current, previous} = timeframes[this.view.toLowerCase()]

        this.container.insertAdjacentHTML('beforeend', `
        <div class="dashboard_items dashboard_item--${id}">
        <article class="tracking-card">
          <header class="tracking-card_header">
              <h4 class="tracking-card_title">${title}</h4>
              <img src="./images/icon-ellipsis.svg" class="tracking-card_menu" alt="menu">
          </header>
          <div class="tracking-card_body">
            <div class="tracking-card_time">${current}hrs</div>
            <div class="tracking-card_prev_period">Last ${DashboardItem.PERIODS[this.view]} - ${previous}hrs</div>
          </div>
        </article>
      </div>
        `)

        this.time = this.container.querySelector(`.dashboard_item--${id} .tracking-card_time`)
        this.prev = this.container.querySelector(`.dashboard_item--${id} .tracking-card_prev_period`)
    }

    changeView(view) {
      
        this.view = view.toLowerCase()
        const {current, previous} = this.data.timeframes[this.view.toLowerCase()]

        this.time.innerText = `${current}hrs` 
        this.prev.innerText = `Last ${DashboardItem.PERIODS[this.view]} - ${previous}hrs`

    }
}


document.addEventListener('DOMContentLoaded', () => {
    getDashboardData()
    .then(data => {
        const activities = data.map(activity => new DashboardItem(activity))

        const selectors = document.querySelectorAll('.view_selector_item')
        selectors.forEach(selector => selector.addEventListener('click', function () {
            selectors.forEach(sel => sel.classList.remove('view_selector_item--active'))
            selector.classList.add('view_selector_item--active')

            const currentView = selector.innerText.trim().toLowerCase()        //The trim() method removes whitespaces from start and end of str
            activities.forEach(activity => activity.changeView(currentView))
        }))
    })
})