var app = new Vue({
	el: '#app',
	data: {
		city: '',
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
			self.finded = cityList.filter(function(item) 
			{
				return expr.test(item)		
			})
		}
	},

	mounted() {

	}
})