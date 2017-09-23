var app = new Vue({
	el: '#app',
	data: {
		city: 'Город сдесь',
		citys: [],
		finded: []
	},
	watch: {
		city: function(val, oldVal)
		{
			this.finded = [];
			if(val.length >= 2)
			{		
				this.search(val)
			}
		}
	},

	methods: {
		search: function(val)
		{
			let self = this;
			var expr = new RegExp('^' + val, 'i');
			cityList.forEach(function(item, i, arr) {
				if(expr.test(item))
				{
					self.finded.push(arr[i])
				}
			})
		}
	},

	mounted() {

	}
})