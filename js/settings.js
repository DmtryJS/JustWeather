const {ipcRenderer} = require('electron')
const loadIniFile = require('read-ini-file')
const writeIniFile = require('write-ini-file')
const path = require('path')
const settings_path = path.join(__dirname, 'settings.ini')
const settings = loadIniFile.sync(settings_path)


var vue_settings = new Vue({
   	          el: '#settings_container',
   	          data: {
   	          	token_value: settings.token,
   	          	city: settings.city
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
              	 	}
        
              	 },

                mounted() {
                    
                }
  	 });