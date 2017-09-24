const {ipcRenderer} = require('electron')
const loadIniFile = require('read-ini-file')
const writeIniFile = require('write-ini-file')
const path = require('path')
const settings_path = path.join(__dirname, 'settings.ini')
const settings = loadIniFile.sync(settings_path)
const cityList = require('./js/cityList');


var vue_settings = new Vue({
   	          el: '#settings_container',
   	          data: {
   	          	token_value: settings.token,
   	          	city: settings.city,
                citys: [],
                finded: [],
                search_visible: true
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
              	 	apply: function()
              	 	{
              	 		writeIniFile(settings_path, 
              	 			{
              	 				token: this.token_value,
              	 			   city: this.city
              	 			}).then(function()
              	 			{
									       ipcRenderer.send('routerEvent', 'index.html');
								      })
              	 	},
              	 	
              	 	cancel: function()
              	 	{
              	 		ipcRenderer.send('routerEvent', 'index.html');
              	 	}, 

                  search: function(val)
                  {
                      let self = this;
                      var expr = new RegExp('^' + val, 'i');
                      self.finded = cityList.filter(function(item) 
                      {
                          return expr.test(item)    
                      })
                  },

                  select: function(elem)
                  {
                     let self = this;
                     self.city = elem.target.innerText;
                     self.search_visible = false;
              
                     setTimeout(function(){
                        self.search_visible = true;
                        self.finded = [];
                     }, 1000);
                  }
        
              	 },

                mounted() {
                    
                }
  	 });